import { Controller, Get } from '@nestjs/common';
import { NutritionistService } from './nutritionist.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NutritionistResponseDto } from '../dtos/nutritionist-response.dto';
import { NutritionistMapper } from '../mapper/nutritionist-mapper';

@ApiTags('Nutricionistas')
@Controller('nutritionists')
export class NutritionistController {
  constructor(
    private readonly nutritionistService: NutritionistService,
    private readonly nutritionistMapper: NutritionistMapper,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os nutricionistas' })
  @ApiOkResponse({
    description: 'Lista de Nutricionistas',
    type: [NutritionistResponseDto],
  })
  async findAll(): Promise<NutritionistResponseDto[] | null> {
    const result = await this.nutritionistService.findAll();
    return result.map((a) => this.nutritionistMapper.toResponseDto(a));
  }
}
