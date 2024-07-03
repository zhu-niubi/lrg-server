import { Injectable } from '@nestjs/common';
@Injectable()
export class UserMiddleware {
  user = {
    id: 0,
  };
  setUser(id: number) {
    this.user.id = id;
  }
  getUser() {
    return this.user;
  }
}
