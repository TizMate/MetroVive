import { sendMessage } from '../lib/chat.js'
import { navigate } from '../lib/router.js'

const STORAGE_KEY = 'estadio_chat_history'
const NUDGE_KEY = 'estadio_chat_nudge_shown'
let history = loadHistory()
let isOpen = false
let isSending = false
let nudgeTimer = null

function loadHistory() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

const STAND_LABELS = {
  NORTE: 'Norte',
  SUR: 'Sur',
  ORIENTAL: 'Oriental',
  OCCIDENTAL: 'Occidental',
}

const POI_LABELS = {
  BATHROOM: 'Baño',
  CONCESSION: 'Comida',
  FIRST_AID: 'Primeros auxilios',
  EXIT: 'Salida',
}

const suggestions = [
  '¿Dónde queda mi puerta de ingreso?',
  'Quiero pedir algo desde mi silla',
  '¿Por dónde salgo con menos congestión?',
  '¿Cómo llego en Transmetro?',
]

export function renderChatbotRoot() {
  return `
  <div id="chatbot-root" class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
    <div id="chatbot-nudge" class="hidden mb-2 max-w-[220px] px-3.5 py-2.5 rounded-2xl rounded-br-sm
                bg-noche-alta border border-white/10 text-arena text-xs shadow-lg shadow-black/30 relative">
      ¿Necesitas ayuda? Puedo ubicarte, tomar tu pedido o recomendarte por dónde salir 👋
    </div>

    <div id="chatbot-panel" class="hidden opacity-0 scale-95 mb-3 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[560px] flex flex-col
                rounded-[var(--radius-card)] border border-white/10 bg-noche-alta shadow-2xl shadow-black/40 overflow-hidden
                origin-bottom-right transition-all duration-200">
      <div class="flex items-center justify-between px-4 py-3 bg-noche border-b border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-turquesa/15 border border-turquesa/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-turquesa-alta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3C7 3 3 6.6 3 11c0 2.4 1.2 4.5 3.1 6-.1.9-.5 2.1-1.5 3.3 1.6 0 3.2-.6 4.4-1.5.9.3 1.9.4 3 .4 5 0 9-3.6 9-8s-4-8-9-8z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-turquesa opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-turquesa-alta"></span>
            </span>
          </div>
          <div>
            <p class="text-sm font-bold text-arena leading-none">Asistente del Estadio</p>
            <p class="text-[11px] text-niebla mt-1">Orientación · Pedidos · Movilidad</p>
          </div>
        </div>
        <button id="chatbot-close" aria-label="Cerrar asistente" class="p-1.5 rounded-full text-niebla hover:text-arena hover:bg-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div id="chatbot-messages" class="flex-1 overflow-y-auto px-3 py-3 space-y-2.5"></div>

      <div id="chatbot-suggestions" class="px-3 pb-2 flex flex-wrap gap-1.5"></div>

      <form id="chatbot-form" class="flex items-center gap-2 p-3 border-t border-white/10">
        <input id="chatbot-input" type="text" autocomplete="off" placeholder="Escribe tu pregunta…"
               class="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-arena placeholder:text-niebla/60 focus:border-turquesa outline-none" />
        <button type="submit" aria-label="Enviar"
                class="shrink-0 w-9 h-9 rounded-full bg-turquesa hover:bg-turquesa-alta transition-colors flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-noche" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 11l18-8-8 18-2-8-8-2z"/>
          </svg>
        </button>
      </form>
    </div>

    <button id="chatbot-toggle" aria-label="Abrir asistente del estadio" aria-expanded="false"
            class="flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-turquesa text-noche font-bold text-sm shadow-lg shadow-turquesa/20 hover:bg-turquesa-alta hover:scale-105 transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 3C7 3 3 6.6 3 11c0 2.4 1.2 4.5 3.1 6-.1.9-.5 2.1-1.5 3.3 1.6 0 3.2-.6 4.4-1.5.9.3 1.9.4 3 .4 5 0 9-3.6 9-8s-4-8-9-8z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Asistente
    </button>
  </div>`
}

function scrollToBottom(el) {
  el.scrollTop = el.scrollHeight
}

function bubble(role, text) {
  const isUser = role === 'user'
  return `
    <div class="flex ${isUser ? 'justify-end' : 'justify-start'}">
      <div class="max-w-[85%] px-3.5 py-2 text-sm leading-snug rounded-2xl
                  ${isUser
                    ? 'bg-turquesa text-noche rounded-br-sm'
                    : 'bg-white/5 text-arena border border-white/10 rounded-bl-sm'}">
        ${text}
      </div>
    </div>`
}

function typingBubble() {
  return `
    <div id="chatbot-typing" class="flex justify-start">
      <div class="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white/5 border border-white/10 flex gap-1 items-center">
        <span class="w-1.5 h-1.5 rounded-full bg-niebla animate-pulse"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-niebla animate-pulse [animation-delay:150ms]"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-niebla animate-pulse [animation-delay:300ms]"></span>
      </div>
    </div>`
}

function chip(text) {
  return `<span class="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/10 text-niebla">${escapeHtml(text)}</span>`
}

function cardShell(accentClass, icon, title, subtitle, body, cta) {
  return `
    <div class="flex justify-start">
      <div class="max-w-[90%] w-full rounded-2xl rounded-bl-sm border border-white/10 bg-noche overflow-hidden">
        <div class="flex items-center gap-2 px-3.5 py-2.5 border-b border-white/10 ${accentClass}">
          <span class="text-base leading-none">${icon}</span>
          <div class="min-w-0">
            <p class="text-xs font-bold text-arena truncate">${title}</p>
            ${subtitle ? `<p class="text-[11px] text-niebla/80 truncate">${subtitle}</p>` : ''}
          </div>
        </div>
        <div class="px-3.5 py-2.5 space-y-1.5">${body}</div>
        ${cta ? `<div class="px-3.5 pb-2.5">${cta}</div>` : ''}
      </div>
    </div>`
}

function ctaLink(label, path) {
  return `<button type="button" data-goto="${path}"
      class="text-xs font-semibold text-turquesa-alta hover:underline">${escapeHtml(label)} →</button>`
}

function renderCard(card) {
  if (!card || !card.card_type) return ''

  if (card.card_type === 'gate') {
    const label = STAND_LABELS[card.stand] ?? card.stand
    const body = `<div class="flex flex-wrap gap-1.5">${(card.puertas || []).map(chip).join('')}</div>
      <p class="text-[11px] text-niebla">Salida de emergencia: <span class="text-coral font-semibold">${escapeHtml(card.salidaEmergencia ?? '')}</span></p>`
    return cardShell('bg-turquesa/10', '🚪', `Puertas · Tribuna ${label}`, null, body, ctaLink('Ver mapa del estadio', '/mapa'))
  }

  if (card.card_type === 'poi') {
    const label = POI_LABELS[card.poi_category] ?? card.poi_category
    const body = (card.resultados || [])
      .slice(0, 3)
      .map((r) => `<div class="flex items-center justify-between text-xs">
          <span class="text-arena">${escapeHtml(r.nombre)}</span>
          <span class="font-mono text-turquesa-alta">${escapeHtml(r.distancia ?? '')}</span>
        </div>`)
      .join('')
    return cardShell('bg-turquesa/10', '📍', label, `Tribuna ${STAND_LABELS[card.stand] ?? card.stand}`, body || '<p class="text-xs text-niebla">Sin resultados cercanos.</p>')
  }

  if (card.card_type === 'order') {
    if (card.error) {
      return cardShell('bg-coral/10', '⚠️', 'No pude registrar el pedido', null,
        `<p class="text-xs text-niebla">Productos disponibles: ${escapeHtml((card.disponibles || []).join(', '))}</p>`)
    }
    const items = (card.items || [])
      .map((it) => `<div class="flex items-center justify-between text-xs">
          <span class="text-arena">${it.quantity}× ${escapeHtml(it.nombre)}</span>
          <span class="font-mono text-niebla">$${Number(it.subtotal).toLocaleString('es-CO')}</span>
        </div>`)
      .join('')
    const body = `${items}
      <div class="flex items-center justify-between pt-1.5 mt-1.5 border-t border-white/10">
        <span class="text-xs font-bold text-arena">Total</span>
        <span class="text-xs font-mono font-bold text-amarillo">$${Number(card.total).toLocaleString('es-CO')}</span>
      </div>
      <p class="text-[11px] text-niebla">Runner asignado: <span class="text-turquesa-alta font-semibold">${escapeHtml(card.runner ?? '')}</span> · ETA ~${card.etaMinutos ?? '—'} min</p>`
    return cardShell('bg-amarillo/10', '🛎️', 'Pedido registrado', `Estado: ${card.estado ?? 'PENDING'}`, body)
  }

  if (card.card_type === 'mobility') {
    const congestionColor = { alta: 'text-coral', media: 'text-amarillo', baja: 'text-turquesa-alta' }[card.congestion] ?? 'text-niebla'
    const accion = card.action_type === 'EGRESS' ? 'salida' : 'ingreso'
    const body = `<p class="text-xs text-arena">Puerta recomendada: <span class="font-bold text-turquesa-alta">${escapeHtml(card.recomendada ?? '')}</span></p>
      <p class="text-[11px] text-niebla">Congestión: <span class="font-semibold ${congestionColor}">${escapeHtml(card.congestion ?? 'desconocida')}</span></p>`
    return cardShell('bg-turquesa/10', '🚦', `Recomendación de ${accion}`, `Tribuna ${STAND_LABELS[card.stand] ?? card.stand}`, body, ctaLink('Ver mapa del estadio', '/mapa'))
  }

  return ''
}

function contextualChipsFor(cards) {
  const lastCard = cards?.[cards.length - 1]
  if (!lastCard) return []
  if (lastCard.card_type === 'gate') return ['¿Cómo llego en transporte?', '¿Dónde hay parqueaderos?']
  if (lastCard.card_type === 'order') return ['¿Por dónde salgo con menos congestión?']
  if (lastCard.card_type === 'poi') return ['¿Cuál es mi puerta de ingreso?']
  if (lastCard.card_type === 'mobility') return ['¿Dónde hay parqueaderos?']
  return []
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str ?? ''
  return div.innerHTML
}

function renderMessages() {
  const box = document.getElementById('chatbot-messages')
  if (!box) return
  if (history.length === 0) {
    box.innerHTML = `
      <div class="text-center py-6">
        <p class="text-sm text-arena font-semibold">¡Hola! 👋</p>
        <p class="text-xs text-niebla mt-1 px-4">Pregúntame por tu puerta de ingreso, pide algo desde tu silla, o consulta por dónde salir con menos congestión.</p>
      </div>`
  } else {
    box.innerHTML = history
      .map((m) => {
        const msgBubble = bubble(m.role, escapeHtml(m.content))
        const cardsHtml = (m.cards || []).map(renderCard).join('')
        return msgBubble + cardsHtml
      })
      .join('')
  }
  renderSuggestionChips()
  scrollToBottom(box)
}

function renderSuggestionChips() {
  const wrap = document.getElementById('chatbot-suggestions')
  if (!wrap) return

  if (history.length === 0) {
    wrap.innerHTML = suggestions
      .map(
        (s) => `<button type="button" data-suggestion="${escapeHtml(s)}"
          class="text-[11px] text-left text-turquesa-alta border border-turquesa/30 rounded-full px-2.5 py-1 hover:bg-turquesa/10">
          ${s}
        </button>`
      )
      .join('')
    return
  }

  const lastAssistant = [...history].reverse().find((m) => m.role === 'assistant')
  const contextual = contextualChipsFor(lastAssistant?.cards)
  wrap.innerHTML = contextual
    .map(
      (s) => `<button type="button" data-suggestion="${escapeHtml(s)}"
        class="text-[11px] text-left text-turquesa-alta border border-turquesa/30 rounded-full px-2.5 py-1 hover:bg-turquesa/10">
        ${s}
      </button>`
    )
    .join('')
}

async function handleSend(text) {
  if (!text.trim() || isSending) return
  isSending = true

  history.push({ role: 'user', content: text.trim() })
  saveHistory()
  renderMessages()

  const box = document.getElementById('chatbot-messages')
  box.insertAdjacentHTML('beforeend', typingBubble())
  scrollToBottom(box)

  const { reply, cards } = await sendMessage(
    history.map(({ role, content }) => ({ role, content }))
  )

  document.getElementById('chatbot-typing')?.remove()
  history.push({ role: 'assistant', content: reply, cards })
  saveHistory()
  renderMessages()

  isSending = false
}

function clearNudgeTimer() {
  if (nudgeTimer) {
    clearTimeout(nudgeTimer)
    nudgeTimer = null
  }
}

function scheduleNudge() {
  if (sessionStorage.getItem(NUDGE_KEY)) return
  nudgeTimer = setTimeout(() => {
    if (isOpen) return
    document.getElementById('chatbot-nudge')?.classList.remove('hidden')
    sessionStorage.setItem(NUDGE_KEY, 'true')
  }, 4000)
}

export function mountChatbotBehavior() {
  const root = document.getElementById('chatbot-root')
  if (!root || root.dataset.mounted) return
  root.dataset.mounted = 'true'

  const toggleBtn = document.getElementById('chatbot-toggle')
  const closeBtn = document.getElementById('chatbot-close')
  const panel = document.getElementById('chatbot-panel')
  const nudge = document.getElementById('chatbot-nudge')
  const form = document.getElementById('chatbot-form')
  const input = document.getElementById('chatbot-input')

  function setOpen(open) {
    isOpen = open
    panel.classList.toggle('hidden', !open)
    panel.classList.toggle('scale-95', !open)
    panel.classList.toggle('opacity-0', !open)
    toggleBtn.setAttribute('aria-expanded', String(open))
    if (open) {
      nudge.classList.add('hidden')
      clearNudgeTimer()
      renderMessages()
      setTimeout(() => input.focus(), 50)
    }
  }

  toggleBtn.addEventListener('click', () => setOpen(!isOpen))
  closeBtn.addEventListener('click', () => setOpen(false))
  nudge.addEventListener('click', () => setOpen(true))

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const text = input.value
    input.value = ''
    handleSend(text)
  })

  document.getElementById('chatbot-suggestions').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-suggestion]')
    if (!btn) return
    handleSend(btn.dataset.suggestion)
  })

  document.getElementById('chatbot-messages').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-goto]')
    if (!btn) return
    setOpen(false)
    navigate(btn.dataset.goto)
  })

  scheduleNudge()
}
