
import MockDate from 'mockdate'
import { SaveSurveyRepository } from '@/data/protocols/db/survey/save-survey-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecase/save-survey-result'
import { DbSaveSurveyResult } from './db-load-surveys'

const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    id: 'any_id',
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer_id',
    date: new Date()
  }
}

const makeFakeSaveSurveyResult = (): SaveSurveyResultModel => {
  return {
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer_id',
    date: new Date()
  }
}

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveysRepositoryStub: SaveSurveyRepository
}

const makeLoadSurveysRepository = (): SaveSurveyRepository => {
  class LoadSurveysRepositoryStub implements SaveSurveyRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise<SurveyResultModel>((resolve, reject) => resolve(makeFakeSurveyResult()))
    }
  }

  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveysRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbSaveSurveyResult(saveSurveysRepositoryStub)
  return {
    sut,
    saveSurveysRepositoryStub
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
