import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './modules/product/product.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
// Why important:
// - Imports all the feature modules of your application.
// - ConfigModule is global, so it can be used anywhere without re-importing.
// - Keeps your app organized and modular.
@Module({
  imports: [
    PaymentsModule,
    DatabaseModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    OrderModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AuthModule],
})
export class AppModule {}
