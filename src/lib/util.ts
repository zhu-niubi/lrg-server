import { SetMetadata } from '@nestjs/common'
import crypto from 'crypto'
import dayjs from 'dayjs'
import { random } from 'lodash'
export const MD5 = (str: string): string =>
  crypto.createHash('md5').update(str).digest('hex')

export const IntParse = (str: any) =>
  isNaN(Number(str)) ? undefined : Number(str)

console.log(random(0, 9, false))

export const BuildOrderNumber = (sku?: boolean) => {
  const day = dayjs()
  const str = day.valueOf().toString().substring(3)
  return (
    day.format(sku ? 'YYMMDDmmss' : 'YYMMDD') +
    str +
    random(0, 9, false) +
    1
  ).toLocaleUpperCase() //+1代表渠道
}

export function exclude<T, Key extends keyof T>(
  resultSet: T,
  ...keys: Key[]
): Omit<T, Key> {
  for (let key of keys) {
    delete resultSet[key]
  }
  return resultSet
}

export const BuildCode = (): string => {
  const Az = new Array(26).fill('').map((_, i) => String.fromCharCode(65 + i))
  let str = ''
  let now = dayjs().format('YYMMDD')
  for (let i = 0; i < 4; i++) {
    str += Az[Math.floor(Math.random() * Az.length)]
  }
  for (let i = 0; i < 4; i++) {
    now += Math.floor(Math.random() * 9).toString()
  }
  return str + now
}

export const IS_PUBLIC_KEY = 'isPublic'

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
