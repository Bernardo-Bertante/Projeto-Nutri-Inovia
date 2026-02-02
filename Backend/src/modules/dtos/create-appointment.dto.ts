import { IsDateString, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BodyType } from '../schemas/appointment.schema';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2026-01-29T14:00:00.000Z',
    description: 'Data e horário de início da consulta (ISO 8601)',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2026-01-29T15:00:00.000Z',
    description: 'Data e horário de término da consulta (ISO 8601)',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    example: '65b8...',
    description: 'ID do nutricionista responsável pela consulta',
  })
  @IsString()
  @IsNotEmpty()
  nutritionistId: string;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do paciente',
  })
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'E-mail do paciente para contato',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+5511999999999',
    description: 'Telefone celular do paciente no padrão brasileiro (+55)',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: '1995-06-20',
    description: 'Data de nascimento do paciente (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    example: BodyType.ECTOMORPH,
    enum: BodyType,
    description:
      'Biotipo corporal do paciente (Ectomorfo, Mesomorfo, Endomorfo)',
  })
  @IsEnum(BodyType)
  @IsNotEmpty()
  bodyType: BodyType;

  @ApiProperty({
    example: '12345678901',
    description: 'CPF do paciente (somente números)',
  })
  @IsString()
  @IsNotEmpty()
  cpf: string;
}
