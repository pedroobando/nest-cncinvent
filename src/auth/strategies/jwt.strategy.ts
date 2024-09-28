import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayLoad): Promise<User> {
    const { sub } = payload;
    const user = await this.authService.validateUser(sub);
    // console.log({ user });
    return user;

    // throw new UnauthorizedException('Token no valido :(');
    // return { id: payload.sub, email: payload.username };
  }
}
