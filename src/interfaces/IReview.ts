import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IReview, Review } from '@models/reviewModel';

export class ReviewService {
  /**
   * @description Get Reviews by Product
   * @Access Public access
   */
  public async getReviewsByProduct(productId: string): Promise<IReview[]> {
    return await Review.find({ product: productId }).lean();
  }
  /**
   * @description Get Review Info
   * @Access Middleware access - Protected
   */
  public async getReviewById(id: string): Promise<IReview | null> {
    return await Review.findById(id).lean();
  }

  /**
   * @description Get Review Info - Public Access
   * @Access User access
   */
  public async getReviewByQuery(query: FilterQuery<IReview>): Promise<IReview | null> {
    return await Review.findOne(query as FilterQuery<IReview>);
  }

  /**
   * @description Create Review - User access only
   * @Access User access - Protected
   */
  public async createReview(review: IReview | any): Promise<IReview> {
    return await Review.create(review);
  }

  /**
   * @description Update Review - User access only
   * @Access User access - Protected
   */
  public async updateReview(id: string, review: IReview | any): Promise<IReview | null> {
    return await Review.findOneAndUpdate({ _id: id }, review, { upsert: false });
  }

  /**
   * @description Update Review - User access only
   * @Access User access - Protected
   */
  public async findAndUpdateReview(query: FilterQuery<IReview>, update: UpdateQuery<IReview>, options: QueryOptions) {
    return await Review.findOneAndUpdate(query, update, options);
  }

  /**
   * @description Delete Review - User access only
   * @Access User access - Protected
   */
  public async deleteReview(id: string): Promise<IReview | null> {
    return await Review.findByIdAndDelete(id);
  }

  /**
   * @description Get average rating of a product
   * @Access Public access
   */
  public async getAverageRating(productId: string | any): Promise<number> {
    const avgRating = await Review.aggregate([
      { $match: { product: productId } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' } } },
    ]);

    return avgRating[0].avgRating;
  }

  /**
   * @description Check if user has already reviewed a product
   * @Access User access
   */
  public async getReviewByUser(productId: string, userId: string): Promise<IReview | null> {
    return await Review.findOne({ product: productId, user: userId });
  }
}
