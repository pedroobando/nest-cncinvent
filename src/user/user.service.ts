import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs';

import { ValidRoles } from 'src/auth/enums';
import { ResetPassInput, UpdateUserInput } from './dto/inputs';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        email: signupInput.email.toLowerCase().trim(),
        fullName: signupInput.fullName.trim(),
        password: this.bcryptPass(signupInput.password),
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(
    roles: ValidRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    try {
      if (roles.length === 0)
        return await this.userRepository.find({
          // TODO: No es necesario porque tenemos lazy en la propiedad de lastUpdateBy ("user.entity.ts")
          //   relations: {
          //     lastUpdateBy: true,
          //   },
        });

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .where('ARRAY[roles] && ARRAY[:...roles]')
        .take(limit)
        .skip(offset)
        .setParameter('roles', roles);

      if (search)
        queryBuilder.andWhere('LOWER(user.fullName) like :fullName', {
          fullName: `%${search.toLowerCase()}%`,
        });
      return await queryBuilder.getMany();
    } catch (error) {
      this.handleDBExceptions({ code: 'error-02', detail: ` not found` });
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBExceptions({
        code: 'error-01',
        detail: `User email: ${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBExceptions({
        code: 'error-01',
        detail: `User id: ${id} not found`,
      });
    }
  }

  async update(
    updateUserInput: UpdateUserInput,
    updatedBy: User,
  ): Promise<User> {
    try {
      let user = await this.userRepository.preload({ ...updateUserInput });

      if (!user)
        throw new NotFoundException(
          `User with id: ${updateUserInput.id} not found`,
        );
      user.email = user.email.toLowerCase().trim();
      user.fullName = user.fullName.trim();
      user.lastUpdateBy = updatedBy;

      return this.userRepository.save(user);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const usertoBlock: User = await this.findOneById(id);
    usertoBlock.isActive = false;
    usertoBlock.lastUpdateBy = adminUser;
    return this.userRepository.save(usertoBlock);
  }

  async resetPassWord(
    { id, password }: ResetPassInput,
    user: User,
  ): Promise<User> {
    const resetUser = await this.findOneById(id);
    resetUser.isActive = true;
    resetUser.password = this.bcryptPass(password);
    resetUser.lastUpdateBy = user;
    return this.userRepository.save(resetUser);
  }

  private bcryptPass(password: string): string {
    return bcrypt.hashSync(password.trim(), 10);
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(
        `Error ${error.detail.replace('Key ', '')}`,
      );
    }
    if (error.code === 'error-01') {
      throw new NotFoundException(`${error.detail}`);
    }

    console.log(error);
    this.logger.error(error);
    throw new InternalServerErrorException({ error });
  }
}
