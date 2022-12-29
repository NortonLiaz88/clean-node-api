import { SignUpController } from '../../presentation/controller/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../decorators/log'
import { Controller } from '../../presentation/protocols'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bcrypAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcrypAdapter, accountMongoRepository)

  const signUpController = new SignUpController(emailValidator, dbAddAccount)
  return new LogControllerDecorator(signUpController)
}
