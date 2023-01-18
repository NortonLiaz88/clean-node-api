import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecase/save-survey-result'

export interface SaveSurveyRepository {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
