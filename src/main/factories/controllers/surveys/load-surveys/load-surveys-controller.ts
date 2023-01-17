import { LoadSurveysController } from './../../../../../presentation/controller/survey/load-surveys/load-surveys-controller'

import { Controller } from '../../../../../presentation/protocols'
import { makeLogController } from '../../../decorator/log-controller-factory'
import { makeDbLoadSurveys } from '../../../usecases/add-survey/db-load-surveys'

export const makeLoadSurveysController = (): Controller => {
  return makeLogController(new LoadSurveysController(makeDbLoadSurveys()))
}
