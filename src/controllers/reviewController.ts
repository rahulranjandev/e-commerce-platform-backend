import { NextFunction, Request, Response } from 'express';

import { ReviewService } from '@interfaces/IReview';
import { ProductService } from '@interfaces/IProduct';

export class ReviewController {
  private productService = new ProductService();
  private reviewService = new ReviewService();

  public createProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.createReview(req.body);
      console.log(review);

      // Logic to update the product rating and review count goes here (not implemented) 🙂🙂
      if (review) {
        const avgRating = await this.reviewService.getAverageRating(req.body.product);
        console.log(avgRating);

        await this.productService.findAndUpdateProduct(
          { _id: req.body.product },
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
      const review = await this.reviewService.updateReview(req.params.id, req.body);

      return res.status(200).json({
        data: review,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public deleteProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.deleteReview(req.params.id);

      if (!review) {
        return res.status(400).json({
          message: 'Review does not exist',
        });
      }

      return res.status(200).json({
        message: 'Review deleted successfully',
        data: review,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}
