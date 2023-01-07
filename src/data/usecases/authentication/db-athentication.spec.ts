import { AccountModel } from '../../models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authenticatio'

describe('DbAuthentication UseCase', () => {
  test('should call LoadAccountByEmail with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'any_password'
        }
        return await new Promise(resolve => resolve(account))
      }
    }
    const loadAccounByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccounByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccounByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
