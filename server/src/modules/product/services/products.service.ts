import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto, ProductFilterDto } from '../dto/product.dto';
import { ProductModel } from '../model/product.model';
import { Product } from '../schema/product.schema';
import { Request } from 'express';
import { ApiMetaData } from 'utils/api-features';

@Injectable()
export class ProductsService {
  logger = new Logger('Products Service ✅');
  constructor(private readonly productModel: ProductModel) {}

  async createProduct(data: CreateProductDto): Promise<Product> {
    const createdProduct: Product = await this.productModel.create(data);
    return createdProduct;
  }

  async getAllProducts(
    filters: ProductFilterDto,
  ): Promise<{ products: Product[]; meta: ApiMetaData }> {
    
    const data: { products: Product[]; meta: ApiMetaData } =
      await this.productModel.findAll(filters);
    return data;
  }
}
