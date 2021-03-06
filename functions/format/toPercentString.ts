import { Numberish } from '@/types/constants'

import { eq, gt, lt } from '../numberish/compare'
import { mul } from '../numberish/operations'
import toFraction from '../numberish/toFraction'
import { toString } from '../numberish/toString'

/**
 * @example
 * toPercentString(0.58) //=> '58%'
 * toPercentString('0.58', { fixed: 2 }) //=> '58.00%'
 * toPercentString(new Fraction(58, 100)) //=> '58.00%'
 * toPercentString(58, {}) //=> '58.00%'
 */
export default function toPercentString(
  n: Numberish | undefined,
  options?: {
    /** by default, it will output <0.01% if it is too small   */
    exact?: boolean
    /** @default 2  */
    fixed?: number
    /** maybe backend will, but it's freak */
    alreadyPercented?: boolean
    /** usually used in price */
    alwaysSigned?: boolean
  }
): string {
  try {
    return '0%'
    // const fractionN = toFraction(n ?? 0)
    // const stringPart = fractionN.mul(options?.alreadyPercented ? 1 : 100).toFixed(options?.fixed ?? 2)
    // if (eq(fractionN, 0)) return '0%'
    // if (!options?.exact && stringPart === '0.00') return options?.alwaysSigned ? '<+0.01%' : '<0.01%'
    // return options?.alwaysSigned ? `${getSign(stringPart)}${toString(getUnsignNumber(stringPart))}%` : `${stringPart}%`
  } catch (err) {
    return '0%'
  }
}

function getSign(s: Numberish) {
  return gt(s, 0) ? '+' : '-'
}
function getUnsignNumber(s: Numberish) {
  return gt(s, 0) ? s : mul(s, -1)
}
