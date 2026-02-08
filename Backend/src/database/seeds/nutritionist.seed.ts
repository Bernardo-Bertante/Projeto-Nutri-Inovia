import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Nutritionist,
  NutritionistDocument,
} from '../../modules/schemas/nutritionist.schema';

@Injectable()
export class NutritionistSeed implements OnModuleInit {
  constructor(
    @InjectModel(Nutritionist.name)
    private readonly nutritionistModel: Model<NutritionistDocument>,
  ) {}

  async onModuleInit() {
    await this.seedNutritionist();
  }

  async seedNutritionist() {
    const count = await this.nutritionistModel.countDocuments();

    if (count > 0) {
      console.log('Já existem nutricionistas cadastrados no sistema!');
      return;
    }

    const nutritionists = [
      {
        name: 'Dra. Ana Silva',
        email: 'ana.silva@nutri.com',
        crn: 'CRN-12345',
      },
      {
        name: 'Dr. Carlos Souza',
        email: 'carlos.souza@nutri.com',
        crn: 'CRN-67890',
      },
    ];

    await this.nutritionistModel.insertMany(nutritionists);
    console.log('Nutricionistas cadastrados com sucesso!');
  }
}
