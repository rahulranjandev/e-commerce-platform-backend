import { Schema, model, Types } from 'mongoose';

interface IReview {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  user: Types.ObjectId;
  product: Types.ObjectId;
  createdAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
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
      required: [true, 'Comment is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
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
