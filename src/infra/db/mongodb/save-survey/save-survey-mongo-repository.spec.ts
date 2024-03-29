/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SaveSurveyMongoRepository } from './save-survey-mongo-repository'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models/survey'
import { AddAccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

describe('Survey Mongo Repository', () => {
  const url = process.env.MONGO_URL
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await MongoHelper.connect(url!)
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  const makeSut = (): SaveSurveyMongoRepository => {
    return new SaveSurveyMongoRepository()
  }

  const makeSurvey = async (): Promise<SurveyModel> => {
    const res = await surveyCollection.insertOne({
      question: 'any_question',
      answers: [
        { image: 'any_image', answer: 'any_answer' },
        { answer: 'other_answer' }
      ],
      date: new Date()
    })

    return res.ops[0]
  }

  const makeAccount = async (): Promise<AddAccountModel> => {
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    return res.ops[0]
  }

  describe('save()', () => {
    test('should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id!,
        accountId: account.id!,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBeTruthy()
    })

    test('Should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const res = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id!,
        accountId: account.id!,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(res.ops[0]._id)
      expect(surveyResult.answer).toBe(survey.answers[1].answer)
    })
  })
})
