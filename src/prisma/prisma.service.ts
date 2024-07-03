import { Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import * as runtime from '@prisma/client/runtime/library'
import $Result = runtime.Types.Result
export interface FindAndCountParams {
  tableName: Prisma.ModelName
  pageSize?: number
  pageNumber?: number
  where?: { [key: string]: any }
  include?: { [key: string]: any }
  select?: { [key: string]: any }
  orderBy?: { [key: string]: any }
}
export interface Data<T> {
  pageNumber: number
  pageSize: number
  totalNumber: number
  list: T[]
}
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
    this.$use((params, next) => {
      const { action } = params
      switch (action) {
        case 'create':
        case 'createMany':
          params.args.data = this.format(params.args.data)
          break
        case 'update':
          params.args.data = { ...params.args.data, updatedAt: dayjs().unix() }
          break
      }
      return next(params)
    })
  }
  constructor() {
    super({
      errorFormat: 'colorless',
    })
  }
  table<T extends Prisma.TypeMap['meta']['modelProps']>(tableName: T) {
    return async <
      K extends Prisma.TypeMap['model'][T]['operations']['findMany']['args'],
    >({
      pageSize,
      pageNumber,
      ...props
    }: {
      pageSize: number
      pageNumber: number
    } & K) => {
      const client: any = this[tableName]
      const [list, count]: [
        $Result.GetResult<Prisma.TypeMap['model'][T]['payload'], K, 'findMany'>,
        number,
      ] = await this.$transaction([
        client.findMany({
          ...props,
          skip: (pageNumber - 1) * pageSize,
          take: pageSize,
        }),
        client.count({ where: props.where }),
      ])

      return {
        pageSize,
        pageNumber,
        totalNumber: count,
        list,
      }
    }
  }
  async findAndCount<T>(params: FindAndCountParams): Promise<Data<T>> {
    const { pageSize = 10, pageNumber = 1, tableName, ...config } = params
    const skip = pageSize * (pageNumber - 1)
    const take = Number(pageSize)
    try {
      const table: any = this[tableName]
      const [list, count]: [T[], number] = await this.$transaction([
        table.findMany({ skip, take, ...config }),
        table.count({ where: config.where }),
      ])
      return {
        pageNumber: Number(pageNumber),
        pageSize: take,
        list,
        totalNumber: count,
      }
    } catch (err) {
      throw err
    }
  }
  format(record: [] | object) {
    return Array.isArray(record)
      ? record.map((i: any, index) => ({
          ...i,
          createdAt: dayjs().unix() + index,
          updatedAt: dayjs().unix() + index,
        }))
      : { ...record, createdAt: dayjs().unix(), updatedAt: dayjs().unix() }
  }
}
