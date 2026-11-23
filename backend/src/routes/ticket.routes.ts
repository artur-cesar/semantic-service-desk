import type { FastifyPluginCallback } from 'fastify'

import type { TicketController } from '../controller/ticket.controller.js'

import {
  createTicketRouteSchema,
  ticketDetailsRouteSchema,
  ticketsRouteSchema,
} from '../responses/ticket.response.js'

interface TicketRoutesOptions {
  controller: TicketController
}

export const ticketRoutes: FastifyPluginCallback<TicketRoutesOptions> = (
  app,
  { controller },
  done,
) => {
  app.post('/tickets', { schema: createTicketRouteSchema }, controller.create)
  app.get('/tickets', { schema: ticketsRouteSchema }, controller.list)
  app.get(
    '/tickets/:id',
    { schema: ticketDetailsRouteSchema },
    controller.findById,
  )

  done()
}
