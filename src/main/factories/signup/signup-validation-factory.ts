import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator'
import { RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../../presentation/helpers/validators'

export const makeSingUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  const emailValidator = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidator))
  return new ValidationComposite(validations)
}
