import { AddAccountModel } from '../../../domain/models/account'
import { AddAccount } from '../../../domain/usecase/add-account'
import {
  MissingParamError,
  ServerError
} from '../../errors'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http/http-helpers'
import { Authentication, AuthenticationModel } from '../../../domain/usecase/authentication'

import { Validation } from '../../protocols/validation'
import { HttpRequest } from '../../protocols'
import { SignUpController } from './signup-controller'
import { EmailInUseError } from '../../../validation/protocols/email-in-use-error'
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AddAccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeAccount = (): AddAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  const authenticationStub = new AuthenticationStub()
  return authenticationStub
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, authenticationStub, validationStub)
  return {
    sut,
    addAccountStub,
    authenticationStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle({
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    })
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email', password: 'any_password' })
  })

  test('Should return 403 if AddAccount return null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
})
