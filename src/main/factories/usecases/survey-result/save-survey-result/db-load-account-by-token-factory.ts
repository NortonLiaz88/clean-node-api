import { DbSaveSurveyResult } from '@/data/usecases/save-survey-result/db-load-surveys'
import { SaveSurveyMongoRepository } from '@/infra/db/mongodb/save-survey/save-survey-mongo-repository'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyResultMongoRepository = new SaveSurveyMongoRepository()
  const suveyMongoRepository = new SaveSurveyMongoRepository()

  return new DbSaveSurveyResult(surveyResultMongoRepository, suveyMongoRepository)
}
