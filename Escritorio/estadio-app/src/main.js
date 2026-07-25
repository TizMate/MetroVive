import './style.css'
import { registerRoute, registerNotFound, startRouter } from './lib/router.js'
import { renderHeader, mountHeaderBehavior } from './components/header.js'
import { renderFooter } from './components/footer.js'
import { renderChatbotRoot, mountChatbotBehavior } from './components/chatbot.js'

import { renderHome } from './pages/home.js'
import { renderEventos, renderEventoDetalle } from './pages/eventos.js'
import { renderMapa } from './pages/mapa.js'
import { renderClima } from './pages/clima.js'
import { renderTransporte } from './pages/transporte.js'
import { renderParqueaderos } from './pages/parqueaderos.js'
import { renderRestaurantes } from './pages/restaurantes.js'
import { renderObjetosPerdidos, mountObjetosPerdidosBehavior } from './pages/objetosPerdidos.js'
import { renderEmergencias } from './pages/emergencias.js'

registerRoute('/', renderHome)
registerRoute('/eventos', renderEventos)
registerRoute('/eventos/:id', renderEventoDetalle)
registerRoute('/mapa', renderMapa)
registerRoute('/clima', renderClima)
registerRoute('/transporte', renderTransporte)
registerRoute('/parqueaderos', renderParqueaderos)
registerRoute('/restaurantes', renderRestaurantes)
registerRoute('/objetos-perdidos', renderObjetosPerdidos)
registerRoute('/emergencias', renderEmergencias)

registerNotFound(async () => `
  <section class="max-w-2xl mx-auto px-6 py-24 text-center">
    <p class="font-display text-3xl text-arena">Página no encontrada</p>
    <a href="#/" class="mt-4 inline-block text-turquesa-alta hover:underline">← Volver al inicio</a>
  </section>`)

const app = document.getElementById('app')

app.innerHTML = `
  <div id="app-header"></div>
  <main id="app-outlet" class="min-h-[60vh]"></main>
  <div id="app-footer"></div>
`

document.getElementById('app-footer').innerHTML = renderFooter()

const outlet = document.getElementById('app-outlet')

function renderChrome(activePath) {
  document.getElementById('app-header').innerHTML = renderHeader(activePath)
  mountHeaderBehavior()
}

document.addEventListener('route:rendered', (e) => {
  renderChrome(e.detail.path)
  // comportamientos específicos de cada página, si aplica
  mountObjetosPerdidosBehavior()
})

startRouter(outlet)

// El chatbot vive fuera del outlet: persiste entre rutas
const chatbotMount = document.createElement('div')
document.body.appendChild(chatbotMount)
chatbotMount.innerHTML = renderChatbotRoot()
mountChatbotBehavior()
