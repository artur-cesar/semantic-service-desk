import { loadEnvironment } from '../src/config/environment.js'
import { createPrismaClient } from '../src/database/prisma.js'
import { seedDemoScenario } from './seeds/demo-scenario.seed.js'
import { seedIdentityAndOrganization } from './seeds/identity-and-organization.seed.js'
import { seedServiceCatalog } from './seeds/service-catalog.seed.js'

const environment = loadEnvironment()
const prisma = createPrismaClient(environment.databaseUrl)

try {
  await seedIdentityAndOrganization(prisma)
  await seedServiceCatalog(prisma)
  await seedDemoScenario(prisma)

  console.log('Database seed completed successfully')
} finally {
  await prisma.$disconnect()
}
