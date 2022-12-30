import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { EmailValidator, HttpRequest } from '../../protocols'
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

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email', password: 'any_password'
  }
})

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

    await sut.handle(makeFakeRequest())
    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email')
  })

  test('should return 400 invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})
