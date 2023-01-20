import { makeDbLoadSurveyById } from '@/main/factories/usecases/load-survey-by-id/db-load-account-by-token-factory'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-result/save-survey-result/db-load-account-by-token-factory'
import { SaveSurveyResultController } from '@/presentation/controller/survey-result/save-survey-result/save-survey-controller'

import { Controller } from '@/presentation/protocols'
import { makeLogController } from '../../../decorator/log-controller-factory'

export const makeSaveSurveyResultController = (): Controller => {
  return makeLogController(new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult()))
}
