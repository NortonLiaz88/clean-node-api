import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountsCollection: Collection

describe('Account Mongo Repository', () => {
  const url = process.env.MONGO_URL
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await MongoHelper.connect(url!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('should return an account on success', async () => {
    const sut = makeSut()
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

  test('should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountsCollection.insertOne({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@gmail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()

    expect(account.name).toEqual('any_name')
    expect(account.email).toEqual('any_email@gmail.com')
    expect(account.password).toEqual('any_password')
  })

  test('should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@gmail.com')
    expect(account).toBeFalsy()
  })
})
