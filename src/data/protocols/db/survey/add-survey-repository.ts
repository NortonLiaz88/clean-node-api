import { AddSurveyModel } from '../../../../domain/usecase/add-survey'

export interface AddSurveyRepository {
  add: (accountData: AddSurveyModel) => Promise<void>
}
