import { AddAccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByToken } from './../../../domain/usecase/load-account-by-token'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}

  async load (accessToken: string, role?: string | undefined): Promise<AddAccountModel | null> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
