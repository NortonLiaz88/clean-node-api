import { LoadSurveyById } from '@/domain/usecase/load-surveys-by-id'
import { SaveSurveyResult } from '@/domain/usecase/save-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      if (!accountId) {
        return forbidden(new InvalidParamError('accountId'))
      }
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map(ele => ele.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.saveSurveyResult.save({
        accountId, answer, date: new Date(), surveyId
      })
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
