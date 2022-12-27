import { SignUpController } from '../../presentation/controller/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bcrypAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcrypAdapter, accountMongoRepository)

  return new SignUpController(emailValidator, dbAddAccount)
}
