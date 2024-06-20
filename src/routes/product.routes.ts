import { Router } from 'express';

const router = Router();

import AuthMiddleware from '@middlewares/authMiddleware';
import OnlyAdminAccess from '@middlewares/onlyAdmimAccess';

import { ProductController } from '@controllers/productController';
import validateSchema from '@/middlewares/validateSchema';
import {
  ProductByCategorySchema,
  ProductByIdSchema,
  createProductSchema,
  updateProductSchema,
} from '@/schema/productSchema';

import upload from '@utils/upload';

const authMiddleware = new AuthMiddleware();
const onlyAdminAccess = new OnlyAdminAccess();

const Product = new ProductController();

/**
 * @description Get Product - /api/v1/product - Public Routes
 * @access Public
 * @alias GET /api/v1/product
 */
router.get('/', Product.getProducts);

/**
 * @description Get Product By Category - /api/v1/product/category/:category - Public Routes
 * @access Public
 * @alias GET /api/v1/product/category/:category
 * @params category
 */
router.get('/category/:category', validateSchema(ProductByCategorySchema), Product.getProductByCategory);

/**
 * @description Get Product - /api/v1/product/:id - Public Routes
 * @access Public
 * @alias GET /api/v1/product/:id
 * @params id
 */
router.get('/:productId', validateSchema(ProductByIdSchema), Product.getProductById);

/**
 * @description Create Product - /api/v1/product - Private Routes
 * @access Admin Access - Private
 * @alias POST /api/v1/product
 */
router.post(
  '/',

  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,
  onlyAdminAccess.onlyAdmimAccess(true),
  upload.any(),
  validateSchema(createProductSchema),

  Product.createProduct
);

/**
 * @description Update Product - /api/v1/product/:id - Private Routes
 * @access Admin Access - Private
 * @alias PUT /api/v1/product/:id
 * @params id
 */
router.put(
  '/:productId',

  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,
  onlyAdminAccess.onlyAdmimAccess(true),
  upload.any(),
  validateSchema(updateProductSchema),

  Product.updateProduct
);

/**
 * @description Delete Product - /api/v1/product/:id - Private Routes
 * @access Admin Access - Private
 * @alias DELETE /api/v1/product/:id
 * @params id
 */
router.delete(
  '/:productId',

  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,
  onlyAdminAccess.onlyAdmimAccess(true),
  validateSchema(ProductByIdSchema),

  Product.deleteProduct
);

export default router;
