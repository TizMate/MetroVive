// Servicio del chatbot inteligente del estadio.
//
// IMPORTANTE: la API key de un LLM (Claude, GPT, etc.) NUNCA debe vivir en
// el frontend — cualquiera podría leerla desde el navegador. Por eso este
// servicio llama a un backend propio (ver /server) que guarda la key como
// variable de entorno y reenvía la solicitud al modelo.
//
// Mientras el backend no esté corriendo (p. ej. estás viendo solo el
// frontend), este servicio cae a una respuesta simulada para que la demo
// nunca se vea rota.

const CHAT_ENDPOINT = '/api/chat'

const SYSTEM_PROMPT = `Eres el asistente inteligente del Estadio Metropolitano
Roberto Meléndez en Barranquilla, Colombia. Ayudas a los asistentes antes,
durante y después de los eventos: puertas de ingreso, cómo llegar, transporte
público, baños, graderías, restaurantes, parqueaderos, objetos permitidos y
prohibidos, objetos perdidos, emergencias y salidas de evacuación. Responde
siempre en español, de forma breve, cálida y concreta. Si no tienes un dato
exacto, orienta con la mejor alternativa disponible (personal de logística,
puestos de información) en vez de inventar cifras.`

export async function sendMessage(history) {
  try {
    const res = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, messages: history }),
    })
    if (!res.ok) throw new Error(`Backend respondió ${res.status}`)
    const data = await res.json()
    return data.reply
  } catch (err) {
    console.warn('[chat] backend no disponible, usando respuesta simulada:', err.message)
    return simulatedReply(history)
  }
}

function simulatedReply(history) {
  const last = history[history.length - 1]?.content?.toLowerCase() ?? ''

  if (last.includes('puerta') || last.includes('ingreso')) {
    return 'Tu puerta de ingreso aparece en tu boleta digital. Como referencia general: graderías Norte y Sur usan las puertas 1–4 y 7–10; Oriental y Occidental usan las puertas 5–6 y 11–12. (Respuesta simulada — conecta el backend para respuestas en tiempo real).'
  }
  if (last.includes('bus') || last.includes('transporte') || last.includes('llegar')) {
    return 'Puedes llegar en Transmetro (estación Metropolitano), buses urbanos con parada frente al estadio, o taxi/plataformas con punto de recogida en Puerta 2 y Puerta 8. (Respuesta simulada).'
  }
  if (last.includes('perdí') || last.includes('objeto perdido')) {
    return 'Puedes reportar tu objeto perdido desde la sección "Objetos perdidos" de la app, o acercarte al puesto de información más cercano. (Respuesta simulada).'
  }
  if (last.includes('emergencia') || last.includes('evacuación')) {
    return 'Ante una emergencia, dirígete con calma a la salida señalizada más cercana (Puertas 1, 4, 7 y 10) y sigue al personal de logística. Puestos médicos en las cuatro graderías. (Respuesta simulada).'
  }
  return 'Con gusto te ayudo con eso. Esta es una respuesta simulada mientras el backend con el modelo de lenguaje no está conectado — ver /server en el proyecto para activarlo.'
}
