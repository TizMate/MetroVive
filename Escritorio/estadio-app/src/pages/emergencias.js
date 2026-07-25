import { emergencias } from '../data/mock.js'

export async function renderEmergencias() {
  return `
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
    <div class="p-4 rounded-[var(--radius-card)] bg-coral/10 border border-coral/30 flex items-center gap-3">
      <span class="w-2.5 h-2.5 rounded-full bg-coral animate-pulse shrink-0"></span>
      <p class="text-sm text-arena">Si estás viviendo una emergencia ahora mismo, dirígete a la salida señalizada más cercana o contacta al personal de logística.</p>
    </div>

    <h1 class="mt-8 font-display text-3xl sm:text-4xl text-arena">Emergencias</h1>

    <div class="mt-8 grid sm:grid-cols-2 gap-5">
      <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta">
        <h2 class="font-display text-lg text-arena">Primeros auxilios</h2>
        <p class="mt-1.5 text-sm text-niebla">${emergencias.primerosAuxilios}</p>
      </div>
      <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta">
        <h2 class="font-display text-lg text-arena">Policía</h2>
        <p class="mt-1.5 text-sm text-niebla">${emergencias.policia}</p>
      </div>
      <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta">
        <h2 class="font-display text-lg text-arena">Bomberos</h2>
        <p class="mt-1.5 text-sm text-niebla">${emergencias.bomberos}</p>
      </div>
      <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta">
        <h2 class="font-display text-lg text-arena">Salidas de evacuación</h2>
        <ul class="mt-1.5 text-sm text-niebla space-y-1">
          ${emergencias.salidas.map((s) => `<li>• ${s}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="mt-6 p-5 rounded-[var(--radius-card)] bg-amarillo/10 border border-amarillo/30">
      <p class="font-bold text-amarillo text-sm">Protocolo básico</p>
      <p class="mt-1.5 text-sm text-arena">${emergencias.protocolo}</p>
    </div>
  </section>`
}
