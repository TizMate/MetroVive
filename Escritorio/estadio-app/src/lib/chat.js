// Servicio del chatbot inteligente del estadio.
//
// IMPORTANTE: la API key de un LLM (Claude, GPT, etc.) NUNCA debe vivir en
// el frontend — cualquiera podría leerla desde el navegador. Por eso este
// servicio llama a un backend propio (ver /server) que guarda la key como
// variable de entorno, ejecuta las herramientas (find_seat_navigation,
// locate_nearest_poi, create_in_seat_order, get_mobility_recommendation) y
// reenvía la solicitud al modelo.
//
// Mientras el backend no esté corriendo (p. ej. estás viendo solo el
// frontend), este servicio cae a una respuesta simulada — con las mismas
// "cards" estructuradas que devolvería el backend — para que la demo nunca
// se vea rota.

import { puertas, pois, transporte, parqueaderos, restaurantes, emergencias, eventos } from '../data/mock.js'

const CHAT_ENDPOINT = '/api/chat'

const SYSTEM_PROMPT = `Eres el asistente inteligente de Vive Metro, la app del
Estadio Metropolitano Roberto Meléndez en Barranquilla, Colombia. Ayudas a los
asistentes antes, durante y después de los eventos con tres capacidades:

1. Orientación Inteligente: puertas de ingreso, baños, tiendas/comida,
   primeros auxilios y salidas según la tribuna del usuario (Occidental,
   Oriental, Norte o Sur).
2. Servicio desde el Asiento: pedidos de comida y bebida sin levantarse.
3. Movilidad Inteligente: recomendación de la mejor puerta para entrar o
   salir según la congestión actual.

Usa las herramientas disponibles para resolver estas peticiones con datos
reales del recinto en vez de inventar cifras. Si no conoces la tribuna del
usuario, pregúntasela primero. Responde siempre en español, breve y cálido.
Para temas fuera de estas capacidades (transporte, parqueaderos, restaurantes,
emergencias), orienta con la mejor información general disponible.`

export async function sendMessage(history) {
  try {
    const res = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, messages: history }),
    })
    if (!res.ok) throw new Error(`Backend respondió ${res.status}`)
    const data = await res.json()
    return { reply: data.reply, cards: data.cards ?? [] }
  } catch (err) {
    console.warn('[chat] backend no disponible, usando respuesta simulada:', err.message)
    return simulatedReply(history)
  }
}

const STANDS = ['occidental', 'oriental', 'norte', 'sur']

function detectStand(text) {
  const found = STANDS.find((s) => text.includes(s))
  return found ? found.toUpperCase() : null
}

function simulatedReply(history) {
  const last = history[history.length - 1]?.content?.toLowerCase() ?? ''
  const stand = detectStand(last)

  if (last.includes('puerta') || last.includes('ingreso') || last.includes('asiento')) {
    if (!stand) {
      return {
        reply: '¿En qué tribuna está tu silla — Occidental, Oriental, Norte o Sur? Así te doy tu puerta exacta. (Respuesta simulada — conecta el backend para respuestas en tiempo real).',
        cards: [],
      }
    }
    const data = puertas[stand]
    return {
      reply: `Para la tribuna ${stand.charAt(0) + stand.slice(1).toLowerCase()}, usa ${data.puertas.join(', ')}. (Respuesta simulada).`,
      cards: [{ card_type: 'gate', stand, puertas: data.puertas, salidaEmergencia: data.salidaEmergencia }],
    }
  }

  if (last.includes('baño') || last.includes('bano')) {
    const stnd = stand ?? 'NORTE'
    const resultados = pois.filter((p) => p.categoria === 'BATHROOM' && p.stand === stnd)
    return {
      reply: `El baño más cercano en ${stnd.charAt(0) + stnd.slice(1).toLowerCase()} está a ${resultados[0]?.distancia ?? 'pocos metros'}. (Respuesta simulada).`,
      cards: [{ card_type: 'poi', poi_category: 'BATHROOM', stand: stnd, resultados }],
    }
  }

  if (last.includes('comer') || last.includes('comida') || last.includes('restaurante') || last.includes('hambre')) {
    return {
      reply: `Tenemos varias opciones: ${restaurantes.map((r) => r.nombre).join(', ')}. También puedo tomarte el pedido para que te lo lleven a tu silla. (Respuesta simulada).`,
      cards: [],
    }
  }

  if (last.includes('pedir') || last.includes('pedido') || last.includes('cerveza') || last.includes('gaseosa') || last.includes('nachos')) {
    return {
      reply: 'Puedo tomar tu pedido desde tu silla, pero conecta el backend (ver /server) para procesarlo con el modelo de lenguaje real. (Respuesta simulada).',
      cards: [],
    }
  }

  if (last.includes('sal') && (last.includes('congesti') || last.includes('mejor puerta') || last.includes('cómo salgo') || last.includes('como salgo'))) {
    const stnd = stand ?? 'NORTE'
    const data = puertas[stnd]
    return {
      reply: `Te recomiendo salir por ${data.salidaEmergencia} para evitar la congestión. (Respuesta simulada).`,
      cards: [{ card_type: 'mobility', action_type: 'EGRESS', stand: stnd, recomendada: data.salidaEmergencia, congestion: 'baja' }],
    }
  }

  if (last.includes('bus') || last.includes('transporte') || last.includes('llegar') || last.includes('transmetro')) {
    return {
      reply: transporte.map((t) => `${t.modo}: ${t.detalle}`).join(' · ') + ' (Respuesta simulada).',
      cards: [],
    }
  }

  if (last.includes('parqu')) {
    return {
      reply: parqueaderos.map((p) => `${p.nombre} (${p.capacidad}, ${p.distancia})`).join(' · ') + ' (Respuesta simulada).',
      cards: [],
    }
  }

  if (last.includes('evento') || last.includes('partido') || last.includes('horario') || last.includes('boleta') || last.includes('entrada')) {
    const proximo = eventos.find((e) => new Date(e.fecha) >= new Date()) ?? eventos[0]
    return {
      reply: `Próximo evento: ${proximo.nombre}, el ${proximo.fecha} a las ${proximo.hora}. Apertura de puertas: ${proximo.apertura}, ingreso ${proximo.ingreso}. ${proximo.recomendaciones} (Respuesta simulada).`,
      cards: [],
    }
  }

  if (last.includes('permitido') || last.includes('prohibido') || last.includes('puedo llevar') || last.includes('puedo ingresar')) {
    const proximo = eventos.find((e) => new Date(e.fecha) >= new Date()) ?? eventos[0]
    return {
      reply: `Permitido: ${proximo.permitido.join(', ')}. Prohibido: ${proximo.prohibido.join(', ')}. ${proximo.seguridad} (Respuesta simulada).`,
      cards: [],
    }
  }

  if (last.includes('perdí') || last.includes('perdi') || last.includes('objeto perdido')) {
    return {
      reply: 'Puedes reportar tu objeto perdido desde la sección "Objetos perdidos" de la app, o acercarte al puesto de información más cercano. (Respuesta simulada).',
      cards: [],
    }
  }

  if (last.includes('emergencia') || last.includes('evacuación') || last.includes('evacuacion')) {
    return {
      reply: `${emergencias.protocolo} Salidas: ${emergencias.salidas.join(', ')}. (Respuesta simulada).`,
      cards: [],
    }
  }

  return {
    reply: 'Con gusto te ayudo. Puedo orientarte con tu puerta de ingreso, ayudarte a pedir algo desde tu silla, o recomendarte la mejor puerta de salida. Esta es una respuesta simulada mientras el backend no está conectado — ver /server en el proyecto para activarlo.',
    cards: [],
  }
}
