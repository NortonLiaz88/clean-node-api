import { Authentication } from '../../../data/usecases/autentication/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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
        const token = await this.authentication.auth(email, password)
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            token
          }
        }
        return httpResponse
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
