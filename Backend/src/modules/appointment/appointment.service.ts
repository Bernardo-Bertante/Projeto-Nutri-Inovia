import { BadRequestException, Injectable } from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async create(appointmentDto: CreateAppointmentDto) {
    const startPeriod = new Date(appointmentDto.startDate);
    const endPeriod = new Date(appointmentDto.endDate);

    const conflict = this.appointmentRepository.findConflicting(
      appointmentDto.nutritionistId,
      startPeriod,
      endPeriod,
    );

    if (conflict) {
      throw new BadRequestException(
        'Conflito de horário! Este nutricionista já possui agendamento neste intervalo de tempo desse dia.',
      );
    }

    return this.appointmentRepository.create(appointmentDto);
  }

  async findAll() {
    return this.appointmentRepository.findAll();
  }
}
