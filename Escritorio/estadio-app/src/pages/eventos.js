import { eventos } from '../data/mock.js'

function formatFecha(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

export async function renderEventos() {
  return `
  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl sm:text-4xl text-arena">Eventos programados</h1>
    <p class="mt-2 text-niebla max-w-xl">Todo lo que necesitas saber antes de venir al estadio.</p>

    <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${eventos
        .map(
          (ev) => `
        <a href="#/eventos/${ev.id}" class="group block rounded-[var(--radius-card)] overflow-hidden border border-white/10 bg-noche-alta hover:border-turquesa/40 transition-colors">
          <div class="aspect-[16/9] overflow-hidden">
            <img src="${ev.imagen}" alt="${ev.nombre}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between text-[11px] font-mono text-niebla">
              <span>${formatFecha(ev.fecha)}</span>
              <span class="text-turquesa-alta">${ev.estado}</span>
            </div>
            <h3 class="mt-2 font-display text-lg text-arena leading-tight">${ev.nombre}</h3>
            <p class="mt-1 text-xs text-niebla">${ev.tipo} · ${ev.ubicacion}</p>
          </div>
        </a>`
        )
        .join('')}
    </div>
  </section>`
}

export async function renderEventoDetalle({ id }) {
  const ev = eventos.find((e) => e.id === id)

  if (!ev) {
    return `
    <section class="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
      <p class="font-display text-2xl text-arena">Evento no encontrado</p>
      <a href="#/eventos" class="mt-4 inline-block text-turquesa-alta hover:underline">← Volver a eventos</a>
    </section>`
  }

  return `
  <section class="relative border-b border-white/10">
    <div class="aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
      <img src="${ev.imagen}" alt="${ev.nombre}" class="w-full h-full object-cover" />
    </div>
  </section>

  <section class="max-w-5xl mx-auto px-4 sm:px-6 py-10">
    <a href="#/eventos" class="text-sm text-niebla hover:text-turquesa-alta">← Todos los eventos</a>

    <div class="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-mono text-niebla">
      <span>${formatFecha(ev.fecha)} · ${ev.hora}</span>
      <span class="text-turquesa-alta">${ev.estado}</span>
      <span>${ev.tipo}</span>
    </div>
    <h1 class="mt-3 font-display text-3xl sm:text-4xl text-arena">${ev.nombre}</h1>
    <p class="mt-3 text-niebla max-w-2xl">${ev.descripcion}</p>

    <div class="mt-4 p-4 rounded-[var(--radius-card)] bg-amarillo/10 border border-amarillo/30 text-sm text-arena">
      <span class="font-bold text-amarillo">Recomendación:</span> ${ev.recomendaciones}
    </div>

    <div class="mt-10 grid sm:grid-cols-2 gap-6">
      <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta">
        <h2 class="font-display text-lg text-arena mb-3">Horarios</h2>
        <dl class="space-y-2 text-sm">
          ${row('Apertura de puertas', ev.apertura)}
          ${row('Ventana de ingreso', ev.ingreso)}
          ${row('Cierre del evento', ev.cierre)}
          ${row('Organizador', ev.organizador)}
          ${row('Ubicación', ev.ubicacion)}
        </dl>
      </div>

      <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta">
        <h2 class="font-display text-lg text-arena mb-3">Seguridad</h2>
        <p class="text-sm text-niebla">${ev.seguridad}</p>
      </div>

      <div class="p-5 rounded-[var(--radius-card)] border border-turquesa/20 bg-turquesa/5">
        <h2 class="font-display text-lg text-turquesa-alta mb-3">Objetos permitidos</h2>
        <ul class="space-y-1.5 text-sm text-arena">
          ${ev.permitido.map((p) => `<li class="flex gap-2"><span class="text-turquesa-alta">✓</span>${p}</li>`).join('')}
        </ul>
      </div>

      <div class="p-5 rounded-[var(--radius-card)] border border-coral/20 bg-coral/5">
        <h2 class="font-display text-lg text-coral mb-3">Objetos prohibidos</h2>
        <ul class="space-y-1.5 text-sm text-arena">
          ${ev.prohibido.map((p) => `<li class="flex gap-2"><span class="text-coral">✕</span>${p}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="mt-10 p-6 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta text-center">
      <p class="font-display text-lg text-arena">¿Tienes dudas sobre este evento?</p>
      <p class="mt-1 text-sm text-niebla">Pregúntale al asistente inteligente — botón inferior derecho.</p>
    </div>
  </section>`
}

function row(label, value) {
  return `
  <div class="flex justify-between gap-4 border-b border-white/5 pb-2">
    <dt class="text-niebla">${label}</dt>
    <dd class="text-arena font-medium text-right">${value}</dd>
  </div>`
}
