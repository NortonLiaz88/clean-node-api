import { AddAccountModel } from '../../../domain/models/account'
import { AddAccount } from '../../../domain/usecase/add-account'
import { Encrypter } from '../../interfaces/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AddAccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve({ name: '', email: '', password: '' }))
  }
}
