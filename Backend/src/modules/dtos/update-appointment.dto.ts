import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumberString,
  IsEmail,
  IsMobilePhone,
  Matches,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BodyType } from '../schemas/appointment.schema';

export class UpdateAppointmentDto {
  @ApiProperty({
    example: '2026-01-29T14:00:00.000Z',
    description: 'Data e horário de início da consulta (ISO 8601)',
  })
  @IsDateString({}, { message: 'É necessário a seleção de uma data válida.' })
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2026-01-29T15:00:00.000Z',
    description: 'Data e horário de término da consulta (ISO 8601)',
  })
  @IsDateString({}, { message: 'É necessário a seleção de uma data válida.' })
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
  @IsString({ message: 'Nome do paciente deve conter apenas letras' })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
    message: 'Nome do paciente deve conter apenas letras',
  })
  patientName: string;

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'E-mail do paciente para contato',
  })
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+5511999999999',
    description: 'Telefone celular do paciente no padrão brasileiro (+55)',
  })
  @IsMobilePhone('pt-BR', {}, { message: 'Telefone inválido.' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: '1995-06-20',
    description: 'Data de nascimento do paciente (YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'É necessário a seleção de uma data válida.' })
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
  @IsNumberString({}, { message: 'CPF deve ser somente composto por números.' })
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    example: 'Sim/Não',
    description: 'Booleano que diz se a consulta será recorrente ou não.',
  })
  @IsNumber()
  @IsOptional()
  isRecurrent?: boolean;

  @ApiProperty({
    example: 'de 5 em 5 dias.',
    description: 'A cada X dias',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  recurrenceInterval?: number;

  @ApiProperty({
    example: 'por 20 dias.',
    description: 'Repetir X vezes.',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  recurrenceCount?: number;
}
