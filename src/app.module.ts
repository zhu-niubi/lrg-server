import { CacheModule, Module, ValidationPipe } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import { UploadController } from '@controller/upload.controller'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AllExceptionsFilter } from 'src/filter/AllExceptionsFilter'
import { BullModule } from '@nestjs/bull'
import { WxappService } from 'src/wxapp/wxapp.service'
import { redisConfig } from 'src/lib/redis'
import { RollModule } from 'src/roll/roll.module'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { ProductModule } from 'src/product/product.module'
import { OrderModule } from 'src/order/order.module'
import { ConstructionModule } from 'src/construction/construction.module'
import { CouponTemplateModule } from 'src/coupon-template/coupon-template.module'
import { WebsiteGuard } from 'src/middleware/website.guard'
import { CarModule } from 'src/car/car.module'
import { StoreModule } from 'src/store/store.module'
import { CouponModule } from 'src/coupon/coupon.module'
import { ImageModule } from 'src/image/image.module'
import { RecommendModule } from 'src/recommend/recommend.module'
import { EmployeeModule } from 'src/employee/employee.module'
import { ProductModelModule } from 'src/product-model/product-model.module'
import { ProductPositionModule } from 'src/product-position/product-position.module'
import { ProductTypeModule } from 'src/product-type/product-type.module'
import { UserModule } from 'src/user/user.module'
import { UserCarModule } from 'src/user-car/user-car.module'
import { WelfareModule } from 'src/welfare/welfare.module'
import { QRcodeController } from '@controller/qrcode.controller'
import { TasksService } from '@service/cron/tasks.service'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModelModule } from 'src/config-model/config-model.module'
import { AppController } from '@controller/login.controller'
import { NoticeController } from '@controller/notice.controller'
import { SocketsModule } from './module/ws.module'
import { ProfileModule } from 'src/profile/profile.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthModule } from 'src/auth/auth.module'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PointModule } from './point/point.module'
import { PointRecordModule } from './point-record/point-record.module'
import { ProductPackModule } from './product-pack/product-pack.module'
import { UserProductPackModule } from './user-product-pack/user-product-pack.module'
import { ConstructionImageModule } from './construction-image/construction-image.module'
import { WxappModule } from './wxapp/wxapp.module'
import { PaymentModule } from './payment/payment.module'
import { SettlementOrderModule } from './settlement_order/settlement_order.module'

@Module({
  imports: [
    SettlementOrderModule,
    PrismaModule,
    RollModule,
    AuthModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot('redisKey', {
      redis: redisConfig,
    }),
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    ProductModule,
    ConstructionModule,
    CouponTemplateModule,
    CarModule,
    StoreModule,
    CouponModule,
    ImageModule,
    RecommendModule,
    EmployeeModule,
    ProductModelModule,
    ProductPositionModule,
    ProductTypeModule,
    UserModule,
    UserCarModule,
    WelfareModule,
    OrderModule,
    ConfigModelModule,
    SocketsModule,
    ProfileModule,
    PointModule,
    PointRecordModule,
    ProductPackModule,
    UserProductPackModule,
    ConstructionImageModule,
    WxappModule,
    PaymentModule,
  ],
  controllers: [
    UploadController,
    QRcodeController,
    AppController,
    NoticeController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: WebsiteGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
    WxappService,
    TasksService,
  ],
})
export class BackendModule {}
