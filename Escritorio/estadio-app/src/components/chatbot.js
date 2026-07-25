import { sendMessage } from '../lib/chat.js'

const STORAGE_KEY = 'estadio_chat_history'
let history = loadHistory()
let isOpen = false
let isSending = false

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

const suggestions = [
  '¿Dónde queda mi puerta de ingreso?',
  '¿Cómo llego en Transmetro?',
  '¿Qué objetos puedo ingresar?',
  '¿Dónde están las salidas de emergencia?',
]

export function renderChatbotRoot() {
  return `
  <div id="chatbot-root" class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
    <div id="chatbot-panel" class="hidden mb-3 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[560px] flex flex-col
                rounded-[var(--radius-card)] border border-white/10 bg-noche-alta shadow-2xl shadow-black/40 overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 bg-noche border-b border-white/10">
        <div class="flex items-center gap-2.5">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-turquesa opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-turquesa-alta"></span>
          </span>
          <div>
            <p class="text-sm font-bold text-arena leading-none">Asistente del Estadio</p>
            <p class="text-[11px] text-niebla mt-0.5">Responde en tiempo real</p>
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
            class="flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-turquesa text-noche font-bold text-sm shadow-lg shadow-turquesa/20 hover:bg-turquesa-alta transition-colors">
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

function renderMessages() {
  const box = document.getElementById('chatbot-messages')
  if (!box) return
  if (history.length === 0) {
    box.innerHTML = `
      <div class="text-center py-6">
        <p class="text-sm text-arena font-semibold">¡Hola! 👋</p>
        <p class="text-xs text-niebla mt-1 px-4">Pregúntame sobre puertas, transporte, clima, objetos perdidos o emergencias.</p>
      </div>`
  } else {
    box.innerHTML = history.map((m) => bubble(m.role, escapeHtml(m.content))).join('')
  }
  renderSuggestionChips()
  scrollToBottom(box)
}

function renderSuggestionChips() {
  const wrap = document.getElementById('chatbot-suggestions')
  if (!wrap) return
  if (history.length > 0) {
    wrap.innerHTML = ''
    return
  }
  wrap.innerHTML = suggestions
    .map(
      (s) => `<button type="button" data-suggestion="${escapeHtml(s)}"
        class="text-[11px] text-left text-turquesa-alta border border-turquesa/30 rounded-full px-2.5 py-1 hover:bg-turquesa/10">
        ${s}
      </button>`
    )
    .join('')
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
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

  const reply = await sendMessage(history)

  document.getElementById('chatbot-typing')?.remove()
  history.push({ role: 'assistant', content: reply })
  saveHistory()
  renderMessages()

  isSending = false
}

export function mountChatbotBehavior() {
  const root = document.getElementById('chatbot-root')
  if (!root || root.dataset.mounted) return
  root.dataset.mounted = 'true'

  const toggleBtn = document.getElementById('chatbot-toggle')
  const closeBtn = document.getElementById('chatbot-close')
  const panel = document.getElementById('chatbot-panel')
  const form = document.getElementById('chatbot-form')
  const input = document.getElementById('chatbot-input')

  function setOpen(open) {
    isOpen = open
    panel.classList.toggle('hidden', !open)
    toggleBtn.setAttribute('aria-expanded', String(open))
    if (open) {
      renderMessages()
      setTimeout(() => input.focus(), 50)
    }
  }

  toggleBtn.addEventListener('click', () => setOpen(!isOpen))
  closeBtn.addEventListener('click', () => setOpen(false))

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
}
