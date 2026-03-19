import { Document, ObjectId, Query } from 'mongoose';
import { ProductFilterDto } from '../src/modules/product/dto/product.dto';

interface CategoryCompany {
  _id: ObjectId;
  company: string;
  category: string;
}

export interface ApiMetaData {
  pagination: {
    productsByPage: number;
    pageCount: number;
    total: number;
    currentPage: number;
  };
  categories: string[];
  companies: string[];
}

export class APIFeatures<T extends Document> {
  query: Query<T[], T>;
  queryString: ProductFilterDto;
  constructor(query: Query<T[], T>, queryString: ProductFilterDto) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //  BUILD THE QUERY
    // api/v1/products?price[gte]=150
    const queryObject: ProductFilterDto = {};
    if (typeof this.queryString.price === 'string') {
      queryObject.price = this.queryString.price;
    } else if (typeof this.queryString['price[gte]'] === 'string') {
      queryObject.price = {};
      queryObject.price.$gte = this.queryString['price[gte]'];
    
    } else if (typeof this.queryString['price[gt]'] === 'string') {
      queryObject.price = {};
      queryObject.price.$gt = this.queryString['price[gt]'];
    } else if (typeof this.queryString['price[lte]'] === 'string') {
      queryObject.price = {};
      queryObject.price.$lte = this.queryString['price[lte]'];
    } else if (typeof this.queryString['price[lt]'] === 'string') {
      queryObject.price = {};
      queryObject.price.$lt = this.queryString['price[lt]'];
    }

    const category = this.queryString.category?.trim();
    const company = this.queryString.company?.trim();
    if (category?.length && category !== 'all') {
      queryObject.category = category;
    }

    if (company?.length && company !== 'all') {
      queryObject.company = company;
    }

    if (this.queryString.shipping === 'true') {
      queryObject.shipping = this.queryString.shipping;
    }
    // Filter first without await, so latter we can add sorting and pagination
    this.query = this.query.find(queryObject);
    return this;
  }

  featuredProduct() {
    const queryObject: ProductFilterDto = {};
    // FEATURED Products
    if (this.queryString.featured?.trim().length) {
      queryObject.featured = this.queryString.featured;
    }
    this.query.find(queryObject);
    return this;
  }

  search() {
    // SEARCH PRODUCT
    const searchQuery: { $text?: { $search: string } } = {};
    const keyWord = this.queryString.search?.trim();
    if (keyWord) {
      searchQuery.$text = { $search: keyWord };
    }
    this.query.find(searchQuery);
    return this;
  }

  sort() {
    // api/v1/products?sort=-price
    // api/v1/products?sort=price
    // api/v1/products?sort=price,rating
    // api/v1/products?alphaSort='a-z'
    if (this.queryString.alphaSort?.trim().length) {
      this.query.sort({
        name: this.queryString.alphaSort.trim() === 'a-z' ? 1 : -1,
      });
    }
    if (this.queryString.sort) {
      const sortString = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortString);
    } else {
      // To get the last one been created
      this.query.sort('-createdAt'); // or this.query.sort('createdAt')
    }
    //const sortResult = this.
    return this;
  }

  paginate() {
    // Pagination
    // {{URL}}api/v1/products?page=2&limit=4
    // This means 4 result by page, and skip means skip the the first page, then give me pages from second page every page has 4 result
    // 1- 4 for page1, and 4-8 are for page 2, and 8 -12 are for page 3
    const page = this.queryString.page * 1 || 1;

    // Product per page
    const limit = this.queryString.limit * 1 || 4;
   
    // So this number here is all the results come before the request that we are requesting now
    const skip = (page - 1) * limit; // page -1 means the previous page

    this.query.skip(skip).limit(limit);
    return this;
  }

  async buildApiMeta(): Promise<ApiMetaData> {
    // Current page number
    const currentPage = this.queryString.page * 1;

    // N or 4 products per page
    const productsByPage = this.queryString.limit * 1 || 4;

    // The total products in the DB
    const total = await this.query.model.find().clone().countDocuments();
    const total2 = await this.query.clone().countDocuments();
  
    // All possible pages
    const pageCount = Math.ceil(total / productsByPage);

    // Get all categories and companies from the full database (not filtered)
    const rawAllProducts = await this.query.model.find<CategoryCompany>(
      {},
      'category company',
    ); //Use lean() for plain objects.

    const categoriesSet = new Set(rawAllProducts.map((p) => p.category));
    const companiesSet = new Set(rawAllProducts.map((p) => p.company));

    const categories = ['all', ...Array.from(categoriesSet)];
    const companies = ['all', ...Array.from(companiesSet)];

    return {
      pagination: { productsByPage, pageCount, total, currentPage },
      categories,
      companies,
    };
  }
}
