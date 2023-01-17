
import { SignUpController } from '@/presentation/controller/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeSingUpValidation } from './signup-validation-factory'
import { makeLogController } from '../../decorator/log-controller-factory'

export const makeSignUpController = (): Controller => {
  return makeLogController(new SignUpController(makeDbAddAccount(), makeDbAuthentication(), makeSingUpValidation()))
}
