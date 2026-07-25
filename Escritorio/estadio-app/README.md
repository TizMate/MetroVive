# Estadio Metropolitano — Asistente Inteligente (prototipo hackathon)

Prototipo de app web para el Estadio Metropolitano Roberto Meléndez
(Barranquilla). Stack: **HTML + JS puro (Vite) + Tailwind CSS v4**, con un
chatbot conectado a un LLM real vía un backend propio.

## Estructura

```
estadio-app/
├── index.html
├── vite.config.js          # incluye proxy /api → backend del chatbot
├── src/
│   ├── main.js              # arranca router + layout + chatbot
│   ├── style.css            # sistema de diseño (colores, tipografía)
│   ├── lib/
│   │   ├── router.js         # router SPA basado en #hash
│   │   └── chat.js           # llama al backend del chatbot
│   ├── components/
│   │   ├── header.js         # nav + ticker tipo marcador
│   │   ├── footer.js
│   │   └── chatbot.js        # widget flotante del asistente
│   ├── data/mock.js          # datos de ejemplo (luego vendrán de PostgreSQL)
│   └── pages/                # una página por sección del brief
└── server/                   # backend Node/Express para el LLM real
    ├── index.js               # POST /api/chat → API de Anthropic
    └── .env.example
```

## Cómo correr el frontend

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Cómo conectar el chatbot a un LLM real

El chatbot llama a `/api/chat`. **La API key nunca debe vivir en el
frontend**, así que ese endpoint lo sirve un backend aparte:

```bash
cd server
cp .env.example .env      # pega tu ANTHROPIC_API_KEY
npm install
npm run dev                # backend en http://localhost:8787
```

Con el frontend (`npm run dev` en la raíz) y el backend corriendo a la vez,
Vite redirige automáticamente `/api/*` hacia `http://localhost:8787`
(configurado en `vite.config.js`).

Si el backend no está corriendo, el chatbot sigue funcionando con
respuestas simuladas (`src/lib/chat.js`) para que la demo nunca se vea rota.

## Siguientes pasos sugeridos

- Conectar `src/data/mock.js` a endpoints reales sobre PostgreSQL.
- Dar contexto del evento activo al `system` prompt del chatbot (fecha,
  puerta del usuario, clima) para respuestas más personalizadas.
- Autenticación real de usuarios y panel de administrador (crear/editar
  eventos, gestionar objetos perdidos y notificaciones).
- Mapa con coordenadas reales y cálculo de ruta desde la ubicación del
  usuario.

## Sistema de diseño

Paleta inspirada en el Caribe y el Carnaval de Barranquilla (no la
paleta genérica típica de IA): noche de estadio (`--color-noche`),
turquesa Caribe (`--color-turquesa`), amarillo Carnaval
(`--color-amarillo`) y coral (`--color-coral`). Tipografía: **Anton**
(display, condensada, tipo marcador) + **Manrope** (texto) + **JetBrains
Mono** (datos, horarios, chips). Definidos como tokens `@theme` en
`src/style.css`.
