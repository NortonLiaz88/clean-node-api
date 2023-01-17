import jwt from 'jsonwebtoken'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {
  }

  async encrypt (value: string): Promise<string | null > {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (value: string): Promise<string | null > {
    const accessToken = await jwt.verify(value, this.secret) as string
    return accessToken
  }
}
