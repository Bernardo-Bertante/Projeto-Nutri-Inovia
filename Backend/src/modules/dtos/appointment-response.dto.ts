import { ApiProperty } from '@nestjs/swagger';
import { BodyType } from '../schemas/appointment.schema';

export class AppointmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  nutritionistId: string;

  @ApiProperty()
  patientName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty({ enum: BodyType })
  bodyType: BodyType;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
