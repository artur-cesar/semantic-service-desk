import type { AppPrismaClient } from '../database/prisma.js'

export interface HealthRepository {
  checkDatabase(): Promise<void>
}

export function createHealthRepository(
  prisma: AppPrismaClient,
): HealthRepository {
  async function checkDatabase(): Promise<void> {
    await prisma.$queryRaw`SELECT 1`
  }

  return {
    checkDatabase,
  }
}
