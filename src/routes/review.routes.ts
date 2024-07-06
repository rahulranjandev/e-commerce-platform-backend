import { Router } from 'express';

const router = Router();

import AuthMiddleware from '@middlewares/authMiddleware';
import OnlyAdminAccess from '@middlewares/onlyAdmimAccess';

import { ReviewController } from '@controllers/reviewController';
import validateSchema from '@/middlewares/validateSchema';
import { createReviewSchema, updateReviewSchema, reviewIdSchema } from '@schema/reviewSchema';

const authMiddleware = new AuthMiddleware();
const onlyAdminAccess = new OnlyAdminAccess();

const Review = new ReviewController();

/**
 * @description Get Product Reviews - /api/review - AdminAccess
 * @access Admin Access - Private
 * @alias GET /api/review?pid=productId
 * @query ?pid=productId
 */
router.get(
  '/',

  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,
  onlyAdminAccess.onlyAdmimAccess(true),

  Review.getProductReviews
);

/**
 * @description Get Review - /api/review/:id - Public Routes
 * @access Public
 * @alias GET /api/review/:id
 * @params id
 * @todo Implement getReviewById
 */
// router.get('/:id', Review.getReviewById);

/**
 * @description Create Review - /api/review - Private Routes
 * @access User Access - Private
 * @alias POST /api/review?pid=productId
 * @query ?pid=productId
 */
router.post(
  '/',

  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,
  validateSchema(createReviewSchema),

  Review.createProductReview
);

/**
 * @description Update Review - /api/review/:reviewId - Private Routes
 * @access User Access - Private
 * @alias PUT /api/review/:reviewId
 * @params reviewId
 */
router.put(
  '/:reviewId',

  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,
  validateSchema(updateReviewSchema),

  Review.updateProductReview
);

/**
 * @description Delete Review - /api/review/:reviewId - Private Routes
 * @access User Access - Private
 * @alias DELETE /api/review/:reviewId
 * @params reviewId
 */
router.delete(
  '/:reviewId',

  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,
  validateSchema(reviewIdSchema),

  Review.deleteProductReview
);

export default router;
