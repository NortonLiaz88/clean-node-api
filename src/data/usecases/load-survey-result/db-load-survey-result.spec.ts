import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRespositoryStub()
  const sut = new DbLoadSurveyResult(loadSurveyRepositoryStub)
  return { sut, loadSurveyRepositoryStub }
}

const mockedSurveyResult = mockSurveyResultModel()

const makeLoadSurveyRespositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return await new Promise<SurveyResultModel>((resolve, reject) => resolve(mockedSurveyResult))
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

describe('DbLoadSurveyResult UseCase', () => {
  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'loadBySurveyId').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockedSurveyResult)
  })
})
