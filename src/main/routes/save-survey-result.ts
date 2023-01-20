/* eslint-disable @typescript-eslint/no-misused-promises */
import { adapRoute } from '../adapters/express/express-routes-adapter'
import { Router } from 'express'
import { auth } from '../middlewares/auth'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adapRoute(makeSaveSurveyResultController()))
}
