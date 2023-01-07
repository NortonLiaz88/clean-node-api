import { AddAccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AddAccountModel> {
    const accoutCollection = await MongoHelper.getCollection('accounts')

    const result = await accoutCollection.insertOne({ ...accountData })
    return MongoHelper.map(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AddAccountModel> {
    const accoutCollection = await MongoHelper.getCollection('accounts')
    const account = await accoutCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }
}
