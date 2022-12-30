import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { EmailValidator } from '../../protocols'
import { LoginController } from './login'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  return emailValidatorStub
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

describe('Login', () => {
  const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(emailValidatorStub)
    return {
      sut,
      emailValidatorStub
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
    const httpRequest = {
      body: { email: 'any_email', password: 'any_password' }
    }

    await sut.handle(httpRequest)
    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email')
  })
})
