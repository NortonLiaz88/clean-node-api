export class EmailInUseError extends Error {
  constructor () {
    super('The received email address is already in use')
    this.name = 'EmailInUseError'
  }
}
