import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartamentInput, UpdateDepartamentInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departament } from './entities';
import { User } from 'src/user/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class DepartamentService {
  private logger: Logger = new Logger('DepartamentService');

  constructor(
    @InjectRepository(Departament)
    private readonly departamentRepository: Repository<Departament>,
  ) {}

  async create(
    createDepartamentInput: CreateDepartamentInput,
    user: User,
  ): Promise<Departament> {
    try {
      const newDepto = this.departamentRepository.create({
        ...createDepartamentInput,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        isActive: true,
        lastUpdateBy: { id: user.id },
      });
      // return await this.departamentRepository.save(newDepto);
      await this.departamentRepository.save(newDepto);
      console.log(newDepto);
      return await this.findOne(newDepto.id);
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Departament[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.departamentRepository.createQueryBuilder();

    if (search)
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });

    queryBuilder.take(limit).skip(offset).orderBy('name', 'ASC');
    // .andWhere(`"userId" = :userId`, { userId: user.id });

    return await queryBuilder.getMany();

    //! La busqueda se complica en poco con el Like,
    //! ya que se desea buscar mayusculas y minisculas
    // return await this.itemRepository.find({
    //   take: limit,
    //   skip: offset,
    //   order: {
    //     name: {
    //       direction: 'ASC',
    //     },
    //   },
    //   where: {
    //     user: {
    //       id: user.id,
    //     },
    //     name: Like(`%${search.toLowerCase()}%`),
    //   },
    // });
  }

  async findOne(id: string): Promise<Departament> {
    const theItem = await this.departamentRepository.findOneBy({
      id,
    });
    if (!theItem) throw new NotFoundException(`Item with id: ${id} not found`);
    return theItem;
  }

  async update(
    id: string,
    updateDepartamentInput: UpdateDepartamentInput,
    user: User,
  ): Promise<Departament> {
    await this.findOne(id);
    const departament = await this.departamentRepository.preload({
      ...updateDepartamentInput,
      updatedAt: new Date().getTime(),
      lastUpdateBy: { id: user.id },
    });
    if (!departament)
      throw new NotFoundException(`Departament with id: ${id} not found`);
    return this.departamentRepository.save(departament);
  }

  async remove(id: string): Promise<Departament> {
    // Todo: Soft Delete, integridar referencial
    const departament = await this.findOne(id);
    return await this.departamentRepository.remove(departament);
  }

  async itemCountByUser(user: User): Promise<number> {
    return await this.departamentRepository.count({
      where: { lastUpdateBy: { id: user.id } },
    });
  }

  private handleDBExeptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
