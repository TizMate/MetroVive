import { transporte } from '../data/mock.js'

export async function renderTransporte() {
  return `
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl sm:text-4xl text-arena">Cómo llegar</h1>
    <p class="mt-2 text-niebla">Opciones de transporte hacia el Estadio Metropolitano.</p>

    <div class="mt-8 grid sm:grid-cols-2 gap-5">
      ${transporte
        .map(
          (t) => `
        <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta">
          <h2 class="font-display text-lg text-arena">${t.modo}</h2>
          <p class="mt-1.5 text-sm text-niebla">${t.detalle}</p>
        </div>`
        )
        .join('')}
    </div>
  </section>`
}
