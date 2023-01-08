import { ok, badRequest, serverError } from '../../helpers/http/http-helpers'

import { AddAccount } from '../../../domain/usecase/add-account'
import { Controller } from '../../protocols/contoller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../protocols/validation'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly validator: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse > {
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
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
