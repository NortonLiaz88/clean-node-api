import { AddSurveyController } from '../../../../presentation/controller/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogController } from '../../decorator/log-controller-factory'
import { makeDbAddSurvey } from '../../usecases/add-survey/db-add-account'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeSurveyController = (): Controller => {
  return makeLogController(new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey()))
}
