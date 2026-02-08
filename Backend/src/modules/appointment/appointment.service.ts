import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { UpdateAppointmentDto } from '../dtos/update-appointment.dto';
import { IAppointment } from './domain/appointment.interface';
import { cpf } from 'cpf-cnpj-validator';
import { validateAppointmentDate } from './validator/appointment-validator.date';
import { isWeekend } from '../util/util-date';

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

  async create(appointmentDto: CreateAppointmentDto): Promise<IAppointment[]> {
    const appointmentsToCreate = [];
    const loopCount = appointmentDto.isRecurrent
      ? appointmentDto.recurrenceCount
      : 1;

    const startPeriod = new Date(appointmentDto.startDate);
    const endPeriod = new Date(appointmentDto.endDate);
    const bornDate = new Date(appointmentDto.birthDate);

    for (let i = 0; i < loopCount; i++) {
      const newStart = new Date(startPeriod);
      newStart.setDate(
        newStart.getDate() + appointmentDto.recurrenceInterval * i,
      );

      const newEnd = new Date(endPeriod);
      newEnd.setDate(newEnd.getDate() + appointmentDto.recurrenceInterval * i);

      if (isWeekend(newStart) && appointmentDto.isRecurrent) {
        const nextMonday = newStart.getDay();
        const offset = nextMonday === 6 ? 2 : 1;
        newStart.setDate(newStart.getDate() + offset);
        newEnd.setDate(newEnd.getDate() + offset);
      }

      await this.validateConflict(
        appointmentDto.nutritionistId,
        newStart,
        newEnd,
      );
      this.validateCPF(appointmentDto.cpf);
      validateAppointmentDate(startPeriod, endPeriod, bornDate);

      appointmentsToCreate.push({
        ...appointmentDto,
        startDate: newStart,
        endDate: newEnd,
      });
    }

    const appointment =
      await this.appointmentRepository.create(appointmentsToCreate);

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
    const currentAppointmentDate = new Date(
      (await this.appointmentRepository.findById(id)).startDate,
    );
    const now = new Date();

    if (currentAppointmentDate < now) {
      throw new BadRequestException(
        'Atualização de consultas passadas não são permitidas.',
      );
    }

    console.log(startPeriod, endPeriod);
    await this.validateConflict(
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
