import { AuthenticationModel } from '../../../domain/usecase/authentication'
import { AccountModel } from '../../models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authenticatio'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccounByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccounByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccounByEmailRepositoryStub)
  return { sut, loadAccounByEmailRepositoryStub }
}

describe('DbAuthentication UseCase', () => {
  test('should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccounByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccounByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
