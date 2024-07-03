import { User } from '../models/userModel';
import { Product } from '../models/productModel';
import { Review } from '../models/reviewModel';
import { Order } from '../models/orderModel';

import { connectDB } from '../utils/connectDB';

export const deleteDump = async () => {
  try {
    await connectDB();

    // await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});

    console.log('Data deleted successfully');
  } catch (error) {
    console.error('Error deleting data', error);
  }
};
