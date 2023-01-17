import { Validation } from '@/presentation/protocols/validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {
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
