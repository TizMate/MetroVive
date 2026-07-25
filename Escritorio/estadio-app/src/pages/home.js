import { eventos } from '../data/mock.js'

function formatFecha(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function eventCard(ev) {
  return `
  <a href="#/eventos/${ev.id}" class="group block rounded-[var(--radius-card)] overflow-hidden border border-white/10 bg-noche-alta hover:border-turquesa/40 transition-colors">
    <div class="aspect-[16/9] overflow-hidden">
      <img src="${ev.imagen}" alt="${ev.nombre}" loading="lazy"
           class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div class="p-4">
      <div class="flex items-center justify-between text-[11px] font-mono text-niebla">
        <span>${formatFecha(ev.fecha)} · ${ev.hora}</span>
        <span class="text-turquesa-alta">${ev.estado}</span>
      </div>
      <h3 class="mt-2 font-display text-lg text-arena leading-tight">${ev.nombre}</h3>
      <p class="mt-1 text-xs text-niebla">${ev.tipo}</p>
    </div>
  </a>`
}

export async function renderHome() {
  const destacado = eventos[0]

  return `
  <section class="relative border-b border-white/10 overflow-hidden">
    <div class="absolute inset-0">
      <img src="${destacado.imagen}" alt="" class="w-full h-full object-cover opacity-25" />
      <div class="absolute inset-0 bg-gradient-to-t from-noche via-noche/90 to-noche/40"></div>
    </div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <p class="font-mono text-xs text-amarillo tracking-widest uppercase">Próximo evento · Puerta abierta 2h 30min antes</p>
      <h1 class="mt-4 font-display text-4xl sm:text-6xl text-arena leading-[0.95] max-w-2xl">
        ${destacado.nombre}
      </h1>
      <p class="mt-4 text-niebla max-w-xl">${destacado.descripcion}</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#/eventos/${destacado.id}" class="px-5 py-2.5 rounded-[var(--radius-card)] bg-amarillo text-noche font-bold text-sm hover:brightness-95">
          Ver detalles del evento
        </a>
        <a href="#/mapa" class="px-5 py-2.5 rounded-[var(--radius-card)] border border-white/20 text-arena font-bold text-sm hover:border-turquesa">
          Ver mapa del estadio
        </a>
      </div>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
    <div class="flex items-end justify-between mb-6">
      <h2 class="font-display text-2xl text-arena">Próximos eventos</h2>
      <a href="#/eventos" class="text-sm text-turquesa-alta hover:underline">Ver todos →</a>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${eventos.map(eventCard).join('')}
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
    <div class="grid sm:grid-cols-3 gap-5">
      ${quickLink('#/mapa', 'Mapa interactivo', 'Entradas, baños, graderías y salidas de emergencia.')}
      ${quickLink('#/objetos-perdidos', 'Objetos perdidos', 'Reporta o consulta objetos encontrados.')}
      ${quickLink('#/emergencias', 'Emergencias', 'Primeros auxilios, puestos médicos y protocolos.')}
    </div>
  </section>`
}

function quickLink(href, title, desc) {
  return `
  <a href="${href}" class="block p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta hover:border-turquesa/40 transition-colors">
    <p class="font-display text-lg text-arena">${title}</p>
    <p class="mt-1.5 text-sm text-niebla">${desc}</p>
  </a>`
}
