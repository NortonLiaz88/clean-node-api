import { LoadAccountByToken } from '../../domain/usecase/load-account-by-token'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http/http-helpers'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken, private readonly role?: string) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`Access token: ${accessToken}`)
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        console.log('Account', account)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
