import { Schema, model } from 'mongoose';

interface IReview {
  _id?: string;
  name: string;
  rating: number;
  comment?: string;
  user: string;
  product: string;
  createdAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    name: {
      type: String,
      default: 'Anonymous, Certified Buyer',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 0,
      max: 5,
      default: 0,
    },
    comment: {
      type: String,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    product: {
      type: String,
      ref: 'Product',
      required: true,
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

const Review = model('Review', reviewSchema);

export { Review, IReview };
