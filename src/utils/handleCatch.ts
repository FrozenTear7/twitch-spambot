/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString } from './parseTypes/typeChecks'
import colors from 'colors'

export const handleCatch = (logMsg: string, e: any): void => {
  if (e instanceof Error) {
    console.log(colors.red(`${logMsg}: ${e.message}`))
  } else if (isString(e)) {
    console.log(colors.red(`${logMsg}: ${e}`))
  } else {
    throw e
  }
}
