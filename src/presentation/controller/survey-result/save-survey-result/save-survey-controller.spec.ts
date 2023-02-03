import MockDate from 'mockdate'
import { InvalidParamError } from '@/presentation/errors'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecase/load-surveys-by-id'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { HttpRequest } from '@/presentation/protocols'
import { SaveSurveyResultController } from './save-survey-controller'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecase/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer',
    date: new Date()
  },
  accountId: 'any_account_id'
})

const makeFakeSurveyResultResponse = (): SurveyResultModel => {
  return {
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      count: 1,
      percent: 50
    }, {
      answer: 'other_answer',
      image: 'any_image',
      count: 10,
      percent: 80
    }],
    date: new Date()
  }
}

const makeFakeSurveys = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }],
    date: new Date()
  }
}

interface SutTypes {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise<SurveyModel>((resolve, reject) => resolve(makeFakeSurveys()))
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel | null> {
      return await new Promise<SurveyResultModel>((resolve, reject) => resolve(makeFakeSurveyResultResponse()))
    }
  }

  return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurvey by id with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong answer'
      },
      accountId: 'any_account_id'
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSurveyResultSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSurveyResultSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      date: new Date(),
      answer: 'any_answer',
      accountId: 'any_account_id'
    })
  })

  test('should return 500 if SaveSurvey throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurveyResultResponse()))
  })
})
