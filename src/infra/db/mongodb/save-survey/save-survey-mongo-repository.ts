import { MongoHelper } from '../helpers/mongo-helper'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecase/save-survey-result'

export class SaveSurveyMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const accoutCollection = await MongoHelper.getCollection('surveys')
    const result = await accoutCollection.findOneAndUpdate(
      { surveyId: data.surveyId, accountId: data.accountId },
      {
        $set: {
          answer: data.answer,
          date: data.date
        }
      },
      { upsert: true, returnOriginal: false }
    )

    return MongoHelper.map(result.value)
  }
}
