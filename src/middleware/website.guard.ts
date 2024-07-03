import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { User } from 'src/types/global'

@Injectable()
export class WebsiteGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles || !context.switchToHttp().getRequest().context) {
      return true
    }
    const { user }: { user: User } = context.switchToHttp().getRequest().context
    if (!roles.includes(user.website)) {
      throw Error('权限不足')
    }
    return true
  }
}
