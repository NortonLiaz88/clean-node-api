import { AddSurveyRepository } from './../../../../data/protocols/db/survey/add-survey-reository'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '../../../../domain/usecase/add-survey'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const accoutCollection = await MongoHelper.getCollection('surveys')
    await accoutCollection.insertOne({ ...data })
  }
}
