const puntos = [
  { tipo: 'Entrada', label: 'Puerta 1–4', color: 'bg-turquesa-alta', x: 20, y: 15 },
  { tipo: 'Entrada', label: 'Puerta 7–10', color: 'bg-turquesa-alta', x: 78, y: 78 },
  { tipo: 'Baños', label: 'Baños Norte', color: 'bg-amarillo', x: 30, y: 30 },
  { tipo: 'Baños', label: 'Baños Sur', color: 'bg-amarillo', x: 68, y: 68 },
  { tipo: 'Restaurante', label: 'Concourse Oriental', color: 'bg-arena', x: 85, y: 45 },
  { tipo: 'Puesto médico', label: 'Puesto médico Norte', color: 'bg-coral', x: 40, y: 20 },
  { tipo: 'Salida de emergencia', label: 'Salida Puerta 4', color: 'bg-coral', x: 15, y: 60 },
]

export async function renderMapa() {
  const legend = [...new Map(puntos.map((p) => [p.tipo, p.color])).entries()]

  return `
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl sm:text-4xl text-arena">Mapa del estadio</h1>
    <p class="mt-2 text-niebla max-w-xl">Ubica entradas, baños, graderías, restaurantes, puestos médicos y salidas de emergencia.</p>

    <div class="mt-6 flex flex-wrap gap-3">
      ${legend
        .map(
          ([tipo, color]) => `
        <span class="flex items-center gap-1.5 text-xs text-niebla">
          <span class="w-2.5 h-2.5 rounded-full ${color}"></span>${tipo}
        </span>`
        )
        .join('')}
    </div>

    <div class="mt-6 relative aspect-square sm:aspect-[4/3] rounded-[var(--radius-card)] border border-white/10 bg-noche-alta overflow-hidden">
      <!-- Silueta simplificada de cancha -->
      <div class="absolute inset-[12%] rounded-[40%] border border-white/10"></div>
      <div class="absolute inset-[30%] rounded-[40%] border border-white/10"></div>

      ${puntos
        .map(
          (p) => `
        <button data-punto="${p.label}"
          class="absolute -translate-x-1/2 -translate-y-1/2 group"
          style="left:${p.x}%; top:${p.y}%;">
          <span class="block w-3.5 h-3.5 rounded-full ${p.color} ring-4 ring-noche group-hover:scale-125 transition-transform"></span>
          <span class="absolute left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-[10px] font-mono px-1.5 py-0.5 rounded bg-noche border border-white/10 text-arena opacity-0 group-hover:opacity-100 transition-opacity">
            ${p.label}
          </span>
        </button>`
        )
        .join('')}
    </div>

    <p class="mt-4 text-xs text-niebla/70 font-mono">
      Mapa referencial del prototipo. La versión final integrará coordenadas reales y ruta paso a paso desde tu ubicación.
    </p>
  </section>`
}
