import { AddAccountModel } from '../models/account'

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AddAccountModel | null>
}
