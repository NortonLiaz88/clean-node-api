import { makeDbAuthentication } from './../../usecases/authentication/db-authentication-factory'
import { LoginController } from '@/presentation/controller/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { makeLogController } from '../../decorator/log-controller-factory'

export const makeLoginController = (): Controller => {
  return makeLogController(new LoginController(makeDbAuthentication(), makeLoginValidation()))
}
