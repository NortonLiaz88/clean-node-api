import { DbLoadAccountByToken } from './load-account-by-token'
import { Decrypter } from './../../protocols/cryptography/decrypter'

describe('DbLoadAccountByToken UseCase', () => {
  test('should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string | null> {
        return await new Promise<string | null>((resolve, reject) => resolve('any_value'))
      }
    }
    const decrypterStub = new DecrypterStub()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    const sut = new DbLoadAccountByToken(decrypterStub)
    await sut.load('any_token')
    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })
})
