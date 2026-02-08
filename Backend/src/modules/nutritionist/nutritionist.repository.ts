import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Nutritionist,
  NutritionistDocument,
} from '../schemas/nutritionist.schema';
import { Model } from 'mongoose';
import { INutritionist } from './domain/nutritionist.interface';

@Injectable()
export class NutritionistRepository {
  constructor(
    @InjectModel(Nutritionist.name)
    private nutritionistModel: Model<NutritionistDocument>,
  ) {}

  async findAll(): Promise<INutritionist[] | null> {
    const resultList = await this.nutritionistModel.find().exec();
    return resultList.map((a) => this.toDomain(a));
  }

  async findById(id: string): Promise<INutritionist | null> {
    const result = await this.nutritionistModel.findById(id).exec();
    return this.toDomain(result);
  }

  private toDomain(doc: NutritionistDocument): INutritionist {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      crn: doc.crn,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
