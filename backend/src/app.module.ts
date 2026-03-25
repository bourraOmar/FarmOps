import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FarmsModule } from './farms/farms.module';
import { LivestockModule } from './livestock/livestock.module';
import { WorkersModule } from './workers/workers.module';
import { MilkModule } from './milk/milk.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/farmops'),
    AuthModule,
    UsersModule,
    FarmsModule,
    LivestockModule,
    WorkersModule,
    MilkModule,
    AdminModule,
  ],
})
export class AppModule {}
