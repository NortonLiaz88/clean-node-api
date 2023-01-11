/* eslint-disable @typescript-eslint/no-misused-promises */
import { adapRoute } from '../adapters/express/express-routes-adapter'
import { Router } from 'express'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adapRoute(makeSignUpController()))
  router.post('/login', adapRoute(makeLoginController()))
}
