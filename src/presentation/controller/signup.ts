import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/badRequest'
import { Controller } from '../protocols/contoller'
import { HttpRequest, HttpResponse } from './../protocols/http'
export class SignUpController implements Controller {
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
    return {
      statusCode: 200,
      body: {}
    }
  }
}
