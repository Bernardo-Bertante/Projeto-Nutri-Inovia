import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { Appointment } from './schemas/appointment.schema';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

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
  create(@Body() appointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentService.create(appointmentDto);
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

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar consulta por meio do ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID referente à consulta que será atualizada',
  })
  @ApiOkResponse({
    description: 'Consulta atualizada com sucesso',
    type: Appointment,
  })
  @ApiNotFoundResponse({
    description: 'Consulta não encontrada.',
  })
  update(
    @Param('id') id: string,
    @Body() appointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.update(id, appointmentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir uma consulta por meio do ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID referente à consulta que será excluida',
  })
  @ApiNoContentResponse({
    description: 'Consulta excluida com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Consulta não encontrada.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.appointmentService.delete(id);
  }
}
