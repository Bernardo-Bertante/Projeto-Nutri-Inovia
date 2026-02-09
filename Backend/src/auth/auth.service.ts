import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INutritionist } from 'src/modules/nutritionist/domain/nutritionist.interface';
import {
  Nutritionist,
  NutritionistDocument,
} from 'src/modules/schemas/nutritionist.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Nutritionist.name)
    private readonly nutritionistModel: Model<NutritionistDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<INutritionist> {
    const user = await this.nutritionistModel.findOne({ email });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (user && isMatch) {
      const { password, ...result } = user.toObject();
      return result;
    }

    return null;
  }

  async login(user: INutritionist) {
    const payload = { email: user.email, nome: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
