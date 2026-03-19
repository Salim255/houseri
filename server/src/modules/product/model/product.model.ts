import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model, Types } from 'mongoose';
import { CreateProductDto, ProductFilterDto } from '../dto/product.dto';
import { APIFeatures, ApiMetaData } from '../../../../utils/api-features';

@Injectable()
export class ProductModel {
  logger = new Logger('Product Model');
  constructor(
    // @InjectModel(...)	NestJS decorator to inject a Mongoose model
    // Product.name	Equivalent to 'Product', the name of the model (from the class name)
    // Model<Product>	Mongoose model type for strong typing in TypeScript
    // private readonly productModel	Class property to hold the injected model
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(data).save();
    return createdProduct;
  }

  async findAll(
    filters: ProductFilterDto,
  ): Promise<{ products: Product[]; meta: ApiMetaData }> {
    try {
      //  EXECUTE THE QUERY
      const features = new APIFeatures(this.productModel.find(), filters)
        .filter()
        .sort()
        .featuredProduct()
        .search()
        .paginate();

      const products: Product[] = await features.query.exec();
      // const products = await query.exec(); // Filtering using  Mongoose methods
      //  find() retrieves all documents in the collection.
      //  exec() turns it into a real Promise (recommended for consistency).

      // Build API meta
      const meta = await features.buildApiMeta();
      // SEND RESPONSE
      return { products, meta };
    } catch (error) {

      // generic message—don't leak which part failed
      if (error instanceof Error) {
        // Re-throw known errors without modification
        throw error;
      }

      // Handle unexpected/internal errors with a generic response
      throw new InternalServerErrorException(
        'Something went wrong while fetching products.',
      );
    }
  }

  async findManyByIds(ids: Types.ObjectId[]): Promise<Product[]> {
    const products: Product[] = await this.productModel.find({
      _id: { $in: ids },
    });
    return products;
  }

  async findById() {}

  async delete() {}

  async update() {}
}
