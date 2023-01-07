import bcrypt from 'bcrypt'

import { Hasher } from '../../data/protocols/cryptography/hasher'

export class BCryptAdapter implements Hasher {
  constructor (private readonly salt: number) {}
  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return await new Promise<string>(resolve => resolve(hash))
  }
}
