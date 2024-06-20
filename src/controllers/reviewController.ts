import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import { ReviewService } from '@interfaces/IReview';
import { ProductService } from '@interfaces/IProduct';
import { OrderService } from '@interfaces/IOrder';

export class ReviewController {
  private productService = new ProductService();
  private reviewService = new ReviewService();
  private orderService = new OrderService();

  public getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.query.pid as string;
      const reviews = await this.reviewService.getReviewsByProduct(productId);
      console.log('reviews:', reviews);

      return res.status(200).json({
        data: reviews,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public createProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const productId = req.query.pid as string;

      const product = await this.productService.getProductById(productId);
      console.log('product:', product);

      if (!product) {
        return res.status(400).json({
          message: 'Product does not exist',
        });
      }

      const hasPurchased = await this.orderService.checkUserOrder(productId, userId);
      console.log('hasPurchased:', hasPurchased);

      if (!hasPurchased) {
        return res.status(400).json({
          message: 'You have not purchased this product',
        });
      }

      const existingReview = await this.reviewService.getReviewByUser(productId, userId);
      console.log('existingReview:', existingReview);

      if (existingReview) {
        return res.status(400).json({
          message: 'You have already reviewed this product',
        });
      }

      const reviewData = {
        ...req.body,
        user: userId,
        product: productId,
      };
      console.log('reviewData:', reviewData);

      const review = await this.reviewService.createReview(reviewData);
      console.log('review:', review);

      if (review) {
        const avgRating = await this.reviewService.getAverageRating(productId);
        console.log('avgRating:', avgRating);

        await this.productService.findAndUpdateProduct(
          { _id: productId },
          {
            $set: { rating: avgRating },
            $inc: { numReviews: 1 },
          },
          { new: true }
        );
      }

      return res.status(201).json({
        data: review,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public updateProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const reviewId = req.params.reviewId;
      const { rating, comment } = req.body;

      // Validate review ID
      if (!Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: 'Invalid review ID' });
      }

      // Fetch review by ID
      const review = await this.reviewService.getReviewById(reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if user is authorized to update review
      if (review.user.toString() !== userId) {
        return res.status(403).json({ message: 'User not authorized to update this review' });
      }

      // Payload to update review
      const reviewData = {
        rating: rating || review.rating,
        comment: comment || review.comment,
      };

      // Update the review
      const updatedReview = await this.reviewService.findAndUpdateReview({ _id: reviewId }, reviewData, {
        new: true,
      });

      // Update product rating after review update
      const avgRating = await this.reviewService.getAverageRating(review.product);
      await this.productService.findAndUpdateProduct(
        { _id: review.product },
        {
          $set: { rating: avgRating },
        },
        { new: true }
      );

      return res.status(200).json({
        data: updatedReview,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public deleteProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const reviewId = req.params.reviewId;

      // Validate review ID
      const review = await this.reviewService.deleteReview(reviewId);
      if (!review) {
        return res.status(400).json({
          message: 'Review does not exist',
        });
      }

      // Check if user is authorized to delete review
      if (review.user.toString() !== userId) {
        return res.status(403).json({
          message: 'User not authorized to delete this review',
        });
      }

      const avgRating = await this.reviewService.getAverageRating(review.product);
      await this.productService.findAndUpdateProduct(
        { _id: review.product },
        {
          $set: { rating: avgRating },
          $inc: { numReviews: -1 },
        },
        { new: true }
      );

      return res.status(200).json({
        message: 'Review deleted successfully',
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}
