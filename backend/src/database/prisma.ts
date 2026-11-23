import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../generated/prisma/client.js'

export type AppPrismaClient = ReturnType<typeof createPrismaClient>

export function createPrismaClient(databaseUrl: string) {
  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  })

  return new PrismaClient({ adapter })
}
