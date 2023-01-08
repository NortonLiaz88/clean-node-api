/* eslint-disable @typescript-eslint/no-misused-promises */
import { adapRoute } from '../adapters/express/express-routes-adapter'
import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', adapRoute(makeSignUpController()))
  router.post('/login', adapRoute(makeLoginController()))
}
