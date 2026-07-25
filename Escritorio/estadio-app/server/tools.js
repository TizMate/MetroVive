// Herramientas (function calling) que el modelo puede invocar para resolver
// los 3 módulos de StadiumAI con datos reales del recinto, en vez de texto
// inventado. El LLM solo orquesta: la lógica de negocio vive aquí.

import { puertas, pois, productos, congestionPuertas } from '../src/data/mock.js'

export const toolDefinitions = [
  {
    name: 'find_seat_navigation',
    description:
      'Obtiene la(s) puerta(s) de acceso adecuadas para la tribuna del usuario. Úsalo cuando el usuario pregunte por su puerta de ingreso, cómo llegar a su asiento, o en qué tribuna entrar.',
    input_schema: {
      type: 'object',
      properties: {
        stand: {
          type: 'string',
          enum: ['OCCIDENTAL', 'ORIENTAL', 'NORTE', 'SUR'],
          description: 'Tribuna del usuario',
        },
      },
      required: ['stand'],
    },
  },
  {
    name: 'locate_nearest_poi',
    description:
      'Encuentra los puntos de interés (baños, tiendas/comida, primeros auxilios, salidas) más cercanos a la tribuna del usuario.',
    input_schema: {
      type: 'object',
      properties: {
        poi_category: {
          type: 'string',
          enum: ['BATHROOM', 'CONCESSION', 'FIRST_AID', 'EXIT'],
        },
        stand: {
          type: 'string',
          enum: ['OCCIDENTAL', 'ORIENTAL', 'NORTE', 'SUR'],
        },
      },
      required: ['poi_category', 'stand'],
    },
  },
  {
    name: 'create_in_seat_order',
    description:
      'Registra un pedido de comida o bebida desde la silla del usuario (Servicio desde el Asiento). Úsalo cuando el usuario quiera pedir algo de comer/beber.',
    input_schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              product_id: {
                type: 'string',
                description: 'id del catálogo: agua, gaseosa, cerveza, perro, nachos, arepa',
              },
              quantity: { type: 'integer' },
            },
            required: ['product_id', 'quantity'],
          },
        },
        stand: {
          type: 'string',
          enum: ['OCCIDENTAL', 'ORIENTAL', 'NORTE', 'SUR'],
        },
      },
      required: ['items', 'stand'],
    },
  },
  {
    name: 'get_mobility_recommendation',
    description:
      'Consulta la congestión de puertas y recomienda la mejor puerta para ingresar o salir del estadio (Movilidad Inteligente).',
    input_schema: {
      type: 'object',
      properties: {
        action_type: { type: 'string', enum: ['INGRESS', 'EGRESS'] },
        current_stand: {
          type: 'string',
          enum: ['OCCIDENTAL', 'ORIENTAL', 'NORTE', 'SUR'],
        },
      },
      required: ['action_type', 'current_stand'],
    },
  },
]

function nivel(congestion) {
  return { baja: 0, media: 1, alta: 2 }[congestion] ?? 1
}

function findSeatNavigation({ stand }) {
  const data = puertas[stand]
  if (!data) return { error: `Tribuna desconocida: ${stand}` }
  return {
    card_type: 'gate',
    stand,
    puertas: data.puertas,
    salidaEmergencia: data.salidaEmergencia,
  }
}

function locateNearestPoi({ poi_category, stand }) {
  const enTribuna = pois.filter((p) => p.categoria === poi_category && p.stand === stand)
  const resultados = enTribuna.length ? enTribuna : pois.filter((p) => p.categoria === poi_category).slice(0, 2)
  return {
    card_type: 'poi',
    poi_category,
    stand,
    resultados,
  }
}

function createInSeatOrder({ items, stand }) {
  const resolved = items.map(({ product_id, quantity }) => {
    const product = productos.find((p) => p.id === product_id)
    if (!product) return { product_id, quantity, error: `Producto no encontrado: ${product_id}` }
    return { ...product, quantity, subtotal: product.precio * quantity }
  })

  const invalid = resolved.filter((r) => r.error)
  if (invalid.length) {
    return { card_type: 'order', error: true, invalid, disponibles: productos.map((p) => p.id) }
  }

  const total = resolved.reduce((sum, r) => sum + r.subtotal, 0)
  const runners = ['Camila R.', 'Andrés M.', 'Luisa P.']
  const runner = runners[resolved.length % runners.length]

  return {
    card_type: 'order',
    stand,
    items: resolved,
    total,
    estado: 'PENDING',
    runner,
    etaMinutos: 12,
  }
}

function getMobilityRecommendation({ action_type, current_stand }) {
  const data = puertas[current_stand]
  if (!data) return { error: `Tribuna desconocida: ${current_stand}` }

  const candidatas =
    action_type === 'EGRESS' ? [data.salidaEmergencia, ...data.puertas] : data.puertas
  const [recomendada] = [...new Set(candidatas)].sort(
    (a, b) => nivel(congestionPuertas[a]) - nivel(congestionPuertas[b])
  )

  return {
    card_type: 'mobility',
    action_type,
    stand: current_stand,
    recomendada,
    congestion: congestionPuertas[recomendada] ?? 'desconocida',
  }
}

export function executeTool(name, input) {
  switch (name) {
    case 'find_seat_navigation':
      return findSeatNavigation(input)
    case 'locate_nearest_poi':
      return locateNearestPoi(input)
    case 'create_in_seat_order':
      return createInSeatOrder(input)
    case 'get_mobility_recommendation':
      return getMobilityRecommendation(input)
    default:
      return { error: `Herramienta desconocida: ${name}` }
  }
}
