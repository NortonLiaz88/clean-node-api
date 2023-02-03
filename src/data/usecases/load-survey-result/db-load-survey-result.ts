import { mockSurveyResultModel } from './../../../domain/test/mock-survey-result'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecase/load-survey-result'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyRepository: LoadSurveyResultRepository) {}
  async load (surveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyRepository.loadSurveyId(surveyId)
    return mockSurveyResultModel()
  }
}
