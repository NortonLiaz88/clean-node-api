import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-surveys-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }],
    date: new Date()
  }
}

const makeLoadSurveysRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise<SurveyModel>((resolve, reject) =>
        resolve(makeFakeSurvey())
      )
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRespositoryStub()
  const loadSurveyByIdRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveyResult(loadSurveyRepositoryStub, loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyRepositoryStub, loadSurveyByIdRepositoryStub }
}

const mockedSurveyResult = mockSurveyResultModel()

const makeLoadSurveyRespositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return await new Promise<SurveyResultModel>((resolve, reject) =>
        resolve(mockedSurveyResult)
      )
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

describe('DbLoadSurveyResult UseCase', () => {
  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(
      loadSurveyRepositoryStub,
      'loadBySurveyId'
    )
    await sut.load('any_survey_id')
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSuveyByIdRepository if loadSurveyRepository returns null', async () => {
    const { sut, loadSurveyRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest
      .spyOn(loadSurveyRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null))
    await sut.load('any_survey_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockedSurveyResult)
  })
})
