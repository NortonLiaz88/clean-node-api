import { ok, badRequest, serverError, forbidden } from '../../helpers/http/http-helpers'

import { AddAccount } from '../../../domain/usecase/add-account'
import { Controller } from '../../protocols/contoller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { Authentication } from '../../../domain/usecase/authentication'
import { EmailInUseError } from '../../errors/email-in-use-error'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication,
    private readonly validator: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const accessToken = await this.authentication.auth({ email, password })
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
