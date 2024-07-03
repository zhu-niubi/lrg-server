export interface ResponseSuccessType {
  code: number
  data?: object | undefined | null
}
export interface ResponseFailType {
  code: number
  message: string | undefined | void | unknown
}

interface Response {
  Success(data: object | null | undefined | void): ResponseSuccessType
  Fail(
    message: string | undefined | void | unknown,
    code?: number,
  ): ResponseFailType
}

export const Response: Response = {
  Success: data => (data ? { code: 0, data } : { code: 0 }),
  Fail: (message, code) => ({ code: code || 1, message }),
}
