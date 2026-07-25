import { parqueaderos } from '../data/mock.js'

export async function renderParqueaderos() {
  return `
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl sm:text-4xl text-arena">Parqueaderos</h1>
    <p class="mt-2 text-niebla">Disponibilidad y ubicación de los parqueaderos del estadio.</p>

    <div class="mt-8 space-y-4">
      ${parqueaderos
        .map(
          (p) => `
        <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 class="font-display text-lg text-arena">${p.nombre}</h2>
            <p class="mt-1 text-sm text-niebla">${p.distancia}</p>
          </div>
          <span class="font-mono text-xs text-turquesa-alta border border-turquesa/30 rounded-full px-3 py-1.5">${p.capacidad}</span>
        </div>`
        )
        .join('')}
    </div>
  </section>`
}
