import { AddAccountModel } from '../models/account'

export interface AddAccount {
  add: (account: AddAccountModel) => AddAccountModel
}
