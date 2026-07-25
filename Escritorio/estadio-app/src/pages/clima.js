export async function renderClima() {
  return `
  <section class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl sm:text-4xl text-arena">Clima en el estadio</h1>
    <p class="mt-2 text-niebla">Pronóstico para tu evento en Barranquilla.</p>

    <div class="mt-8 p-8 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta text-center">
      <p class="font-display text-6xl text-arena">31°C</p>
      <p class="mt-2 text-niebla">Parcialmente nublado</p>
      <div class="mt-6 grid grid-cols-2 gap-4 max-w-xs mx-auto text-sm">
        <div class="p-3 rounded-[var(--radius-card)] bg-white/5">
          <p class="text-niebla text-xs">Prob. de lluvia</p>
          <p class="text-arena font-bold mt-1">20%</p>
        </div>
        <div class="p-3 rounded-[var(--radius-card)] bg-white/5">
          <p class="text-niebla text-xs">Sensación</p>
          <p class="text-arena font-bold mt-1">34°C</p>
        </div>
      </div>
    </div>

    <div class="mt-6 p-5 rounded-[var(--radius-card)] bg-amarillo/10 border border-amarillo/30">
      <p class="font-bold text-amarillo text-sm">Recomendación según el clima</p>
      <p class="mt-1.5 text-sm text-arena">Hidrátate antes y durante el evento, usa protector solar si tu entrada es de día y considera ropa ligera. Hay puntos de hidratación gratuita en las graderías.</p>
    </div>

    <p class="mt-4 text-xs text-niebla/70 font-mono">Datos de ejemplo — en producción se integrará con un servicio meteorológico en tiempo real.</p>
  </section>`
}
