import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')
// jest.mock('../../../../validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['answers', 'question']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
