import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-surveys-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecase/load-surveys-by-id'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveysRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<SurveyModel> {
    const surveys = await this.loadSurveysRepository.loadById(id)
    return surveys
  }
}
