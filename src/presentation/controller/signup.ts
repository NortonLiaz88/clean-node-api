import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/badRequest'
import { Controller } from '../protocols/contoller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from './../protocols/http'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields: string[] = [
      'name',
      'email',
      'password',
      'passwodConfirmation'
    ]
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return {
      statusCode: 200,
      body: {}
    }
  }
}
