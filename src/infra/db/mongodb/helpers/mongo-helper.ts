import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    await this.client.db().command({ ping: 1 })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  async getCollection (name: string): Collection {
    const collection = await this.client.db().collection(name)
    return collection
  },

  map (collection: any): any {
    const { _id, ...collectionId } = collection
    return Object.assign({}, collectionId, { id: _id })
  }
}
