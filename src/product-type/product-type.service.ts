import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductTypeInput, UpdateProductTypeInput } from './dto/inputs';
import { ProductType } from './entities';
import { User } from 'src/user/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class ProductTypeService {
  private logger: Logger = new Logger('ProductTypeService');

  constructor(
    @InjectRepository(ProductType)
    private readonly poductTypeRepository: Repository<ProductType>,
  ) {}

  async create(createProductTypeInput: CreateProductTypeInput, user: User): Promise<ProductType> {
    try {
      const newPType = this.poductTypeRepository.create({
        ...createProductTypeInput,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        isActive: true,
        lastUpdateBy: user,
      });
      // return await this.departamentRepository.save(newDepto);
      return await this.poductTypeRepository.save(newPType);
      // return await this.findOne(newDepto.id);
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ProductType[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.poductTypeRepository
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

  async findOne(id: string): Promise<ProductType> {
    const fProdType = await this.poductTypeRepository.findOneBy({
      id,
    });
    if (!fProdType) throw new NotFoundException(`Tipo de producto con este id: ${id} no fue encontrado`);
    return fProdType;
  }

  async update(id: string, updateProductTypeInput: UpdateProductTypeInput, user: User): Promise<ProductType> {
    await this.findOne(id);
    const prodType = await this.poductTypeRepository.preload({
      ...updateProductTypeInput,
      updatedAt: new Date().getTime(),
      lastUpdateBy: user,
    });
    return this.poductTypeRepository.save(prodType);
  }

  async remove(id: string): Promise<ProductType> {
    // Todo: Soft Delete, integridar referencial
    const prodType = await this.findOne(id);
    return await this.poductTypeRepository.remove(prodType);
  }

  private handleDBExeptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
