import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // Look up the user from DB on every request to check current status
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Only check status restrictions for farmers, not admins
    if (user.role === 'farmer') {
      if (user.status === 'banned') {
        throw new ForbiddenException({
          statusCode: 403,
          message: "Votre compte a été suspendu. Contactez l'administrateur.",
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

    return {
      _id: payload.sub,
      email: payload.email,
      role: user.role,
      status: user.status,
    };
  }
}
