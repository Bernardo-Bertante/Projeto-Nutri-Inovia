import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { NutritionistModule } from './modules/nutritionist/nutritionist.module';
import { NutritionistSeed } from './database/seeds/nutritionist.seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AppointmentModule,
    NutritionistModule,
  ],
  controllers: [AppController],
  providers: [AppService, NutritionistSeed],
})
export class AppModule {}
