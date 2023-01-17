import { LogErrorRepository } from '@/data/protocols/db/log-error-repository'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Controller } from '@/presentation/protocols/contoller'
export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      console.log(httpResponse)
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
