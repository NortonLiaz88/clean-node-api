import { AddAccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from './../../domain/usecase/load-account-by-token'
import { AccessDeniedError } from './../errors/access-denied-error'
import { forbidden } from './../helpers/http/http-helpers'
import { AuthMiddleware } from './auth-middleware'

const makeFakeAccount = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeLoadAccount = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string | undefined): Promise<AddAccountModel | null> {
      return await new Promise<AddAccountModel | null>((resolve, reject) => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccount()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut, loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccount by token with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle({ headers: { 'x-access-token': 'any_token' } })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
