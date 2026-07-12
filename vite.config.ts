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

function apiDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const [pathname, query = ''] = req.url?.split('?') ?? []

        for (const [key, value] of Object.entries(env)) {
          if (!key.startsWith('VITE_')) {
            process.env[key] = value
          }
        }

        if (pathname === '/api/send-booking') {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: 'Method not allowed' }))
            return
          }

          try {
            const { processBooking } = await import('./api/processBooking.js')
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
          return
        }

        if (pathname === '/api/availability') {
          if (req.method !== 'GET') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: 'Method not allowed' }))
            return
          }

          try {
            const params = new URLSearchParams(query)
            const { getAvailableSlots, isCalendarConfigured, SHOP_TIME_SLOTS } = await import('./api/calendarService.js')
            const date = params.get('date') ?? ''
            const duration = Number(params.get('duration') ?? 60)

            if (!date) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: 'Missing date' }))
              return
            }

            if (!Number.isFinite(duration) || duration <= 0) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: 'Invalid duration' }))
              return
            }

            if (!isCalendarConfigured()) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, slots: SHOP_TIME_SLOTS, calendarEnabled: false }))
              return
            }

            const slots = await getAvailableSlots(date, duration)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, slots, calendarEnabled: true }))
          } catch (error) {
            console.error('Availability API dev error:', error)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            const message = error instanceof Error ? error.message : 'Server error'
            res.end(JSON.stringify({ success: false, error: message }))
          }
          return
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), apiDevPlugin(env)],
  }
})
