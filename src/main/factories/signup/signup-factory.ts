import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-error-repository/log'
import { SignUpController } from '../../../presentation/controller/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSingUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcrypAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcrypAdapter, accountMongoRepository)

  const validationComposite = makeSingUpValidation()
  const signUpController = new SignUpController(dbAddAccount, validationComposite)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
