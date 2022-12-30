import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    if (!email) {
      return await new Promise<HttpResponse>((resolve) =>
        resolve(badRequest(new MissingParamError('email')))
      )
    }
    if (!password) {
      return await new Promise<HttpResponse>((resolve) =>
        resolve(badRequest(new MissingParamError('password')))
      )
    } else {
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return await new Promise<HttpResponse>((resolve) =>
          resolve(badRequest(new InvalidParamError('email')))
        )
      }
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          email,
          password
        }
      }
      return httpResponse
    }
  }
}
