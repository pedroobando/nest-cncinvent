import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProyectInput, UpdateProyectInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyect } from './entities';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class ProyectService {
  private logger: Logger = new Logger('ProyectService');

  constructor(
    @InjectRepository(Proyect)
    private readonly proyectRepository: Repository<Proyect>,
  ) {}

  async create(createProyectInput: CreateProyectInput, user: User): Promise<Proyect> {
    try {
      const newDepto = this.proyectRepository.create({
        ...createProyectInput,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        isActive: true,
        lastUpdateBy: user,
      });
      // return await this.departamentRepository.save(newDepto);
      return await this.proyectRepository.save(newDepto);
      // return await this.findOne(newDepto.id);
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Proyect[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.proyectRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .orderBy('name', 'ASC');

    if (search)
      queryBuilder.where('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Proyect> {
    const theItem = await this.proyectRepository.findOneBy({
      id,
    });
    if (!theItem) throw new NotFoundException(`Proyecto con el id: ${id} no fue encontrado`);
    return theItem;
  }

  async update(id: string, updateProyectInput: UpdateProyectInput, user: User): Promise<Proyect> {
    await this.findOne(id);
    const proyect = await this.proyectRepository.preload({
      ...updateProyectInput,
      updatedAt: new Date().getTime(),
      lastUpdateBy: user,
    });
    if (!proyect) throw new NotFoundException(`El Proyecto con el Id: ${id} no fue encontrado`);
    return await this.proyectRepository.save(proyect);
  }

  async remove(id: string): Promise<Proyect> {
    // Todo: Soft Delete, integridar referencial
    const proyect = await this.findOne(id);
    return await this.proyectRepository.remove(proyect);
  }

  private handleDBExeptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
