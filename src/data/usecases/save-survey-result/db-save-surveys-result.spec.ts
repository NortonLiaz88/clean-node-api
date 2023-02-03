
import MockDate from 'mockdate'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecase/save-survey-result'
import { DbSaveSurveyResult } from './db-load-surveys'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'

const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        count: 1,
        percent: 50
      },
      {
        answer: 'other_answer',
        count: 10,
        percent: 80
      }
    ],
    date: new Date()
  }
}

const makeFakeSaveSurveyResult = (): SaveSurveyResultModel => {
  return {
    surveyId: 'any_survey_id',
    answer: 'any_answer_id',
    accountId: 'any_account_id',
    date: new Date()
  }
}

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveysRepositoryStub: SaveSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyResultRepository
}

const makeSaveSurveysRepository = (): SaveSurveyResultRepository => {
  class LoadSurveysRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise<SurveyResultModel>((resolve, reject) => resolve(makeFakeSurveyResult()))
    }
  }

  return new LoadSurveysRepositoryStub()
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

const makeSut = (): SutTypes => {
  const saveSurveysRepositoryStub = makeSaveSurveysRepository()
  const loadSurveyByIdRepositoryStub = makeLoadSurveyRespositoryStub()

  const sut = new DbSaveSurveyResult(saveSurveysRepositoryStub, loadSurveyByIdRepositoryStub)
  return {
    sut,
    saveSurveysRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveysRepository', async () => {
    const { sut, saveSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(saveSurveysRepositoryStub, 'save')
    await sut.save(makeFakeSaveSurveyResult())
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.save(makeFakeSaveSurveyResult())
    expect(surveys).toEqual(makeFakeSurveyResult())
  })

  test('should throw if LoadAaccountByTokenRepositoy throws', async () => {
    const { sut, saveSurveysRepositoryStub } = makeSut()
    jest.spyOn(saveSurveysRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.save(makeFakeSaveSurveyResult())
    await expect(promise).rejects.toThrow()
  })
})
