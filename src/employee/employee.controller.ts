import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  ParseIntPipe,
  Param,
  Delete,
  Request,
  All,
  Next,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { GetEmployeeDto } from './dto/get-employee.dto'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { EmployeeService } from './employee.service'
import { Roles } from 'src/lib/roles'
import { RestPasswordDTO } from './dto/reset-employee.dto'

@Controller('/employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  @Get()
  async getEmployee(
    @Request() request,
    @Query()
    query: GetEmployeeDto,
  ) {
    if (request.user.website === 'store') {
      query.storeId = request.user.storeId
    }
    const result = await this.employeeService.getAll(query)
    return Response.Success(result)
  }
  @Get('/:id')
  async getOne(@Param('id') id) {
    const result = await this.employeeService.getOne(+id)
    return result
  }
  @Post()
  @Roles(['admin', 'store'])
  async addOne(
    @Request() request,
    @Body()
    body: CreateEmployeeDto,
  ) {
    try {
      if (request.user.website === 'store') {
        body.storeId = request.user.storeId
      }
      await this.employeeService.addOne(body)
      return Response.Success()
    } catch (err) {
      if (err?.meta?.target === 'uniqueUser') {
        return Response.Fail('用户名已存在')
      }
      throw err
    }
  }
  @Post('/reset_pass')
  async resetPass(
    @Request() request,
    @Body()
    { newPassword, oldPassword }: RestPasswordDTO,
  ) {
    await this.employeeService.resetPass({
      newPassword,
      oldPassword,
      userId: request.user.id,
    })
    return Response.Success()
  }

  @All('/:id')
  async setAll(@Param('id') id, @Request() request, @Next() next) {
    if (request.user.website === 'store') {
      const result = await this.employeeService.getOne(+id)
      if (result.storeId === request.user.storeId) {
        next()
      } else {
        throw Error('找不到该信息')
      }
      return
    }
    next()
  }
  @Put('/:id')
  @Roles(['admin', 'store'])
  async editOne(
    @Body()
    body: UpdateEmployeeDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.employeeService.editOne(body, id)
  }

  @Delete('/:id')
  @Roles(['admin', 'store'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    await this.employeeService.deleteOne(id)
    return Response.Success()
  }
}
