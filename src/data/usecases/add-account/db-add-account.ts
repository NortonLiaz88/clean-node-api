import { AddAccountModel } from '../../../domain/models/account'
import { AddAccount } from '../../../domain/usecase/add-account'
import { AddAccountRepository } from '../../protocols/db/add-account-repository'
import { Encrypter } from '../../protocols/cryptography/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AddAccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return await new Promise((resolve) =>
      resolve(account)
    )
  }
}
