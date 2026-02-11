import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Nutritionist,
  NutritionistDocument,
} from '../../modules/schemas/nutritionist.schema';
import * as bcrypt from 'bcrypt';

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

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('123456', salt);

    const nutritionists = [
      {
        name: 'Dra. Ana Silva',
        email: 'ana.silva@nutri.com',
        crn: 'CRN-12345',
        password: passwordHash,
      },
      {
        name: 'Dr. Carlos Souza',
        email: 'carlos.souza@nutri.com',
        crn: 'CRN-67890',
        password: passwordHash, //mesma senha para facilitar
      },
    ];

    await this.nutritionistModel.insertMany(nutritionists);
    console.log('Nutricionistas cadastrados com sucesso!');
  }
}
