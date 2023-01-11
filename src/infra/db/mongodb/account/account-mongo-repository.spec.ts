import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

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

  test('should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const res = await accountsCollection.insertOne({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
    const fakeAccount = res.ops[0]
    expect(fakeAccount.accessToken).toBeFalsy()
    await sut.updateAccessToken(fakeAccount._id, 'any_token')
    const account = await accountsCollection.findOne({ _id: fakeAccount._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toEqual('any_token')
  })

  describe('loadByToken', () => {
    test('Should return an account on loadByToken', async () => {
      const sut = makeSut()
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()

      expect(account.name).toEqual('any_name')
      expect(account.email).toEqual('any_email@gmail.com')
      expect(account.password).toEqual('any_password')
      expect(account.accessToken).toEqual('any_token')
    })
  })
})
