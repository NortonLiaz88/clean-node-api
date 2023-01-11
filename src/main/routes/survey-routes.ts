/* eslint-disable @typescript-eslint/no-misused-promises */
import { adapRoute } from '../adapters/express/express-routes-adapter'
import { Router } from 'express'
import { makeSurveyController } from '../factories/controllers/surveys/add-surveys-controller'

export default (router: Router): void => {
  router.post('/surveys', adapRoute(makeSurveyController()))
}
