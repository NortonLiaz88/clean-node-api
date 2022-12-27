import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('CLIENT CONNECTED')
    await this.client.db().command({ ping: 1 })
    console.log('Connected successfully to server')
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  async getCollection (name: string): Collection {
    const collection = await this.client.db().collection(name)
    console.log('NEW COLLECTION', collection)
    return collection
  }
}
