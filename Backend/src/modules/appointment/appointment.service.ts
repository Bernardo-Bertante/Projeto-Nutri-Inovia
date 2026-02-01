import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { IAppointment } from './domain/appointment.interface';

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async create(appointmentDto: CreateAppointmentDto): Promise<IAppointment> {
    const startPeriod = new Date(appointmentDto.startDate);
    const endPeriod = new Date(appointmentDto.endDate);

    const conflict = await this.appointmentRepository.findConflicting(
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

  async findAll(): Promise<IAppointment[]> {
    return this.appointmentRepository.findAll();
  }

  async update(
    id: string,
    appointmentDto: UpdateAppointmentDto,
  ): Promise<IAppointment> {
    const updatedAppointment = await this.appointmentRepository.update(
      id,
      appointmentDto,
    );
    if (!updatedAppointment) {
      throw new NotFoundException('Consulta não cadastrada no sistema.');
    }
    return updatedAppointment;
  }

  async findById(id: string): Promise<IAppointment> {
    return this.appointmentRepository.findById(id);
  }

  async delete(id: string): Promise<void> {
    const appointmentToBeDeleted = await this.findById(id);

    if (!appointmentToBeDeleted) {
      throw new NotFoundException('Consulta não encontrada.');
    }
    await this.appointmentRepository.deleteAppointment(id);
  }
}
