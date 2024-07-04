import { connectDB } from '../utils/connectDB';
import { Product } from '../models/productModel';
import axios from 'axios';

interface IProductResponse {
  id: number;
  title: string;
  brand?: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  stock: number;
}

export const dumpProducts = async () => {
  try {
    await connectDB();

    // Pagination
    const limit = 30;
    const skip = 0;

    const dummyjsonURL = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    console.log(dummyjsonURL);

    const response = await axios.get<{ products: IProductResponse[] }>(dummyjsonURL);

    const products = response.data.products;

    const productDocs = products.map((product) => {
      return {
        name: product.title,
        brand: product.brand,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.images,
        countInStock: product.stock,
      };
    });

    const dump = await Product.insertMany(productDocs);

    // console.log(productDocs);

    console.log('Products dumped successfully');
    return dump;
  } catch (error) {
    console.error('Error dumping products', error);
  }
};
