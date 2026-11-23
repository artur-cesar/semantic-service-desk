import type { Actor } from '../domain/actor.domain.js'
import type { ActorRepository } from '../repository/actor.repository.js'

export interface ActorService {
  findById(id: string): Promise<Actor | null>
  list(): Promise<Actor[]>
}

export function createActorService(repository: ActorRepository): ActorService {
  return {
    findById: (id) => repository.findById(id),
    list: () => repository.list(),
  }
}
