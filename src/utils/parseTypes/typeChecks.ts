export const isString = (arg: any): arg is string => {
  return typeof arg === 'string' || arg instanceof String
}

export const isNumber = (arg: any): arg is number => {
  return typeof arg === 'number' || arg instanceof Number
}

export const isArray = (arg: any): boolean => {
  return Array.isArray(arg)
}

export const exists = (arg: any): boolean => {
  return typeof arg !== 'undefined' && arg !== null
}
