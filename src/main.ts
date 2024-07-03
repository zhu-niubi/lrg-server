import { NestFactory } from '@nestjs/core'
import { BackendModule } from 'src/app.module'
import { WsAdapter } from '@nestjs/platform-ws'
import { config } from 'dotenv'

config()
async function bootstrap() {
  const backendApp = await NestFactory.create(BackendModule)
  backendApp.useWebSocketAdapter(new WsAdapter(backendApp))
  backendApp.enableCors({ origin: '*' })
  await backendApp.listen(8088)
}
bootstrap()
