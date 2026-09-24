# Contexto técnico del portafolio

Este documento permite continuar el proyecto sin tener que reconstruir sus decisiones técnicas.

## Objetivo

Presentar a Victor Nieto como desarrollador full stack mediante un sitio rápido, visual e interactivo que pueda mantenerse sin backend y publicarse en GitHub Pages.

La versión actual es un refactor de una implementación monolítica en HTML, CSS y JavaScript. La apariencia y las interacciones originales se conservaron, pero la lógica quedó separada en componentes React, hooks, servicios y contratos TypeScript.

## Decisiones principales

### React + TypeScript + Vite

React permite que proyectos, habilidades y trayectoria sean componentes independientes. TypeScript protege el contrato del contenido y de la API de GitHub. Vite genera archivos estáticos y evita la complejidad de Next.js, que no aportaría beneficios claros a una página sin servidor ni rutas.

### GSAP como único motor de animación DOM

GSAP y ScrollTrigger controlan:

- Timeline de entrada del hero.
- Revelado progresivo de secciones.
- Contadores de estadísticas y barra de lenguajes.
- Barra de progreso y navegación activa.
- Transiciones de filtros.
- Cursor, magnetismo y tilt de tarjetas.

No se usa Framer Motion para evitar dos motores de animación con responsabilidades superpuestas. Las animaciones se limpian mediante `gsap.context()` cuando React vuelve a renderizar.

### Three.js aislado y diferido

`HeroScene.tsx` contiene la escena WebGL completa. React la carga con `lazy()` y `Suspense`, por lo que Three.js queda fuera del bundle inicial. La escena:

- Reacciona al puntero mediante raycasting.
- Actualiza sus colores al cambiar el tema.
- Reduce geometría y pixel ratio en equipos pequeños.
- Pausa el render cuando el hero sale del viewport.
- Respeta movimiento reducido.
- Libera geometrías, materiales, observadores y el renderer al desmontarse.

### CSS nativo

`styles.css` conserva los tokens, temas y diseño original. Tailwind no se incorporó porque el sistema visual ya estaba resuelto y migrarlo agregaría ruido sin mejorar el resultado. Los estilos siguen una convención BEM ligera.

## Flujo de datos

1. `src/data/portfolio.ts` exporta el contenido local con el contrato `PortfolioConfig`.
2. `useRepositories()` muestra inmediatamente el respaldo local.
3. `getGithubRepositories()` consulta hasta 100 repositorios públicos y sus lenguajes.
4. La respuesta se guarda 30 minutos en `sessionStorage`.
5. `Projects` cruza cada `featured.repo` con el nombre real del repositorio.
6. Los repositorios restantes aparecen en “Otros proyectos”, salvo forks, ocultos y el repositorio de perfil.
7. `Stats` agrega los bytes por lenguaje para calcular porcentajes.

La API de GitHub se consume sin token. Su límite puede agotarse; por eso el respaldo local es parte del comportamiento esperado y no un estado de error visible.

## Mapa de archivos

- `src/App.tsx`: composición global y conexión de hooks.
- `src/data/portfolio.ts`: única fuente de contenido editable.
- `src/types/portfolio.ts`: contratos del contenido y GitHub.
- `src/services/github.ts`: consulta, caché y datos de respaldo.
- `src/hooks/usePageAnimations.ts`: timelines y ScrollTrigger.
- `src/hooks/useRepositories.ts`: estado de carga y fallback.
- `src/hooks/useTheme.ts`: tema persistente y color del navegador.
- `src/components/HeroScene.tsx`: escena WebGL.
- `src/components/PointerEffects.tsx`: cursor, magnetismo, tilt y luces de tarjetas.
- `src/components/Projects.tsx`: filtros y tarjetas de proyectos.
- `styles.css`: tokens, layout, componentes y responsive.
- `scripts/visual-check.mjs`: prueba visual automatizada de escritorio y móvil.
- `.github/workflows/deploy.yml`: build y publicación en Pages.

## Convenciones de mantenimiento

- Mantener el contenido personal fuera de los componentes; debe vivir en `portfolio.ts`.
- Añadir campos nuevos primero a `PortfolioConfig`.
- Mantener GSAP para animación DOM y Three.js únicamente para WebGL.
- Toda animación nueva debe tener una alternativa válida bajo `prefers-reduced-motion`.
- Los efectos deben eliminar listeners, observers, timers y recursos gráficos en su cleanup.
- No depender de que GitHub esté disponible para renderizar el contenido principal.
- Probar a 390 px y 1440 px después de cambios de layout.

## Validación

La entrega se considera válida cuando pasan:

```bash
npm run typecheck
npm run build
```

Para el control visual, primero ejecuta `npm run preview` y después, en otra terminal, `npm run check:visual`. La prueba usa Microsoft Edge instalado localmente, visita el sitio en escritorio y móvil, recorre toda la página y guarda capturas en el directorio temporal del sistema.

## Pendientes de contenido

- El CV se importa desde `CV VICTOR NIETO.pdf` y Vite genera su URL final.
- La fotografía se importa desde `assets/perfil-portfolio.webp`; LinkedIn está configurado con el perfil `victor-nieto-773858258`.
- El CV menciona séptimo y octavo semestre en secciones distintas; el sitio evita publicar un número hasta confirmarlo.
- La experiencia en Finanzauto indica una duración de seis meses, pero no incluye fechas exactas.

Estos pendientes no impiden compilar. El monograma reemplaza la fotografía y LinkedIn no se renderiza mientras su valor esté vacío.
