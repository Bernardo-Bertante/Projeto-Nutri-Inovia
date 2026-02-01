import { Injectable } from '@nestjs/common';
import { IAppointment } from '../domain/appointment.interface';
import { AppointmentResponseDto } from '../dtos/appointment-response.dto';

@Injectable()
export class AppointmentMapper {
  toResponseDto(a: IAppointment): AppointmentResponseDto {
    return {
      id: a.id!,
      startDate: a.startDate,
      endDate: a.endDate,
      nutritionistId: a.nutritionistId,
      patientName: a.patientName,
      email: a.email,
      phoneNumber: a.phoneNumber,
      birthDate: a.birthDate,
      bodyType: a.bodyType,
      cpf: a.cpf,
      createdAt: a.createdAt!,
      updatedAt: a.updatedAt!,
    };
  }
}
