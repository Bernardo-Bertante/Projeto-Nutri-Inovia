import { BadRequestException } from '@nestjs/common';
import { isWeekend } from 'src/modules/util/util-date';

export function validateAppointmentDate(
  startDate: Date,
  endDate: Date,
  birthDate: Date,
) {
  const startPeriod = new Date(startDate);
  const endPeriod = new Date(endDate);
  const now = new Date();
  const startMinutes =
    startPeriod.getUTCHours() * 60 + startPeriod.getUTCMinutes();
  const endMinutes = endPeriod.getUTCHours() * 60 + endPeriod.getUTCMinutes();
  const open = 8 * 60;
  const close = 18 * 60;
  const bornDate = new Date(birthDate);

  if (bornDate > now) {
    throw new BadRequestException('Selecione uma data de nascimento válida.');
  }

  if (startPeriod < now) {
    throw new BadRequestException(
      'Não é possível agendar consultas no passado.',
    );
  }

  if (isWeekend(startPeriod)) {
    throw new BadRequestException(
      'Não é permitido agendar consultas aos fins de semana.',
    );
  }

  if (startMinutes < open || endMinutes > close) {
    throw new BadRequestException(
      'Agendamentos só são permitidos no horário de funcionamento da clínica (08:00 - 18:00).',
    );
  }
}
