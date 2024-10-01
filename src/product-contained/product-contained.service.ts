import { Injectable } from '@nestjs/common';
import { CreateProductContainedInput, UpdateProductContainedInput } from './dto/inputs';

@Injectable()
export class ProductContainedService {
  create(createProductContainedInput: CreateProductContainedInput) {
    return 'This action adds a new productContained';
  }

  findAll() {
    return `This action returns all productContained`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productContained`;
  }

  update(id: number, updateProductContainedInput: UpdateProductContainedInput) {
    return `This action updates a #${id} productContained`;
  }

  remove(id: number) {
    return `This action removes a #${id} productContained`;
  }
}
