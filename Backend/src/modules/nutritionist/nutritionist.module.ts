import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Nutritionist,
  NutritionistSchema,
} from '../schemas/nutritionist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Nutritionist.name, schema: NutritionistSchema },
    ]),
  ],
  exports: [MongooseModule],
  controllers: [],
  providers: [],
})
export class NutritionistModule {}
