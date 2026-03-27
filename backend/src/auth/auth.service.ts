import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Check user status for farmers
    if (user.role === 'farmer') {
      if (user.status === 'banned') {
        throw new ForbiddenException({
          statusCode: 403,
          message: "Votre compte a ete suspendu. Contactez l'administrateur.",
          error: 'ACCOUNT_BANNED',
        });
      }
      if (user.status === 'pending') {
        throw new ForbiddenException({
          statusCode: 403,
          message:
            "Votre compte est en attente d'approbation par l'administrateur.",
          error: 'ACCOUNT_PENDING',
        });
      }
    }

    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      status: user.status,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...user,
        status: user.status,
      },
    };
  }

  async signup(signupDto: any) {
    const existing = await this.usersService.findOneByEmail(signupDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Default to farmer with pending status
    const user = await this.usersService.create({
      ...signupDto,
      role: 'farmer',
      status: 'pending',
    });

    // Return success but with pending status info
    return {
      message:
        "Inscription reussie. Votre compte est en attente d'approbation par l'administrateur.",
      status: 'pending',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        cin: user.cin,
        status: user.status,
      },
    };
  }
}
