import { restaurantes } from '../data/mock.js'

export async function renderRestaurantes() {
  return `
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl sm:text-4xl text-arena">Restaurantes internos</h1>
    <p class="mt-2 text-niebla">Opciones de comida dentro del estadio.</p>

    <div class="mt-8 grid sm:grid-cols-2 gap-5">
      ${restaurantes
        .map(
          (r) => `
        <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta">
          <h2 class="font-display text-lg text-arena">${r.nombre}</h2>
          <p class="mt-1 text-sm text-niebla">${r.tipo}</p>
          <p class="mt-2 text-xs font-mono text-turquesa-alta">${r.ubicacion}</p>
        </div>`
        )
        .join('')}
    </div>
  </section>`
}
