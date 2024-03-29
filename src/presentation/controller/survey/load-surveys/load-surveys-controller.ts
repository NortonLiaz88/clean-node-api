import { LoadSurveys } from '@/domain/usecase/load-surveys'
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
