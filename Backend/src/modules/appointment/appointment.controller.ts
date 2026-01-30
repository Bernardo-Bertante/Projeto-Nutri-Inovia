import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Appointment } from './schemas/appointment.schema';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo agendamento' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiCreatedResponse({
    description: 'Agendamento criado com sucesso.',
    type: Appointment,
  })
  @ApiBadRequestResponse({
    description: 'Erro de validação ou conflito de horário.',
  })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os agendamentos' })
  @ApiOkResponse({
    description: 'Lista de Agendamento',
    type: [Appointment],
  })
  findAll(): Promise<Appointment[]> {
    return this.appointmentService.findAll();
  }
}
