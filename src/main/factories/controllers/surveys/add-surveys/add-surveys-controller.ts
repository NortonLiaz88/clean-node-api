
import { AddSurveyController } from '@/presentation/controller/survey/add-survey/add-survey-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogController } from '@/main/factories/decorator/log-controller-factory'
import { makeDbAddSurvey } from '@/main/factories/usecases/add-survey/db-add-account'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  return makeLogController(new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey()))
}
