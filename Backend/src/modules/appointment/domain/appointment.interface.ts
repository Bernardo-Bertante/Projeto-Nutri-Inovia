import { BodyType } from '../schemas/appointment.schema';

export interface IAppointment {
  id?: string;
  startDate: Date;
  endDate: Date;
  nutritionistId: string;
  patientName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  bodyType: BodyType;
  cpf: string;
  createdAt?: Date;
  updatedAt?: Date;
}
