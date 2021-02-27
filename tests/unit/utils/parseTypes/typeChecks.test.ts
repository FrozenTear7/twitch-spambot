import {
  isString,
  isNumber,
  isArray,
  exists,
} from './../../../../src/utils/parseTypes/typeChecks'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('isString', () => {
  test('string returns true', () => {
    const valuesToTest = ['test', String('test'), String(1)]

    valuesToTest.forEach((valueToTest) =>
      expect(isString(valueToTest)).toBe(true)
    )
  })

  test('non-string values return false', () => {
    const valuesToTest = [null, undefined, 1, [], ['test']]

    valuesToTest.forEach((valueToTest) =>
      expect(isString(valueToTest)).toBe(false)
    )
  })
})

describe('isNumber', () => {
  test('number returns true', () => {
    const valuesToTest = [1, Number(1), Number('1')]

    valuesToTest.forEach((valueToTest) =>
      expect(isNumber(valueToTest)).toBe(true)
    )
  })

  test('non-number values return false', () => {
    const valuesToTest = [null, undefined, 'test', [], [1]]

    valuesToTest.forEach((valueToTest) =>
      expect(isNumber(valueToTest)).toBe(false)
    )
  })
})

describe('isArray', () => {
  test('valid arrays return true', () => {
    const valuesToTest = [[], Array(5), ['test']]

    valuesToTest.forEach((valueToTest) => {
      expect(isArray(valueToTest)).toBe(true)
    })
  })

  test('non-arrays return false', () => {
    const valuesToTest = [null, undefined, 'test', 1, {}]

    valuesToTest.forEach((valueToTest) =>
      expect(isArray(valueToTest)).toBe(false)
    )
  })
})

describe('exists', () => {
  test('null and undefined return true', () => {
    const valuesToTest = [null, undefined]

    valuesToTest.forEach((valueToTest) =>
      expect(exists(valueToTest)).toBe(false)
    )
  })

  test('anything else return false', () => {
    const valuesToTest = [
      'test',
      1,
      [],
      ['test'],
      Array(3),
      {},
      () => {
        console.log('test')
      },
    ]

    valuesToTest.forEach((valueToTest) =>
      expect(exists(valueToTest)).toBe(true)
    )
  })
})
