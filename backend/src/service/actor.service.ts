import type { Actor } from '../domain/actor.domain.js'
import type { ActorRepository } from '../repository/actor.repository.js'

export class ActorService {
  constructor(private readonly repository: ActorRepository) {}

  findById(id: string): Promise<Actor | null> {
    return this.repository.findById(id)
  }

  list(): Promise<Actor[]> {
    return this.repository.list()
  }
}
