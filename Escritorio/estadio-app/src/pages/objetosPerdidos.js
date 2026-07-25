const encontrados = [
  { objeto: 'Gorra azul Junior FC', zona: 'Gradería Norte', fecha: '20 jul' },
  { objeto: 'Llavero con 3 llaves', zona: 'Concourse Sur', fecha: '20 jul' },
  { objeto: 'Billetera de cuero café', zona: 'Puerta 7', fecha: '13 jul' },
]

export async function renderObjetosPerdidos() {
  return `
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl sm:text-4xl text-arena">Objetos perdidos</h1>
    <p class="mt-2 text-niebla">Reporta lo que perdiste o consulta lo que ya se encontró.</p>

    <div class="mt-8 grid lg:grid-cols-2 gap-8">
      <div class="p-5 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta">
        <h2 class="font-display text-lg text-arena mb-4">Reportar objeto perdido</h2>
        <form id="form-objeto-perdido" class="space-y-3">
          <input type="text" required placeholder="¿Qué perdiste?"
                 class="w-full bg-white/5 border border-white/10 rounded-[var(--radius-card)] px-3.5 py-2.5 text-sm text-arena placeholder:text-niebla/60 focus:border-turquesa outline-none" />
          <input type="text" required placeholder="¿Dónde crees que lo perdiste?"
                 class="w-full bg-white/5 border border-white/10 rounded-[var(--radius-card)] px-3.5 py-2.5 text-sm text-arena placeholder:text-niebla/60 focus:border-turquesa outline-none" />
          <input type="email" required placeholder="Tu correo de contacto"
                 class="w-full bg-white/5 border border-white/10 rounded-[var(--radius-card)] px-3.5 py-2.5 text-sm text-arena placeholder:text-niebla/60 focus:border-turquesa outline-none" />
          <button type="submit" class="w-full py-2.5 rounded-[var(--radius-card)] bg-amarillo text-noche font-bold text-sm hover:brightness-95">
            Enviar reporte
          </button>
          <p id="form-objeto-msg" class="text-xs text-turquesa-alta hidden">¡Reporte enviado! Te contactaremos si aparece.</p>
        </form>
      </div>

      <div>
        <h2 class="font-display text-lg text-arena mb-4">Objetos encontrados recientemente</h2>
        <div class="space-y-3">
          ${encontrados
            .map(
              (o) => `
            <div class="p-4 rounded-[var(--radius-card)] border border-white/10 bg-noche-alta flex items-center justify-between gap-3">
              <div>
                <p class="text-sm text-arena font-semibold">${o.objeto}</p>
                <p class="text-xs text-niebla mt-0.5">${o.zona}</p>
              </div>
              <span class="text-[11px] font-mono text-niebla/70">${o.fecha}</span>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </div>
  </section>`
}

export function mountObjetosPerdidosBehavior() {
  const form = document.getElementById('form-objeto-perdido')
  const msg = document.getElementById('form-objeto-msg')
  if (!form) return
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    msg.classList.remove('hidden')
    form.reset()
  })
}
