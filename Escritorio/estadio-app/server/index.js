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

const PORT = process.env.PORT || 8787

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    '[server] ANTHROPIC_API_KEY no está configurada. Copia server/.env.example a server/.env y agrega tu key.'
  )
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  try {
    const { system, messages } = req.body

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Falta el arreglo "messages".' })
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    res.json({ reply })
  } catch (err) {
    console.error('[server] Error llamando a Anthropic:', err.message)
    res.status(500).json({ error: 'No se pudo obtener respuesta del asistente.' })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`[server] Backend del chatbot escuchando en http://localhost:${PORT}`)
})
