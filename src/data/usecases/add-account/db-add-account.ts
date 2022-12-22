import { AddAccountModel } from '../../../domain/models/account'
import { AddAccount } from '../../../domain/usecase/add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AddAccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add(Object.assign(accountData, { password: hashedPassword }))
    return await new Promise((resolve) =>
      resolve({ name: '', email: '', password: '' })
    )
  }
}
