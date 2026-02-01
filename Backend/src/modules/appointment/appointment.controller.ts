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
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { AppointmentResponseDto } from './dtos/appointment-response.dto';
import { AppointmentMapper } from './mapper/appointment-mapper';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentMapper: AppointmentMapper,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo agendamento' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiCreatedResponse({
    description: 'Agendamento criado com sucesso.',
    type: AppointmentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Erro de validação ou conflito de horário.',
  })
  async create(
    @Body() appointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const result = await this.appointmentService.create(appointmentDto);
    return this.appointmentMapper.toResponseDto(result);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os agendamentos' })
  @ApiOkResponse({
    description: 'Lista de Agendamento',
    type: [AppointmentResponseDto],
  })
  async findAll(): Promise<AppointmentResponseDto[]> {
    const result = await this.appointmentService.findAll();
    return result.map((a) => this.appointmentMapper.toResponseDto(a));
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
    type: AppointmentResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Consulta não encontrada.',
  })
  async update(
    @Param('id') id: string,
    @Body() appointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const result = await this.appointmentService.update(id, appointmentDto);
    return this.appointmentMapper.toResponseDto(result);
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
