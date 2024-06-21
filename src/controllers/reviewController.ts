import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import { ReviewService } from '@interfaces/IReview';
import { ProductService } from '@interfaces/IProduct';
import { OrderService } from '@interfaces/IOrder';
import { CreateReviewInput, UpdateReviewInput, ReviewIdInput } from '@schema/reviewSchema';

export class ReviewController {
  private productService = new ProductService();
  private reviewService = new ReviewService();
  private orderService = new OrderService();

  public getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.query.pid as string;
      const reviews = await this.reviewService.getReviewsByProduct(productId);

      return res.status(200).json({
        data: reviews,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public createProductReview = async (
    req: Request<CreateReviewInput['query'], CreateReviewInput['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user.id;
      const productId = req.query.pid as string;

      const product = await this.productService.getProductById(productId);

      if (!product) {
        return res.status(400).json({
          message: 'Product does not exist',
        });
      }

      const hasPurchased = await this.orderService.checkUserOrder(productId, userId);

      if (!hasPurchased) {
        return res.status(400).json({
          message: 'You have not purchased this product',
        });
      }

      const existingReview = await this.reviewService.getReviewByUser(productId, userId);

      if (existingReview) {
        return res.status(400).json({
          message: 'You have already reviewed this product',
          date: existingReview,
        });
      }

      const reviewData = {
        rating: req.body.rating,
        comment: req.body.comment, // Optional
        user: userId,
        product: productId,
      };

      const review = await this.reviewService.createReview(reviewData);

      if (review) {
        const avgRating = await this.reviewService.getAverageRating(productId);

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

  public updateProductReview = async (
    req: Request<UpdateReviewInput['params'], UpdateReviewInput['body']>,
    res: Response,
    next: NextFunction
  ) => {
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

  public deleteProductReview = async (req: Request<ReviewIdInput['params']>, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const reviewId = req.params.reviewId;

      // Fetch the review to validate its existence and the user authorization
      const review = await this.reviewService.getReviewById(reviewId);
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

      // Delete the review
      await this.reviewService.deleteReview(reviewId);

      // Recalculate the average rating for the product
      const avgRating = (await this.reviewService.getAverageRating(review.product)) as any;
      console.log(avgRating);

      // This is a big bug, avgRating is an array and not a number (depcricated the code below)
      // const newAvgRating = avgRating.length > 0 ? avgRating[0].avgRating : 0;
      // console.log(newAvgRating);

      // Update the product with the new average rating and decrement the number of reviews
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
