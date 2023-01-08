import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
