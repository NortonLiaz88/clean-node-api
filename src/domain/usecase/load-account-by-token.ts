import { AddAccountModel } from '../models/account'

export interface LoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<AddAccountModel | null>
}
