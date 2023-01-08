import { Authentication } from '../../../domain/usecase/authentication'
import { ok, unauthorized, badRequest, serverError } from '../../helpers/http/http-helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../protocols'
import { Validation } from '../../protocols/validation'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication, private readonly validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
