import { Validation } from './validation'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (value: any): Error | null {
    for (const validation of this.validations) {
      const error = validation.validate(value)
      if (error) {
        return error
      }
    }
    return null
  }
}
