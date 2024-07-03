import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { JwtParse } from 'src/middleware/jwt.middleware'
import { Server, WebSocket } from 'ws'

interface _WebSocket extends WebSocket {
  id: number
}

@WebSocketGateway({
  transports: ['websocket'],
})
export class SocketService {
  @WebSocketServer()
  server: Server

  handleConnection(client, request) {
    const res = new URLSearchParams(request.url.substring(2))
    try {
      const User: any = JwtParse(res.get('token'))
      client.id = User.id
    } catch (err) {
      client.close()
    }
  }

  async usedCoupon(userId: number, data: any, status: number) {
    this.server.clients.forEach((i: _WebSocket) => {
      if (i.id === userId && i.readyState === 1) {
        i.send(JSON.stringify({ event: 'usedCoupon', data, status }), err => {
          console.log(err)
        })
      }
    })
  }
}
