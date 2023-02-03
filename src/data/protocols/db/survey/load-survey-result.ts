import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResultRepository {
  loadSurveyId: (surveyId: string) => Promise<SurveyResultModel>
}
