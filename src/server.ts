import { buildApp } from './app.js'

const host = process.env.HOST ?? '0.0.0.0'
const port = Number(process.env.PORT ?? 3000)

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

const app = await buildApp({ logger: true })

const shutdown = async (signal: NodeJS.Signals) => {
  app.log.info({ signal }, 'Shutting down')
  await app.close()
}

process.once('SIGINT', () => void shutdown('SIGINT'))
process.once('SIGTERM', () => void shutdown('SIGTERM'))

await app.listen({ host, port })
