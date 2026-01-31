import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const createdAppointment = new this.appointmentModel(createAppointmentDto);
    return createdAppointment.save();
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel.find().exec();
  }

  async findConflicting(
    nutritionistId: string,
    newAppointStartDate: Date,
    newAppointEndDate: Date,
  ): Promise<Appointment | null> {
    return this.appointmentModel
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
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment | null> {
    return this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .exec();
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.appointmentModel.findById(id).exec();
  }

  async deleteAppointment(id: string) {
    return this.appointmentModel.findByIdAndDelete(id).exec();
  }
}
