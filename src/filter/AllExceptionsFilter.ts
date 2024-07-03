import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Request } from 'express'
import crypto from 'crypto'
import http from 'http-status-codes'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger('HttpException')

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    this.logger.error(`
    statusCode: ${httpStatus} \n
    method: ${request.method} \n
    body: ${JSON.stringify(request.body)} \n
    header: ${JSON.stringify(request.headers)} \n
    query: ${JSON.stringify(request.query)} \n
    path: ${request.url} \n
    err:  ${
      typeof exception === 'object' ? JSON.stringify(exception) : exception
    }`)
    exception instanceof Error && this.logger.error(exception.message)
    if (exception instanceof UnauthorizedException) {
      httpAdapter.reply(
        ctx.getResponse(),
        '登陆已过期，请重新安装客户端',
        http.UNAUTHORIZED,
      )
      return
    }
    if (exception instanceof Prisma.PrismaClientValidationError) {
      sendMessage(`
      statusCode: ${httpStatus} \n
      method: ${request.method} \n
      body: ${JSON.stringify(request.body)} \n
      header: ${JSON.stringify(request.headers)} \n
      query: ${JSON.stringify(request.query)} \n
      path: ${request.url} \n
      err:  ${
        typeof exception === 'object' ? JSON.stringify(exception) : exception
      }
    `).then(() => {})
      httpAdapter.reply(
        ctx.getResponse(),
        {
          code: 1,
          message: `系统错误,请联系管理员 ${dayjs().format(
            'YYYY-MM-DD hh:mm:ss',
          )}`,
        },
        200,
      )
      return
    }

    if (exception instanceof Error) {
      if (Number(httpStatus) !== 404) {
        sendMessage(`
        statusCode: ${httpStatus} \n
        method: ${request.method} \n
        body: ${JSON.stringify(request.body)} \n
        header: ${JSON.stringify(request.headers)} \n
        query: ${JSON.stringify(request.query)} \n
        path: ${request.url} \n
        err:  ${
          typeof exception === 'object'
            ? JSON.stringify(exception.message)
            : exception
        }
      `).then(() => {})
      }
      httpAdapter.reply(
        ctx.getResponse(),
        {
          code: 1,
          message: exception.message,
        },
        200,
      )
      return
    }
    httpAdapter.reply(ctx.getResponse(), exception, httpStatus)
  }
}

function sendMessage(message: string) {
  const params = new URLSearchParams()
  const secret =
    'SECc10e022abe67f5bba7f3aa6c936f65da061b5d6bd2fb8f3f8700e83a2fce943c'
  const timestamp = new Date().getTime().toString()
  const sign = crypto
    .createHmac('sha256', secret)
    .update(timestamp + '\n' + secret)
    .digest('base64')
  params.append(
    'access_token',
    '6b085fce1f46e050ed1989e3779741e5fcd6fdbe3fceef10d76e0403cfe2eded',
  )
  params.append('timestamp', timestamp)
  params.append('sign', sign)

  //
  // fetch(`https://oapi.dingtalk.com/robot/send?${params.toString()}`,{method:'POST',body:''});
  return fetch(`https://oapi.dingtalk.com/robot/send?${params.toString()}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ msgtype: 'text', text: { content: message } }),
  }).then(res => res.json())
}
