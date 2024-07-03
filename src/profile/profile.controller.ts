import { Body, Controller, Get, Put, Request, Injectable } from '@nestjs/common'
import { phoneCheck } from 'src/lib/testing'
import { Roles } from 'src/lib/roles'
import { EmployeeService } from 'src/employee/employee.service'
import { UserService } from 'src/user/user.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/profile')
@Injectable()
export class ProfileController {
  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private prismaService: PrismaService,
  ) {}
  @Get()
  @Roles(['admin', 'store', 'client'])
  async findOne(@Request() request) {
    if (request.user.website === 'client') {
      const result = await this.userService.findOneUser({
        id: request.user.id,
      })
      let hasOpenId = result.phoneNumber !== result.openId
      result.phoneNumber = phoneCheck('+86', result.phoneNumber)
        ? result.phoneNumber.slice(0, 3) + '****' + result.phoneNumber.slice(-4)
        : result.phoneNumber
      return { ...result, hasOpenId }
    }
    if (request.user.website === 'store') {
      return this.employeeService.getOne(request.user.id)
    }
    return this.prismaService.admin.findFirst({
      where: { id: request.user.id },
    })
  }
  @Put()
  @Roles(['client', 'store'])
  async editClientUser(
    @Request() request,
    @Body() { image, name, phoneNumber, password, ...user }: UpdateProfileDto,
  ) {
    if (request.user.website === 'store') {
      return this.employeeService.editOne(
        {
          image,
          name,
          phoneNumber,
          password,
        },
        request.user.id,
      )
    }
    return this.userService.updateUser(
      {
        name,
        ...user,
      },
      request.user.id,
    )
  }
}
