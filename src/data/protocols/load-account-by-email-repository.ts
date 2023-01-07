import { AccountModel } from '../models/account'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel>
}
