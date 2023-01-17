import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-field-validation'

describe('RequiredField Validation', () => {
  test('should return a Missing Param error if  validation fails', () => {
    const sut = new CompareFieldsValidation('field', 'fiedlToCompare')
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('should not return a Missing Param error if  validation succeeds', () => {
    const sut = new CompareFieldsValidation('field', 'fiedlToCompare')
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
    expect(error).toBeFalsy()
  })
})
