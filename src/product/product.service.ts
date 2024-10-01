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
    const { productTypeOne, ...productRest } = createProductInput;
    const productType = await this.findProductType(productTypeOne);
    try {
      const newProduct = this.productRepository.create({
        ...productRest,
        productTypeOne: { id: productType.id },

        name: createProductInput.name.trim(),
        serial: createProductInput.serial.trim(),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        isActive: true,
        lastUpdateBy: user,
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

  async update(id: string, updateProductInput: UpdateProductInput, updateBy: User): Promise<Product> {
    const { productTypeOne, ...restUpdate } = updateProductInput;
    const productType = await this.findProductType(productTypeOne);
    try {
      const productUpd = await this.productRepository.preload({
        ...restUpdate,
      });

      if (!productUpd) throw new NotFoundException(`Producto with id: ${id} not found`);

      productUpd.name = productUpd.name.trim();
      productUpd.serial = productUpd.serial.trim();
      productUpd.updatedAt = new Date().getTime();
      productUpd.lastUpdateBy = updateBy;
      productUpd.productTypeOne = productType;

      return await this.productRepository.save(productUpd);
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async remove(id: string): Promise<Product> {
    // Todo: Soft Delete, integridar referencial
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }

  private async findProductType(id: string): Promise<ProductType> {
    const pTypeFind = await this.productTypeRepository.findOneBy({ id });
    if (!pTypeFind) throw new NotFoundException(`El tipo de producto con el id: ${id} no fue encontrado`);

    if (!pTypeFind.isActive)
      throw new BadRequestException(
        `El tipo de producto, ${pTypeFind.name} no esta activo para ser asignado.`,
      );

    return pTypeFind;
  }
  // async productInCount(product: Product): Promise<number> {
  //   return await this.productRepository.count({ where: { containedIn: product.id } });
  // }

  // async fatherProduct(product: Product): Promise<Product> {
  //   return await this.productRepository.findOneBy({ id: product.containedIn });
  // }

  // async childrenProducts(product: Product): Promise<Product[]> {
  //   const todos = await this.productRepository.findBy({ containedIn: product.id });
  //   // const pasando = todos.map((item) => (item.id ? item : null));
  //   // console.log(pasando);
  //   return todos.length >= 1 ? todos : null;
  // }

  private handleDBExeptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
