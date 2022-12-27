import { AddAccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository } from './../../../../data/protocols/add-account-repository'
export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AddAccountModel> {
    const accoutCollection = await MongoHelper.getCollection('accounts')
    console.log(accoutCollection)

    const result = await accoutCollection.insertOne({ ...accountData })
    console.log(result.ops[0])
    const account = result.ops[0]
    const { _id, ...accountWithoutId } = account
    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
