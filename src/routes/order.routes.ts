import { Router } from 'express';

const router = Router();

import AuthMiddleware from '@middlewares/authMiddleware';
import OnlyAdminAccess from '@middlewares/onlyAdmimAccess';

import { OrderController } from '@controllers/orderController';
import validateSchema from '@/middlewares/validateSchema';

const authMiddleware = new AuthMiddleware();
const onlyAdminAccess = new OnlyAdminAccess();

const Order = new OrderController();

/**
 * @description Get Orders By User - /api/v1/order - Private Routes
 * @access User Access - Private
 * @alias GET /api/v1/order
 */
router.get('/', authMiddleware.isAuthenticated, Order.getOrdersByUser);

/**
 * @description Get Order - /api/v1/order/:id - Private Routes
 * @access User + Admin Access - Private
 * @alias GET /api/v1/order/:id
 * @params id
 */
router.get('/:id', authMiddleware.isAuthenticated, Order.getOrderById);

/**
 * @description Create Order - /api/v1/order - Private Routes
 * @access User Access - Private
 * @alias POST /api/v1/order
 */
router.post('/', authMiddleware.isAuthenticated, Order.createOrder);

/**
 * @description Update Order - /api/v1/order/:id - Private Routes
 * @access User Access - Private
 * @alias PUT /api/v1/order?oid=order_id
 * @query ?oid=order_id
 */
router.put('/', authMiddleware.isAuthenticated, Order.updateOrderStatus);

/**
 * @description Cancel Order - /api/v1/order/:id - Private Routes
 * @access User Access - Private
 * @alias PUT /api/v1/order?oid=order_id
 * @params ?oid=order_id
 */
router.put('/', authMiddleware.isAuthenticated, Order.cancelOrder);

export default router;
