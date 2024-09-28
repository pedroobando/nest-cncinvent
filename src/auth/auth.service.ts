import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LoginInput, SignupInput } from './dto/inputs';
import { AuthResponse } from './types';

import { UserService } from 'src/user';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(id: string) {
    return this.jwtService.sign({ sub: id });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    // console.log({ signupInput });

    const user = await this.usersService.create(signupInput);

    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(`Email / Password do not match`);
    }

    await this.validateUser(user.id);

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive)
      throw new UnauthorizedException(
        `User is inactive, talk with an administrator.`,
      );
    delete user.password;

    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }
}
