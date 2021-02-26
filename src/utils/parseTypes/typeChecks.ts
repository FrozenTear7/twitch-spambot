export const isString = (arg: unknown): arg is string => {
  return typeof arg === 'string' || arg instanceof String
}

export const isNumber = (arg: unknown): arg is number => {
  return typeof arg === 'number' || arg instanceof Number
}

export const isArray = (arg: unknown): boolean => {
  return Array.isArray(arg)
}

export const exists = (arg: unknown): boolean => {
  return typeof arg === 'undefined' || arg === null
}
