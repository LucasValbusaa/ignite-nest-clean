import { hash, compare } from 'bcryptjs'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
