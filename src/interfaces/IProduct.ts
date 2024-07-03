import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IProduct, Product } from '@models/productModel';

export class ProductService {
  /**
   * @description Get Products without description
   * @feature Get Single Image URL for each product
   * @Access Public access
   */
  public async getProductsWithoutDescription(): Promise<IProduct[]> {
    return await Product.find().select('-description').select('-embeddings').lean();
  }

  /**
   * @description Get All Products
   * @Access Public access
   */
  public async getAllProducts(): Promise<IProduct[]> {
    return await Product.find().lean();
  }

  /**
   * @description Get Products By Category
   * @Access Public access
   */
  public async getProductByCategory(category: string): Promise<IProduct[]> {
    return await Product.find({ category }).select('-description').select('-embeddings').lean();
  }

  /**
   * @description Get Product Info
   * @Access Public access - User access
   */
  public async getProductById(id: string | any): Promise<IProduct | null> {
    return await Product.findById(id).lean();
  }

  /**
   * @description Get Product Info - Public Access
   * @feature Filter the product by query
   * @Access Public access
   */
  public async getProductByQuery(query: FilterQuery<IProduct>): Promise<IProduct | null> {
    return await Product.find(query).select('-description').select('-embeddings').lean();
  }

  /**
   * @description Create Product - Admin access only
   * @Access Admin access - Protected
   */
  public async createProduct(product: IProduct | any): Promise<IProduct> {
    return await Product.create(product);
  }

  /**
   * @description Update Product - Admin access only
   * @Access Admin access - Protected
   */
  public async updateProduct(id: string, product: IProduct | any): Promise<IProduct | null> {
    return await Product.findOneAndUpdate({ _id: id }, product, { upsert: false, new: true });
  }

  /**
   * @description Update Product - Admin access only
   * @Access Admin access - Protected
   */
  public async findAndUpdateProduct(
    query: FilterQuery<IProduct>,
    update: UpdateQuery<IProduct>,
    options: QueryOptions
  ) {
    return await Product.findOneAndUpdate(query, update, options);
  }

  /**
   * @description Delete Product - Admin access only
   * @Access Admin access - Protected
   */
  public async deleteProduct(id: string): Promise<IProduct | null> {
    return await Product.findByIdAndDelete(id);
  }
}
