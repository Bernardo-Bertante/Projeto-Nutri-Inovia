import { Injectable } from '@nestjs/common';
import { IAppointment } from '../appointment/domain/appointment.interface';
import { AppointmentResponseDto } from '../dtos/appointment-response.dto';

@Injectable()
export class AppointmentMapper {
  toResponseDto(a: IAppointment): AppointmentResponseDto {
    const nutritionistData = a.nutritionistId as any;
    const nutritionistValue =
      nutritionistData && nutritionistData.name
        ? {
            id: nutritionistData.id.toString(),
            name: nutritionistData.name,
            crn: nutritionistData.crn,
          }
        : nutritionistData.toString();
    return {
      id: a.id!,
      startDate: a.startDate,
      endDate: a.endDate,
      nutritionistId: nutritionistValue,
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
