import { AddAccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository } from './../../../../data/protocols/add-account-repository'
export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AddAccountModel> {
    const accoutCollection = await MongoHelper.getCollection('accounts')

    const result = await accoutCollection.insertOne({ ...accountData })
    return MongoHelper.map(result.ops[0])
  }
}
