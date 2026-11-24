import type { AppPrismaClient } from '../database/prisma.js'

export interface HealthRepository {
  checkDatabase(): Promise<void>
}

export class PrismaHealthRepository implements HealthRepository {
  constructor(private readonly prisma: AppPrismaClient) {}

  async checkDatabase(): Promise<void> {
    await this.prisma.$queryRaw`SELECT 1`
  }
}
