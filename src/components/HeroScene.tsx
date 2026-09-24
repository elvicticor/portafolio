import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Theme } from "../hooks/useTheme";

interface HeroSceneProps { theme: Theme }

export function HeroScene({ theme }: HeroSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 9;
    const group = new THREE.Group();
    scene.add(group);

    const cssColor = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const base = new THREE.IcosahedronGeometry(2, window.innerWidth < 700 ? 4 : 5);
    const positions = base.attributes.position;
    const pointsGeometry = new THREE.BufferGeometry();
    const unique = new Set<string>();
    const vertices: number[] = [];
    for (let index = 0; index < positions.count; index += 1) {
      const key = `${positions.getX(index).toFixed(3)},${positions.getY(index).toFixed(3)},${positions.getZ(index).toFixed(3)}`;
      if (unique.has(key)) continue;
      unique.add(key);
      vertices.push(positions.getX(index), positions.getY(index), positions.getZ(index));
    }
    base.dispose();
    pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    pointsGeometry.setAttribute("aRand", new THREE.Float32BufferAttribute(vertices.filter((_, index) => index % 3 === 0).map(() => Math.random()), 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 1) },
      uHover: { value: 0 },
      uColorA: { value: new THREE.Color(cssColor("--accent")) },
      uColorB: { value: new THREE.Color(cssColor("--accent-2")) },
      uColorBase: { value: new THREE.Color(cssColor("--muted")) },
      uPixel: { value: renderer.getPixelRatio() },
      uAlpha: { value: 1 },
    };

    const pointsMaterial = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        uniform float uTime, uHover, uPixel;
        uniform vec3 uMouse;
        attribute float aRand;
        varying float vHeat;
        varying float vDepth;
        vec3 hash(vec3 p){ p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));return -1.0+2.0*fract(sin(p)*43758.5453); }
        float noise(vec3 p){
          vec3 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
          return mix(mix(mix(dot(hash(i),f),dot(hash(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),mix(dot(hash(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(hash(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),mix(mix(dot(hash(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(hash(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),mix(dot(hash(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(hash(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
        }
        void main(){
          vec3 n=normalize(position);
          float wave=noise(n*1.8+uTime*0.25)*0.35;
          float d=distance(n,normalize(uMouse));
          float bulge=smoothstep(0.9,0.0,d)*uHover;
          vHeat=clamp(bulge*1.4+wave*0.8,0.0,1.0);
          vec3 p=n*(2.0+wave+bulge*0.55);
          vec4 mv=modelViewMatrix*vec4(p,1.0);
          vDepth=smoothstep(-11.0,-7.0,mv.z);
          gl_Position=projectionMatrix*mv;
          gl_PointSize=(1.6+aRand*1.8+bulge*3.0)*uPixel*(9.0/-mv.z);
        }`,
      fragmentShader: `
        uniform vec3 uColorA,uColorB,uColorBase;
        uniform float uAlpha;
        varying float vHeat,vDepth;
        void main(){
          float r=length(gl_PointCoord-0.5);
          if(r>0.5) discard;
          vec3 hot=mix(uColorB,uColorA,vHeat);
          vec3 color=mix(uColorBase,hot,smoothstep(0.05,0.6,vHeat));
          gl_FragColor=vec4(color,smoothstep(0.5,0.1,r)*(0.25+vDepth*0.75)*uAlpha);
        }`,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    const ringMaterial = new THREE.LineBasicMaterial({ color: cssColor("--muted"), transparent: true, opacity: 0.25 });
    const rings = [3.1, 3.7].map((radius, index) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius).getPoints(160);
      const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(curve), ringMaterial);
      ring.rotation.set(1.2 + index * 0.35, 0.3 - index * 0.5, 0);
      group.add(ring);
      return ring;
    });
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color: cssColor("--accent") });
    const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), satelliteMaterial);
    rings[0].add(satellite);

    const hitGeometry = new THREE.SphereGeometry(2.3, 24, 24);
    const hitMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);
    points.add(hitMesh);
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(2, 2);
    const mouse = { nx: 0, ny: 0 };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      mouse.nx = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.ny = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      pointerNdc.set(mouse.nx, mouse.ny);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const wide = width > 860;
      group.position.set(wide ? 3.3 : 0.8, wide ? -0.1 : -1.6, 0);
      group.scale.setScalar(wide ? 0.95 : 0.75);
      uniforms.uAlpha.value = wide ? 1 : 0.45;
      ringMaterial.opacity = wide ? 0.25 : 0.12;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    resize();

    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibilityObserver.observe(hero);
    const clock = new THREE.Clock();
    const target = { x: 0, y: 0 };
    let animationFrame = 0;

    const render = () => {
      animationFrame = requestAnimationFrame(render);
      if (!visible) return;
      const time = clock.getElapsedTime();
      uniforms.uTime.value = time;
      target.x += (mouse.ny * 0.35 - target.x) * 0.05;
      target.y += (mouse.nx * 0.5 - target.y) * 0.05;
      group.rotation.x = target.x;
      group.rotation.y = target.y + time * 0.08;
      rings[0].rotation.z = time * 0.2;
      rings[1].rotation.z = -time * 0.12;
      satellite.position.set(Math.cos(time * 0.9) * 3.1, Math.sin(time * 0.9) * 3.1, 0);
      camera.position.x += (mouse.nx * 0.4 - camera.position.x) * 0.04;
      camera.position.y += (mouse.ny * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(group.position.x * 0.3, 0, 0);
      raycaster.setFromCamera(pointerNdc, camera);
      const hit = raycaster.intersectObject(hitMesh)[0];
      if (hit) uniforms.uMouse.value.lerp(points.worldToLocal(hit.point.clone()), 0.2);
      uniforms.uHover.value += ((hit ? 1 : 0) - uniforms.uHover.value) * 0.06;
      renderer.render(scene, camera);
    };
    if (reducedMotion) renderer.render(scene, camera);
    else render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      rings.forEach((ring) => ring.geometry.dispose());
      ringMaterial.dispose();
      satellite.geometry.dispose();
      satelliteMaterial.dispose();
      hitGeometry.dispose();
      hitMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return <canvas ref={canvasRef} id="hero-canvas" aria-hidden="true" />;
}
