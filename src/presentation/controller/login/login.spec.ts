import { serverError, unauthorized } from './../../helpers/http-helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { EmailValidator, HttpRequest } from '../../protocols'
import { LoginController } from './login'
import { Authentication } from '../../../data/usecases/autentication/authentication'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  return emailValidatorStub
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string): Promise<string> {
      return await new Promise(resolve => resolve('token'))
    }
  }
  const authenticationStub = new AuthenticationStub()
  return authenticationStub
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email', password: 'any_password'
  }
})

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

describe('Login', () => {
  const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(emailValidatorStub, authenticationStub)
    return {
      sut,
      emailValidatorStub,
      authenticationStub
    }
  }

  test('should return 400 if no email is not provided', async () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'handle')
    const httpRequest = {
      body: { password: 'any_password' }
    }

    const httpRespose = await sut.handle(httpRequest)
    expect(httpRespose).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { email: 'any_email' }
    }

    const httpRespose = await sut.handle(httpRequest)
    expect(httpRespose).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest())
    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email')
  })

  test('should return 400 invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any_email', 'any_password')
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValue(new Promise(resolve => resolve(null as unknown as string)))

    const httpResponse = await sut.handle(makeFakeRequest())
    console.log(httpResponse)
    expect(httpResponse).toEqual(unauthorized())
  })
})
