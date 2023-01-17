import { makeLoadSurveysController } from './../factories/controllers/surveys/load-surveys/load-surveys-controller'
/* eslint-disable @typescript-eslint/no-misused-promises */
import { adapRoute } from '../adapters/express/express-routes-adapter'
import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/surveys/add-surveys/add-surveys-controller'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adapRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adapRoute(makeLoadSurveysController()))
}
