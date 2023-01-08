import { adapRoute } from './../adapters/express-routes-adapter'
import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/signup', adapRoute(makeSignUpController()))
}
