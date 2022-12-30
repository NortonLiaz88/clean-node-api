import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    if (!httpRequest.body.email) {
      return await new Promise<HttpResponse>((resolve) =>
        resolve(badRequest(new MissingParamError('email')))
      )
    }
    if (!httpRequest.body.password) {
      return await new Promise<HttpResponse>((resolve) =>
        resolve(badRequest(new MissingParamError('password')))
      )
    } else {
      this.emailValidator.isValid(httpRequest.body.email)
      return await new Promise<HttpResponse>((resolve) =>
        resolve(badRequest(new MissingParamError('password')))
      )
    }
  }
}
