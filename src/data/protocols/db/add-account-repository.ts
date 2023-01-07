import { AddAccountModel } from '../../../domain/models/account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AddAccountModel>
}
