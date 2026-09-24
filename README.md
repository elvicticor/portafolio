# Portafolio · Victor Nieto

Portafolio personal construido con React, TypeScript y Vite. Incluye animaciones de scroll con GSAP, una escena interactiva con Three.js y carga automática de repositorios públicos desde GitHub.

## Stack elegido

- **React + TypeScript:** componentes reutilizables y datos validados por tipos.
- **Vite:** desarrollo rápido y salida estática compatible con GitHub Pages.
- **GSAP + ScrollTrigger:** entradas, contadores, progreso de lectura, filtros y efectos ligados al scroll.
- **Three.js:** escena de partículas interactiva del hero, cargada de forma diferida.
- **CSS nativo:** conserva el sistema visual actual sin añadir el peso o la abstracción de Tailwind.

Next.js no es necesario porque no hay servidor, rutas dinámicas ni renderizado del lado del servidor. Framer Motion tampoco se añade porque GSAP ya cubre las animaciones y evitar dos motores reduce el JavaScript enviado al navegador.

## Desarrollo local

Requiere Node.js 22 o posterior.

```bash
npm install
npm run dev
```

Comandos disponibles:

```bash
npm run dev           # servidor de desarrollo
npm run typecheck     # validación estricta de TypeScript
npm run build         # compilación de producción en dist/
npm run preview       # vista previa de dist/
npm run check:visual  # QA con Edge y el preview activo en el puerto 4173
```

## Editar el contenido

La fuente única de contenido es [`src/data/portfolio.ts`](src/data/portfolio.ts). Allí se configuran:

- Nombre, rol, ubicación, correo, teléfono y disponibilidad.
- GitHub, LinkedIn, fotografía y CV.
- Texto de presentación, habilidades, experiencia y formación.
- Proyectos destacados, demos, tecnologías y repositorios ocultos.

Los repositorios que no aparecen en `featured` se cargan desde la API pública de GitHub y se muestran en “Otros proyectos”. Si la API falla o alcanza su límite, [`src/services/github.ts`](src/services/github.ts) proporciona datos locales de respaldo.

### Archivos personales

- El CV actual se importa desde `CV VICTOR NIETO.pdf` y Vite lo incluye en la compilación.
- La fotografía optimizada se importa desde `assets/perfil-portfolio.webp`.
- Si `photo` está vacío se muestra el monograma `VN`.
- Si `linkedin` está vacío el enlace no se renderiza.

## Arquitectura

```text
src/
├── components/        Secciones visuales y escena Three.js
├── data/portfolio.ts  Contenido editable
├── hooks/             Tema, GitHub y animaciones GSAP
├── lib/               Utilidades visuales
├── services/          Cliente y respaldo de la API de GitHub
├── types/             Contratos TypeScript
├── App.tsx            Composición de la página
└── main.tsx           Entrada de React
```

Los detalles técnicos y las decisiones de mantenimiento están documentados en [`CONTEXT.md`](CONTEXT.md).

## Accesibilidad y rendimiento

- Respeta `prefers-reduced-motion`.
- Incluye navegación por teclado, foco visible y enlace para saltar al contenido.
- La escena 3D se pausa fuera del viewport y libera sus recursos al desmontarse.
- Three.js se descarga en un chunk diferido para no bloquear la carga inicial.
- Las llamadas a GitHub se almacenan durante 30 minutos en `sessionStorage`.

## Publicar en GitHub Pages

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) compila y publica automáticamente cada push a `main`.

En GitHub, selecciona **Settings → Pages → Source → GitHub Actions**. El sitio está configurado con rutas relativas, por lo que funciona tanto en un dominio de usuario como en un repositorio de proyecto.

## Pendiente antes de publicar

- Confirmar el semestre actual, ya que el CV menciona séptimo y octavo semestre en secciones diferentes.
- Añadir las fechas exactas de la experiencia en Finanzauto.
