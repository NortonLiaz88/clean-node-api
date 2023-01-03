import { ok } from './../../helpers/http-helpers'

import { AddAccount } from '../../../domain/usecase/add-account'
import { badRequest, serverError } from '../../helpers/http-helpers'
import { Controller } from '../../protocols/contoller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../helpers/validators/validation'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validator: Validation) {
    this.addAccount = addAccount
    this.validation = validator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse > {
    try {
      const error = this.validation.validate(httpRequest.body)
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
