export function renderFooter() {
  return `
  <footer class="mt-16 border-t border-white/10 bg-noche-alta/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
      <div>
        <p class="font-display text-lg text-arena">VIVE METRO</p>
        <p class="mt-2 text-sm text-niebla max-w-xs">
          Estadio Metropolitano Roberto Meléndez — Barranquilla, Colombia.
          Prototipo de hackathon: asistencia inteligente para tu evento.
        </p>
      </div>
      <div>
        <p class="text-xs font-mono text-niebla/70 uppercase tracking-wider mb-3">Para ti</p>
        <ul class="space-y-2 text-sm text-niebla">
          <li><a href="#/eventos" class="hover:text-turquesa-alta">Próximos eventos</a></li>
          <li><a href="#/mapa" class="hover:text-turquesa-alta">Mapa del estadio</a></li>
          <li><a href="#/objetos-perdidos" class="hover:text-turquesa-alta">Objetos perdidos</a></li>
        </ul>
      </div>
      <div>
        <p class="text-xs font-mono text-niebla/70 uppercase tracking-wider mb-3">Emergencias</p>
        <ul class="space-y-2 text-sm text-niebla">
          <li><a href="#/emergencias" class="hover:text-coral">Primeros auxilios y salidas</a></li>
          <li><span>Línea de emergencias: 123</span></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10 px-4 sm:px-6 py-4 text-xs text-niebla/60 font-mono">
      Prototipo construido para hackathon · No es un canal oficial del estadio
    </div>
  </footer>`
}
