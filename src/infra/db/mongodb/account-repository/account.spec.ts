import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  const url = process.env.MONGO_URL
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await MongoHelper.connect(url!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()

    expect(account.name).toEqual('any_name')
    expect(account.email).toEqual('any_email')
    expect(account.password).toEqual('any_password')
  })
})
