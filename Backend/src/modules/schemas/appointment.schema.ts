import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Nutritionist } from './nutritionist.schema';

export type AppointmentDocument = HydratedDocument<Appointment>;

export enum BodyType {
  ECTOMORPH = 'ECTOMORFO',
  MESOMORPH = 'MESOMORFO',
  ENDOMORPH = 'ENDOMORFO',
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    type: Types.ObjectId,
    ref: Nutritionist.name,
    required: true,
  })
  nutritionistId: Types.ObjectId;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, enum: BodyType })
  bodyType: BodyType;

  @Prop({ required: true })
  cpf: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

AppointmentSchema.index({ nutritionistId: 1, startDate: 1, endDate: 1 });
