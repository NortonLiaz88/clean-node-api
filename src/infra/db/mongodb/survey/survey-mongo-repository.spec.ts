import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  const url = process.env.MONGO_URL
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await MongoHelper.connect(url!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  test('should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [
        { image: 'any_image', answer: 'any_answer' },
        { answer: 'other_answer' }

      ]
    })
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
