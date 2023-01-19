import { LoadSurveyById } from '@/domain/usecase/load-surveys-by-id'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return await new Promise<HttpResponse>((resolve, reject) => resolve({} as HttpResponse))
  }
}
