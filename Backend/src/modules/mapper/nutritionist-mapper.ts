import { Injectable } from '@nestjs/common';
import { INutritionist } from '../nutritionist/domain/nutritionist.interface';
import { NutritionistResponseDto } from '../dtos/nutritionist-response.dto';

@Injectable()
export class NutritionistMapper {
  toResponseDto(a: INutritionist): NutritionistResponseDto {
    return {
      id: a.id!,
      name: a.name,
      email: a.email,
      crn: a.crn,
      createdAt: a.createdAt!,
      updatedAt: a.updatedAt!,
    };
  }
}
