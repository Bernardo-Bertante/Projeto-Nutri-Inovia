import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NutritionistDocument = HydratedDocument<Nutritionist>;

@Schema({ timestamps: true })
export class Nutritionist {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  crn: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const NutritionistSchema = SchemaFactory.createForClass(Nutritionist);
