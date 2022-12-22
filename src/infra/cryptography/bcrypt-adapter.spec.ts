import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise<string>((resolve) => resolve('hash'))
  }
}))

const salt = 12

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut()
    await sut.encrypt('value')
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on sucess', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hash')
  })

  test('Should thwor if Bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_value')

    await expect(promise).rejects.toThrow()
  })
})
