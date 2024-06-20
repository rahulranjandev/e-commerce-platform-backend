import { FilterQuery, QueryOptions, UpdateQuery, Types } from 'mongoose';
import { IOrder, Order } from '@models/orderModel';

export class OrderService {
  /**
   * @description Get Orders By User - User access
   * @Access Middleware access - Protected
   */
  public async getOrdersByUser(userId: string): Promise<IOrder[]> {
    return await Order.find({ user: userId, status: { $ne: 'pending' } }).lean();
  }

  /**
   * @description Get Order Info
   * @Access Middleware access - Protected
   */
  public async getOrderById(id: string): Promise<IOrder | null> {
    return await Order.findById(id).lean();
  }

  /**
   * @description Get Order Info - Public Access
   * @Access User access
   */
  public async getOrderByQuery(query: FilterQuery<IOrder>): Promise<IOrder | null> {
    return await Order.findOne(query as FilterQuery<IOrder>);
  }

  /**
   * @description Create Order - User access only
   * @Access User access - Protected
   */
  public async createOrder(order: IOrder | any): Promise<IOrder> {
    return await Order.create(order);
  }

  /**
   * @description Update Order - User access only
   * @Access User access - Protected
   */
  public async updateOrder(id: string, order: IOrder | any): Promise<IOrder | null> {
    return await Order.findOneAndUpdate({ _id: id }, order, { upsert: false, new: true });
  }

  /**
   * @description Update Order - User access only
   * @Access User access - Protected
   */
  public async findAndUpdateOrder(query: FilterQuery<IOrder>, update: UpdateQuery<IOrder>, options: QueryOptions) {
    return await Order.findOneAndUpdate(query, update, options);
  }

  /**
   * @description Cancel Order - User access only
   * @Access User access - Protected
   */
  public async cancelOrder(id: string, userId: string, order: IOrder | any): Promise<IOrder | null> {
    return await Order.findOneAndUpdate({ _id: id, user: userId }, order, { upsert: true });
  }

  /**
   * @description Check if user has ordered a product before reviewing
   * @Access User access
   */
  public async checkUserOrder(productId: Types.ObjectId | string | any, userId: Types.ObjectId): Promise<boolean> {
    const OrderItem = await Order.aggregate([
      { $match: { user: userId } },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.product': productId } },
    ]);

    return OrderItem.length > 0;
  }
}
