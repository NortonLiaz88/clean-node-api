/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import {
  Authentication,
  AuthenticationModel
} from '@/domain/usecase/authentication'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {

  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authentication.email
    )
    if (account) {
      const isValid = await this.hashComparer.compare(
        authentication.password,
        account?.password
      )
      if (isValid) {
        const accessToken = await this.tokenGenerator.encrypt(account?.id!)
        await this.updateAccessTokenRepository.updateAccessToken(account?.id!, accessToken!)
        return accessToken
      }
    }
    return null
  }
}
