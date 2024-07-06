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
 * @description Get Orders By User - /api/order - Private Routes
 * @access User Access - Private
 * @alias GET /api/order
 */
router.get('/', authMiddleware.isAuthenticated, authMiddleware.requireUser, Order.getOrdersByUser);

/**
 * @description Get Order - /api/order/:id - Private Routes
 * @access User + Admin Access - Private
 * @alias GET /api/order/:id
 * @params id
 */
router.get('/:id', authMiddleware.isAuthenticated, authMiddleware.requireUser, Order.getOrderById);

/**
 * @description Create Order - /api/order - Private Routes
 * @access User Access - Private
 * @alias POST /api/order
 */
router.post('/', authMiddleware.isAuthenticated, authMiddleware.requireUser, Order.createOrder);

/**
 * @description Verify Order Payment - api/order?oid=order_id - Private Routes
 * @access User Access - Private
 * @alias PUT /api/order?oid=order_id
 * @params ?oid=order_id
 */
router.put('/verify', authMiddleware.isAuthenticated, authMiddleware.requireUser, Order.verifyOrderPayment);

/**
 * @description update Order Status - /api/order?oid=order_id - Private Routes
 * @access User Access - Private
 * @alias PUT /api/order?oid=order_id
 * @query ?oid=order_id
 */
router.put('/', authMiddleware.isAuthenticated, authMiddleware.requireUser, Order.updateOrderStatus);

/**
 * @description Cancel Order - /api/order/cancel?oid=order_id - Private Routes
 * @access User Access - Private
 * @alias PUT /api/order/cancel?oid=order_id
 * @params ?oid=order_id
 */
router.put('/cancel', authMiddleware.isAuthenticated, authMiddleware.requireUser, Order.cancelOrder);

export default router;
