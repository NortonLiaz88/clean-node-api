import { LogMongoRepository } from '@/infra/db/mongodb/log-error-repository/log'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'

export const makeLogController = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
