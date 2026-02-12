import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsEmail,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BodyType } from '../schemas/appointment.schema';

export class UpdateAppointmentDto {
  @ApiProperty({
    example: '2026-01-29T14:00:00.000Z',
    description: 'Data e horário de início da consulta (ISO 8601)',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
    message: 'Data deve estar no formato ISO 8601 com ano de 4 dígitos.',
  })
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2026-01-29T15:00:00.000Z',
    description: 'Data e horário de término da consulta (ISO 8601)',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
    message: 'Data deve estar no formato ISO 8601 com ano de 4 dígitos.',
  })
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
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
    message: 'Nome do paciente deve conter apenas letras',
  })
  @IsNotEmpty()
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
    description: 'Telefone celular no formato +55 seguido de 11 dígitos',
  })
  @Matches(/^\+55\d{11}$/, {
    message:
      'Telefone deve estar no formato +55 seguido de 11 dígitos (DDD + número).',
  })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: '1995-06-20',
    description: 'Data de nascimento do paciente (YYYY-MM-DD)',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD com ano de 4 dígitos.',
  })
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
    description: 'CPF do paciente (11 dígitos, somente números)',
  })
  @Matches(/^\d{11}$/, {
    message: 'CPF deve conter exatamente 11 dígitos numéricos.',
  })
  @IsNotEmpty()
  cpf: string;
}
