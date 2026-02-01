import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

export enum BodyType {
  ECTOMORPH = 'Ectomorfo',
  MESOMORPH = 'Mesomorfo',
  ENDOMORPH = 'Endomorfo',
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  nutritionistId: string;

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
