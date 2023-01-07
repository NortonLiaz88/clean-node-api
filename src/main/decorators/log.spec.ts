import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AddAccountModel } from '../../domain/models/account'
import { ok, serverError } from '../../presentation/helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepository: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise<HttpResponse>((resolve) => resolve(ok(makeFakeAccount())))
    }
  }
  const controllerStub = new ControllerStub()
  return controllerStub
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepository = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepository)
  return { sut, controllerStub, logErrorRepository }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
})

const makeFakeAccount = (): AddAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

describe('LogController decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeHttpRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeHttpRequest())
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('should call LogRepository with the correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepository } = makeSut()
    const logSpy = jest.spyOn(logErrorRepository, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeServerError())))
    await sut.handle(makeFakeHttpRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
