import praiseMusicAwards from "../../assets/praise-music-awards.jpg";
import profilePhoto from "../../assets/perfil-portfolio.webp";
import cvUrl from "../../CV VICTOR NIETO.pdf?url";
import type { PortfolioConfig } from "../types/portfolio";

/** Fuente única de contenido del portafolio. */
export const portfolio = {
  githubUser: "elvicticor",
  name: "Victor Nieto",
  role: "Desarrollador Full Stack",
  tagline:
    "Construyo aplicaciones web completas y automatizo su calidad: interfaces, APIs, bases de datos y pruebas E2E con una visión de producto de punta a punta.",
  location: "Bogotá, Colombia",
  email: "andresnietoquintero@gmail.com",
  phone: "+57 301 525 3523",
  cv: cvUrl,
  photo: profilePhoto,
  linkedin: "https://www.linkedin.com/in/victor-nieto-773858258/",
  available: false,

  about: [
    "Soy estudiante de Ingeniería de Software en la Universitaria de Colombia y desarrollador full stack con enfoque en ingeniería de datos. Diseño flujos ETL y ELT para extraer, transformar, integrar y modelar información, apoyándome en AWS para construir procesos de datos organizados y preparados para el análisis.",
    "Conecto esos datos con bases SQL, APIs, Power BI y Excel para convertirlos en información útil. Complemento este perfil con desarrollo web y QA: construyo productos con React, TypeScript, Rust, Node.js y Python, y automatizo pruebas E2E con Cypress, Maestro Studio y LLMs.",
  ],

  skills: {
    Frontend: ["TypeScript", "JavaScript", "React", "Astro", "Vite", "Tailwind CSS", "GSAP", "HTML5 y CSS3"],
    Backend: ["Rust", "Axum", "Node.js", "Express", "Python", "Flask", "FastAPI", "C# y .NET", "C++"],
    "Ingeniería de datos": ["ETL", "ELT", "AWS", "SQL", "PostgreSQL", "MySQL", "SQL Server", "Power BI", "Excel"],
    "QA y herramientas": ["Cypress", "Maestro Studio", "Docker", "Git", "GitHub Actions", "Figma", "Postman", "AI / LLMs"],
  },
  dataPipeline: [
    { label: "Fuentes", detail: "APIs · SQL · archivos" },
    { label: "ETL / ELT", detail: "extracción · transformación" },
    { label: "AWS", detail: "procesamiento en la nube" },
    { label: "Modelado", detail: "datos listos para análisis" },
    { label: "Consumo", detail: "Power BI · Excel · apps" },
  ],
  softSkills: ["Trabajo colaborativo", "Comunicación", "Análisis lógico", "Resolución de problemas", "Orientación a resultados", "Aprendizaje continuo", "Creatividad"],
  languages: ["Español", "Inglés"],

  experience: [
    {
      period: "6 meses · Bogotá",
      title: "Aprendiz Universitario · Finanzauto",
      text: "Desarrollo y QA: automatización E2E con Cypress y Maestro Studio, generación de casos de prueba con LLMs, revisión de código y mantenimiento de repositorios.",
    },
    {
      period: "Actualidad",
      title: "Desarrollador Full Stack · Proyectos propios",
      text: "Diseño, desarrollo y despliegue de aplicaciones completas con React, TypeScript, Rust, Node.js, Python y bases de datos SQL.",
    },
  ],
  education: [
    {
      period: "2023 — Actualidad",
      title: "Ingeniería de Software",
      text: "Universitaria de Colombia · Bogotá.",
    },
    {
      period: "Cursos y certificaciones",
      title: "Programación, seguridad y datos",
      text: "Programming Essentials in C++ (Cisco); hacking ético, Python, SQL, MariaDB, Power BI y Excel (Udemy).",
    },
  ],

  featured: [
    {
      repo: "Pokeverse",
      title: "PokéVerse",
      summary: "Pokédex en español con los 1302 Pokémon, sus formas especiales y su línea evolutiva, más un mercado con precios de unas 22.000 cartas TCG.",
      highlights: ["Cuadrícula virtualizada: solo se dibujan los Pokémon visibles", "Debilidades y resistencias calculadas por tipo", "Precios de Cardmarket y TCGPlayer filtrables"],
      tech: ["TypeScript", "Vite", "PokéAPI", "GitHub Pages"],
      image: "https://raw.githubusercontent.com/elvicticor/Pokeverse/main/docs/pokedex.jpg",
      demo: "https://elvicticor.github.io/Pokeverse/",
      category: "frontend",
    },
    {
      repo: "Page_Santiago",
      title: "Praise Music Awards",
      summary: "Sitio de una gala de premios de música cristiana, con votación del público, autenticación y resultados agregados en tiempo real.",
      highlights: ["Votación con cuentas de usuario sobre Supabase", "Animaciones de scroll con GSAP", "Islas de React dentro de un sitio estático en Astro"],
      tech: ["Astro", "React", "GSAP", "Supabase", "PostgreSQL"],
      image: praiseMusicAwards,
      demo: "https://elvicticor.github.io/Page_Santiago/",
      category: "frontend",
    },
    {
      repo: "Back-restaurant-with-docker",
      title: "Restaurant Backend",
      summary: "Backend para la gestión de un restaurante, pensado para la concurrencia: órdenes, mesas y estado de cocina notificados en tiempo real.",
      highlights: ["API asíncrona con Axum y Tokio", "WebSockets nativos para el estado de órdenes", "PostgreSQL 16 y servicio orquestados con Docker Compose"],
      tech: ["Rust", "Axum", "WebSockets", "PostgreSQL", "Docker"],
      category: "backend",
    },
    {
      repo: "Biblioteca",
      title: "Biblioteca Virtual",
      summary: "Sistema de gestión de biblioteca con autenticación, catálogo de libros e integración con la API del sistema bibliotecario Koha.",
      highlights: ["Frontend en React 19 con rutas protegidas", "API REST en Express sobre MySQL", "Conexión con la API de Koha"],
      tech: ["React", "Express", "MySQL", "Tailwind CSS"],
      category: "fullstack",
    },
    {
      repo: "PRUEBA-DIPLO",
      title: "Laboratorio de inyección SQL",
      summary: "Dos versiones del mismo servidor, una vulnerable y otra segura, para mostrar cómo funciona una inyección SQL y cómo se previene.",
      highlights: ["Servidor vulnerable frente a servidor seguro", "Consultas parametrizadas", "Scripts SQL de prueba"],
      tech: ["Node.js", "SQL", "Seguridad"],
      category: "backend",
    },
  ],
  otherDescriptions: {
    "SPRINT-1": "API REST con FastAPI y MongoDB, organizada en modelos, esquemas y rutas.",
    Proyecto4: "Guía inicial para crear una aplicación web con Python.",
  },
  hidden: [],
} satisfies PortfolioConfig;
