import { Router } from 'express';

const router = Router();

import AuthMiddleware from '@middlewares/authMiddleware';
import OnlyAdminAccess from '@middlewares/onlyAdmimAccess';

import { ReviewController } from '@controllers/reviewController';
import validateSchema from '@/middlewares/validateSchema';

const authMiddleware = new AuthMiddleware();
const onlyAdminAccess = new OnlyAdminAccess();

const Review = new ReviewController();

/**
 * @description Get Product Reviews - /api/v1/review - Public Routes
 * @access Public
 * @alias GET /api/v1/review?pid=productId
 * @query ?pid=productId
 */
router.get('/', Review.getProductReviews);

/**
 * @description Get Review - /api/v1/review/:id - Public Routes
 * @access Public
 * @alias GET /api/v1/review/:id
 * @params id
 */
// router.get('/:id', Review.getReviewById);

/**
 * @description Create Review - /api/v1/review - Private Routes
 * @access User Access - Private
 * @alias POST /api/v1/review?pid=productId
 * @query ?pid=productId
 */
router.post('/', authMiddleware.isAuthenticated, authMiddleware.requireUser, Review.createProductReview);

/**
 * @description Update Review - /api/v1/review/:reviewId - Private Routes
 * @access User Access - Private
 * @alias PUT /api/v1/review/:reviewId
 * @params reviewId
 */
router.put('/:reviewId', authMiddleware.isAuthenticated, authMiddleware.requireUser, Review.updateProductReview);

/**
 * @description Delete Review - /api/v1/review/:reviewId - Private Routes
 * @access User Access - Private
 * @alias DELETE /api/v1/review/:reviewId
 * @params reviewId
 */
router.delete('/:reviewId', authMiddleware.isAuthenticated, authMiddleware.requireUser, Review.deleteProductReview);

export default router;
