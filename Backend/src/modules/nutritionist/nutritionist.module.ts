import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Nutritionist,
  NutritionistSchema,
} from '../schemas/nutritionist.schema';
import { NutritionistController } from './nutritionist.controller';
import { NutritionistMapper } from '../mapper/nutritionist-mapper';
import { NutritionistService } from './nutritionist.service';
import { NutritionistRepository } from './nutritionist.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Nutritionist.name, schema: NutritionistSchema },
    ]),
  ],
  exports: [MongooseModule, NutritionistService],
  controllers: [NutritionistController],
  providers: [NutritionistService, NutritionistRepository, NutritionistMapper],
})
export class NutritionistModule {}
