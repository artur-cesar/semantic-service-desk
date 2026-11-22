export interface Environment {
  databaseUrl: string
}

export function loadEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): Environment {
  const databaseUrl = source.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const parsedDatabaseUrl = new URL(databaseUrl)

  if (!['postgres:', 'postgresql:'].includes(parsedDatabaseUrl.protocol)) {
    throw new Error('DATABASE_URL must use the postgres protocol')
  }

  return {
    databaseUrl,
  }
}
