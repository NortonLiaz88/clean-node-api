import { AddAccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/load-account-by-token-repository '
export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository {
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

  async loadByToken (token: string, role?: string): Promise<AddAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accoutCollection = await MongoHelper.getCollection('accounts')
    const account = await accoutCollection.updateOne({ _id: id }, {
      $set: {
        accessToken: token
      }
    })
    return account && MongoHelper.map(account)
  }
}
