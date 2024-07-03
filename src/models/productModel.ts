import { Schema, model } from 'mongoose';

interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string[];
  brand?: string;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  image: string[];
  createdAt?: Date;
  embeddings?: number[];
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0,
    },
    category: {
      type: [String],
      required: [true, 'Category is required'],
    },
    brand: {
      type: String,
    },
    countInStock: {
      type: Number,
      required: [true, 'Stock is required'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: [String],
      required: [true, 'Image is required'],
    },
    embeddings: {
      type: [Number],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

const Product = model('Product', productSchema);

export { Product, IProduct };
