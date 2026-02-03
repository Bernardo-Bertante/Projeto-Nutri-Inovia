import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Appointment,
  AppointmentDocument,
} from '../schemas/appointment.schema';
import { IAppointment } from './domain/appointment.interface';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { UpdateAppointmentDto } from '../dtos/update-appointment.dto';

@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<IAppointment> {
    const createdAppointment =
      await this.appointmentModel.create(createAppointmentDto);
    return this.toDomain(createdAppointment);
  }

  async findAll(): Promise<IAppointment[]> {
    const appointments = await this.appointmentModel.find().exec();
    return appointments.map((appointment) => this.toDomain(appointment));
  }

  async findConflicting(
    nutritionistId: string,
    newAppointStartDate: Date,
    newAppointEndDate: Date,
  ): Promise<IAppointment | null> {
    const conflict = await this.appointmentModel
      .findOne({
        nutritionistId,
        $or: [
          // O novo começa DENTRO de um existente
          { startDate: { $lt: newAppointEndDate, $gte: newAppointStartDate } },
          // O novo termina DENTRO de um existente
          { endDate: { $gt: newAppointStartDate, $lte: newAppointEndDate } },
          // O novo ENGLOBA totalmente um existente
          {
            startDate: { $lte: newAppointStartDate },
            endDate: { $gte: newAppointEndDate },
          },
        ],
      })
      .exec();

    return conflict ? this.toDomain(conflict) : null;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<IAppointment | null> {
    const appointmentUpdated = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .exec();

    return appointmentUpdated ? this.toDomain(appointmentUpdated) : null;
  }

  async findById(id: string): Promise<IAppointment | null> {
    const appointment = await this.appointmentModel.findById(id).exec();
    return appointment ? this.toDomain(appointment) : null;
  }

  async deleteAppointment(id: string): Promise<void> {
    const deletedAppointment = await this.appointmentModel
      .findByIdAndDelete(id)
      .exec();
  }

  private toDomain(doc: AppointmentDocument): IAppointment {
    return {
      id: doc._id.toString(),
      startDate: doc.startDate,
      endDate: doc.endDate,
      nutritionistId: doc.nutritionistId.toString(),
      patientName: doc.patientName,
      email: doc.email,
      phoneNumber: doc.phoneNumber,
      birthDate: doc.birthDate,
      bodyType: doc.bodyType,
      cpf: doc.cpf,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
