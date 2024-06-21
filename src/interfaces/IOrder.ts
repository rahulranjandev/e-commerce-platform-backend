import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
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
   * @description Check if user has ordered a product, paid and delivered
   * @Access User access
   */
  public async checkUserOrder(productId: string, userId: string): Promise<boolean> {
    const orderItems = await Order.aggregate([
      { $match: { user: userId, status: { $in: ['delivered'] }, isPaid: true, isDelivered: true } },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.product': productId } },
    ]);

    return orderItems.length > 0;
  }
}
