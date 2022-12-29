import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  const url = process.env.MONGO_URL

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await sut.connect(url!)
  })

  afterAll(async () => {
    await sut.disconnect()
  })
  test('should reconnect if mongo db is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
