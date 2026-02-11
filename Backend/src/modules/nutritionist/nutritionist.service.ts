import { Injectable } from '@nestjs/common';
import { NutritionistRepository } from './nutritionist.repository';
import { INutritionist } from './domain/nutritionist.interface';

@Injectable()
export class NutritionistService {
  constructor(
    private readonly nutritionistRepository: NutritionistRepository,
  ) {}

  async findAll(): Promise<INutritionist[] | null> {
    return await this.nutritionistRepository.findAll();
  }
}
