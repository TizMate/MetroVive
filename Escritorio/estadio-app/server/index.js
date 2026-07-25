// Backend mínimo del chatbot del estadio.
//
// Por qué existe este servidor: la API key de Claude (o de cualquier LLM)
// NUNCA debe exponerse en el frontend — el navegador es público. Este
// servidor la guarda como variable de entorno y hace de intermediario
// entre el widget del chatbot y la API de Anthropic.
//
// Cómo correrlo:
//   1. cd server
//   2. cp .env.example .env   y pega tu ANTHROPIC_API_KEY
//   3. npm install
//   4. npm run dev            (o npm start)
//   5. En otra terminal, en la raíz del proyecto: npm run dev
//      (Vite ya está configurado para redirigir /api al puerto 8787)

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { toolDefinitions, executeTool } from './tools.js'

const PORT = process.env.PORT || 8787
const MODEL = 'claude-sonnet-5'
const MAX_TOOL_ITERATIONS = 3

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    '[server] ANTHROPIC_API_KEY no está configurada. Copia server/.env.example a server/.env y agrega tu key.'
  )
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const app = express()
app.use(cors())
app.use(express.json())

// Ejecuta el loop de tool-use: llama al modelo, resuelve las herramientas que
// pida (find_seat_navigation, locate_nearest_poi, create_in_seat_order,
// get_mobility_recommendation) con datos reales del recinto, y le devuelve
// los resultados hasta que responda en texto plano. Las "cards" recolectadas
// se envían aparte para que el frontend las renderice de forma visual.
async function runWithTools({ system, messages }) {
  const conversation = messages.map((m) => ({ role: m.role, content: m.content }))
  const cards = []

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system,
      tools: toolDefinitions,
      messages: conversation,
    })

    const toolUses = response.content.filter((block) => block.type === 'tool_use')

    if (toolUses.length === 0) {
      const reply = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
      return { reply, cards }
    }

    conversation.push({ role: 'assistant', content: response.content })

    const toolResults = toolUses.map((toolUse) => {
      const result = executeTool(toolUse.name, toolUse.input)
      if (result?.card_type) cards.push(result)
      return {
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: JSON.stringify(result),
      }
    })

    conversation.push({ role: 'user', content: toolResults })
  }

  return {
    reply: 'Con gusto te sigo ayudando, pero necesito que reformules tu pregunta con más detalle.',
    cards,
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { system, messages } = req.body

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Falta el arreglo "messages".' })
    }

    const { reply, cards } = await runWithTools({ system, messages })
    res.json({ reply, cards })
  } catch (err) {
    console.error('[server] Error llamando a Anthropic:', err.message)
    res.status(500).json({ error: 'No se pudo obtener respuesta del asistente.' })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`[server] Backend del chatbot escuchando en http://localhost:${PORT}`)
})
