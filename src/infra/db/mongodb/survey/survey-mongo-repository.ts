import { LoadSurveysRepository } from './../../../../data/protocols/db/survey/load-surveys-repository'
import { AddSurveyRepository } from './../../../../data/protocols/db/survey/add-survey-reository'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '../../../../domain/usecase/add-survey'
import { SurveyModel } from '../../../../domain/models/survey'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const accoutCollection = await MongoHelper.getCollection('surveys')
    await accoutCollection.insertOne({ ...data })
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const surveys: SurveyModel[] = await surveysCollection.find().toArray()
    return surveys
  }
}
