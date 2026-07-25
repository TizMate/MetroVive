const navItems = [
  { path: '/', label: 'Inicio', puerta: '01' },
  { path: '/eventos', label: 'Eventos', puerta: '02' },
  { path: '/mapa', label: 'Mapa', puerta: '03' },
  { path: '/clima', label: 'Clima', puerta: '04' },
  { path: '/transporte', label: 'Transporte', puerta: '05' },
  { path: '/parqueaderos', label: 'Parqueaderos', puerta: '06' },
  { path: '/restaurantes', label: 'Restaurantes', puerta: '07' },
  { path: '/objetos-perdidos', label: 'Objetos perdidos', puerta: '08' },
  { path: '/emergencias', label: 'Emergencias', puerta: '09' },
]

const tickerMsgs = [
  'Próximo evento: Junior FC vs. Atlético Nacional — 14 ago, 8:00 p. m.',
  'Puertas abren 2h 30min antes del evento',
  'Clima hoy: 31°C, probabilidad de lluvia 20%',
  'Transmetro con servicio extendido en días de evento',
]

export function renderHeader(activePath) {
  const items = navItems
    .map(
      (item) => `
      <a href="#${item.path}"
         class="group flex items-center gap-2 px-3 py-2 rounded-[var(--radius-card)] whitespace-nowrap transition-colors
                ${
                  activePath === item.path
                    ? 'bg-turquesa/15 text-turquesa-alta'
                    : 'text-niebla hover:text-arena hover:bg-white/5'
                }">
        <span class="font-mono text-[10px] tabular-nums ${activePath === item.path ? 'text-turquesa-alta' : 'text-niebla/60 group-hover:text-niebla'}">${item.puerta}</span>
        <span class="text-sm font-semibold">${item.label}</span>
      </a>`
    )
    .join('')

  return `
  <header class="sticky top-0 z-40 bg-noche/95 backdrop-blur border-b border-white/10">
    <!-- Ticker tipo marcador de estadio -->
    <div class="overflow-hidden bg-noche-alta border-b border-white/5 text-[11px] font-mono text-turquesa-alta/90">
      <div class="flex whitespace-nowrap animate-ticker py-1.5">
        ${[...tickerMsgs, ...tickerMsgs]
          .map((m) => `<span class="mx-6 flex items-center gap-2">● ${m}</span>`)
          .join('')}
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16 gap-4">
        <a href="#/" class="flex items-center gap-2 shrink-0">
          <span class="font-display text-xl sm:text-2xl text-arena leading-none">METROPOLITANO</span>
          <span class="hidden sm:inline text-[10px] font-mono text-niebla border border-white/15 rounded px-1.5 py-0.5">BAQ</span>
        </a>

        <nav aria-label="Navegación principal" class="hidden lg:flex items-center gap-1 overflow-x-auto">
          ${items}
        </nav>

        <div class="flex items-center gap-2 shrink-0">
          <a href="#/notificaciones" aria-label="Notificaciones"
             class="p-2 rounded-full text-niebla hover:text-arena hover:bg-white/5 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="#/cuenta"
             class="text-sm font-semibold px-3.5 py-2 rounded-[var(--radius-card)] bg-amarillo text-noche hover:brightness-95 transition">
            Iniciar sesión
          </a>
          <button id="menu-toggle" aria-label="Abrir menú" aria-expanded="false"
             class="lg:hidden p-2 rounded-full text-niebla hover:text-arena hover:bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menú móvil -->
    <nav id="mobile-menu" aria-label="Navegación móvil" class="hidden lg:hidden border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-1">
      ${items}
    </nav>
  </header>`
}

export function mountHeaderBehavior() {
  const toggle = document.getElementById('menu-toggle')
  const menu = document.getElementById('mobile-menu')
  if (!toggle || !menu) return
  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden')
    menu.classList.toggle('hidden')
    toggle.setAttribute('aria-expanded', String(!isOpen))
  })
}
