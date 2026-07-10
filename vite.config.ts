import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage } from 'http'

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

function bookingApiDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'booking-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url !== '/api/send-booking') {
          next()
          return
        }

        for (const [key, value] of Object.entries(env)) {
          if (!key.startsWith('VITE_')) {
            process.env[key] = value
          }
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }))
          return
        }

        try {
          const { processBooking } = await import('./api/processBooking')
          const body = await readRequestBody(req)
          const parsed = body ? JSON.parse(body) : null
          const result = await processBooking(parsed)

          if (result.success) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true }))
            return
          }

          res.statusCode = result.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: result.error }))
        } catch (error) {
          console.error('Booking API dev error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          const message = error instanceof Error ? error.message : 'Server error'
          res.end(JSON.stringify({ success: false, error: message }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), bookingApiDevPlugin(env)],
  }
})
