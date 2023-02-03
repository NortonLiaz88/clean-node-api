import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import {
  SaveSurveyResult,
  SaveSurveyResultModel
} from '@/domain/usecase/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId)
    return surveyResult
  }
}
