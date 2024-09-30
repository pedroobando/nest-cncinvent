import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './entities';
import { ProductType } from 'src/product-type/entities';
import { CreateProductInput, UpdateProductInput } from './dto/inputs';
import { User } from 'src/user/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
  ) {}

  async create(createProductInput: CreateProductInput, user: User): Promise<Product> {
    const { productType } = createProductInput;
    const pTypeFind = await this.productTypeRepository.findOneBy({ id: productType.id });
    if (!pTypeFind)
      throw new NotFoundException(`El tipo de producto con el id: ${productType.id} no fue encontrado`);

    try {
      const newProduct = this.productRepository.create({
        ...createProductInput,
        name: createProductInput.name.trim(),
        serial: createProductInput.serial.trim(),
        // productType:productType.id,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        isActive: true,
        lastUpdateBy: { id: user.id },
      });
      // return await this.departamentRepository.save(newDepto);
      await this.productRepository.save(newProduct);
      return await this.findOne(newProduct.id);
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Product[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.productRepository.createQueryBuilder();

    if (search)
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });

    queryBuilder.take(limit).skip(offset).orderBy('name', 'ASC');
    // .andWhere(`"userId" = :userId`, { userId: user.id });

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const theItem = await this.productRepository.findOneBy({
      id,
    });
    if (!theItem) throw new NotFoundException(`Producto con id: ${id} no fue encontrado`);
    return theItem;
  }

  async update(id: string, updateProductInput: UpdateProductInput, user: User): Promise<Product> {
    await this.findOne(id);
    try {
      const productUpd = await this.productRepository.preload({
        ...updateProductInput,
        name: updateProductInput.name.trim(),
        serial: updateProductInput.serial.trim(),
        updatedAt: new Date().getTime(),
        lastUpdateBy: user,
      });
      if (!productUpd) throw new NotFoundException(`Departament with id: ${id} not found`);
      return this.productRepository.save(productUpd);
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async remove(id: string): Promise<Product> {
    // Todo: Soft Delete, integridar referencial
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }

  private handleDBExeptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
