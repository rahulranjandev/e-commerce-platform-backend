import { Router } from 'express';

const router = Router();

import AuthMiddleware from '@middlewares/authMiddleware';
import OnlyAdminAccess from '@middlewares/onlyAdmimAccess';

import { UserController } from '@controllers/userController';
import validateSchema from '@/middlewares/validateSchema';
import { updateUserSchema } from '@schema/userSchema';

const authMiddleware = new AuthMiddleware();
const onlyAdminAccess = new OnlyAdminAccess();

const User = new UserController();

/**
 * @description Get User - /api/v1/user - Private Routes
 * @access User Access - Private
 * @alias GET /api/v1/user
 */
router.get(
  '/',
  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,

  User.getUser
);

/**
 * @description Update User - /api/v1/user - Private Routes
 * @access User Access - Private
 * @alias PUT /api/v1/user
 */
router.put(
  '/',
  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,
  validateSchema(updateUserSchema),

  User.updateUser
);

/**
 * @description Delete User - /api/v1/user/:id - Private Routes
 * @access Admin Access - Private
 * @alias DELETE /api/v1/user/:id
 * @params id
 */
router.delete('/:id', authMiddleware.isAuthenticated, onlyAdminAccess.onlyAdmimAccess(true), User.deleteUser);

export default router;
