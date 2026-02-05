import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { UpdateAppointmentDto } from '../dtos/update-appointment.dto';
import { IAppointment } from './domain/appointment.interface';
import { isWeekend } from '../util/util-date';
import { cpf } from 'cpf-cnpj-validator';
import { throwError } from 'rxjs';
import { validateAppointmentDate } from './validator/appointment-validator.date';

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  private async validateConflict(
    nutritionistId: string,
    start: Date,
    end: Date,
    ignoreId?: string,
  ) {
    const conflict = await this.appointmentRepository.findConflicting(
      nutritionistId,
      start,
      end,
      ignoreId,
    );

    if (conflict) {
      throw new BadRequestException(
        'Conflito de horário! Este nutricionista já possui agendamento neste intervalo de tempo desse dia.',
      );
    }
  }

  private validateCPF(DTOcpf: string) {
    if (!cpf.isValid(DTOcpf)) {
      throw new BadRequestException('CPF inválido');
    }
  }

  async create(appointmentDto: CreateAppointmentDto): Promise<IAppointment> {
    const startPeriod = new Date(appointmentDto.startDate);
    const endPeriod = new Date(appointmentDto.endDate);
    const bornDate = new Date(appointmentDto.birthDate);

    console.log(startPeriod, endPeriod);

    this.validateConflict(
      appointmentDto.nutritionistId,
      startPeriod,
      endPeriod,
    );

    this.validateCPF(appointmentDto.cpf);

    validateAppointmentDate(startPeriod, endPeriod, bornDate);
    const appointment = await this.appointmentRepository.create(appointmentDto);

    return appointment;
  }

  async findAll(): Promise<IAppointment[]> {
    return await this.appointmentRepository.findAllPopulated();
  }

  async update(
    id: string,
    appointmentDto: UpdateAppointmentDto,
  ): Promise<IAppointment> {
    const startPeriod = new Date(appointmentDto.startDate);
    const endPeriod = new Date(appointmentDto.endDate);
    const bornDate = new Date(appointmentDto.birthDate);

    this.validateConflict(
      appointmentDto.nutritionistId,
      startPeriod,
      endPeriod,
      id,
    );

    this.validateCPF(appointmentDto.cpf);

    console.log(startPeriod, endPeriod);

    validateAppointmentDate(startPeriod, endPeriod, bornDate);

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
