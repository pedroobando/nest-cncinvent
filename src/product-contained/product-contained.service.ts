import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductContainedInput, UpdateProductContainedInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities';
import { Repository } from 'typeorm';
import { ProductContained } from './entities';
import { User } from 'src/user/entities';
import { PaginationArgs } from 'src/common/dto';

@Injectable()
export class ProductContainedService {
  private logger: Logger = new Logger('ProductContainedService');

  constructor(
    @InjectRepository(ProductContained)
    private readonly productContainedRepository: Repository<ProductContained>,
  ) {}

  async create(crtPrdContainedInput: CreateProductContainedInput, user: User): Promise<ProductContained> {
    const { containedId, productId, ...restContaned } = crtPrdContainedInput;
    if (productId === containedId)
      throw new BadRequestException(`El producto ${productId}, no puede asignarse asi mismo.`);

    try {
      const newProductContained = this.productContainedRepository.create({
        ...restContaned,
        product: { id: productId },
        contained: { id: containedId },
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        lastUpdateBy: user,
      });
      await this.productContainedRepository.save(newProductContained);
      return await this.findOne(newProductContained.id);
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async findAllByProduct(id: string, paginationArgs: PaginationArgs): Promise<ProductContained[]> {
    const { limit, offset } = paginationArgs;

    const queryBuilder = this.productContainedRepository
      .createQueryBuilder('productContaineds')
      .take(limit)
      .skip(offset)
      .innerJoin('productContaineds.product', 'product')
      .where(`"productId" = :productId`, { productId: id });

    // if (search) queryBuilder.andWhere('LOWER(item.name) like :name', { name: `%${search.toLowerCase()}%` });
    // queryBuilder.take(limit).skip(offset).andWhere(`"userId" = :userId`, { userId: user.id });

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ProductContained> {
    const theItem = await this.productContainedRepository.findOneBy({ id });
    if (!theItem) throw new NotFoundException(`Producto Contenido con id: ${id} no fue encontrado`);
    return theItem;
  }

  async update(
    id: string,
    updateProductCInput: UpdateProductContainedInput,
    updateBy: User,
  ): Promise<ProductContained> {
    const { productId, containedId, ...restUpdate } = updateProductCInput;
    // const productType = await this.findProductType(productTypeOne);
    try {
      const productContainedUpdate = await this.productContainedRepository.preload({
        ...restUpdate,
        product: { id: productId },
        contained: { id: containedId },
        updatedAt: new Date().getTime(),
        lastUpdateBy: { id: updateBy.id },
      });

      if (!productContainedUpdate) throw new NotFoundException(`ProductoContained  with id: ${id} not found`);
      // productContainedUpdate.updatedAt = new Date().getTime();
      // productContainedUpdate.lastUpdateBy = updateBy;

      return await this.productContainedRepository.save(productContainedUpdate);
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async remove(id: string): Promise<ProductContained> {
    const productContained = await this.findOne(id);
    return await this.productContainedRepository.remove(productContained);
  }

  // TODO: Pendiente buscar todos los producto en la tabla de productos
  // private async findProductType(id: string): Promise<ProductType> {
  //   const pTypeFind = await this.productTypeRepository.findOneBy({ id });
  //   if (!pTypeFind) throw new NotFoundException(`El tipo de producto con el id: ${id} no fue encontrado`);

  //   if (!pTypeFind.isActive)
  //     throw new BadRequestException(
  //       `El tipo de producto, ${pTypeFind.name} no esta activo para ser asignado.`,
  //     );

  //   return pTypeFind;
  // }

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
      throw new BadRequestException(
        `El producto ya esta registrado dentro de otro, por favor verifique.`,
        error.detail,
      );
    }
    // console.log(error);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
