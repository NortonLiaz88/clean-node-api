import { Validation } from '../../../../presentation/protocols/validation'
import { RequiredFieldValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from '../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validators-adapter'
import { makeSingUpValidation } from './signup-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSingUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
