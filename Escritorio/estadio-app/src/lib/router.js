// Router SPA minimalista basado en #hash. Suficiente para un prototipo de
// hackathon: sin dependencias externas, fácil de leer y de extender.

const routes = new Map()
let notFoundHandler = () => '<p class="p-8 text-arena">Página no encontrada.</p>'

export function registerRoute(path, renderFn) {
  routes.set(path, renderFn)
}

export function registerNotFound(renderFn) {
  notFoundHandler = renderFn
}

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '')
  return hash || '/'
}

export function navigate(path) {
  window.location.hash = path
}

export function startRouter(outlet) {
  async function render() {
    const path = currentPath()
    // soporta rutas con parámetro simple: /eventos/:id
    let handler = routes.get(path)
    let params = {}

    if (!handler) {
      for (const [pattern, fn] of routes.entries()) {
        if (!pattern.includes(':')) continue
        const patternParts = pattern.split('/')
        const pathParts = path.split('/')
        if (patternParts.length !== pathParts.length) continue
        const match = patternParts.every((part, i) => {
          if (part.startsWith(':')) {
            params[part.slice(1)] = decodeURIComponent(pathParts[i])
            return true
          }
          return part === pathParts[i]
        })
        if (match) {
          handler = fn
          break
        }
      }
    }

    outlet.innerHTML = handler
      ? await handler(params)
      : await notFoundHandler()

    outlet.scrollTop = 0
    window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' })
    document.dispatchEvent(new CustomEvent('route:rendered', { detail: { path, params } }))
  }

  window.addEventListener('hashchange', render)
  window.addEventListener('DOMContentLoaded', render)
  render()
}

export function isActive(path) {
  return currentPath() === path
}
