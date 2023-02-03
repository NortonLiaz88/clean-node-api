import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'

describe('DbLoadSurveyResult UseCase', () => {
  test('Should call LoadSurveyResultRepository', async () => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadSurveyId (surveyId: string): Promise<SurveyResultModel> {
        return await new Promise<SurveyResultModel>((resolve, reject) => resolve(mockSurveyResultModel()))
      }
    }
    const loadSurveyRepositoryStub = new LoadSurveyResultRepositoryStub()
    const sut = new DbLoadSurveyResult(loadSurveyRepositoryStub)

    const loadSurveyByIdSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadSurveyId')
    await sut.load('any_survey_id')

    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
