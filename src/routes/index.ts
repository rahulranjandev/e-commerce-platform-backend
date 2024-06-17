import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';

const router = Router();

import authRoutes from './auth.routes';
import userRoutes from './user.routes';

import { AuthController } from '@controllers/authController';
import { PasswdController } from '@/controllers/passwdController';

const Auth = new AuthController();
const Password = new PasswdController();

/**
 * @description Status Routes - / - Public Routes
 * @description Get Server Status
 * @access Public
 * @alias GET /health
 */
const status = (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 'success',
    message: 'Server is Healthy 🚀',
  });
};

router.route('/health').get(status);

/**
 * @alias   GET /confirm/:token
 * @desc    Confirm email
 * @access  Public
 * @body    token
 */
router.get('/confirm/:token', Auth.confirmEmail);

/**
 * @alias   GET /verify/:token
 * @desc    Verify email
 * @access  Public
 * @body    token
 */
router.get('/verify/:token', Auth.confirmEmail);

/**
 * @alias   PUT /api/v1/auth/resetpassword/:resettoken
 * @desc    Reset password
 * @access  Public
 * @body    password (new password) and resettoken
 */
router.post('/resetpassword/:resttoken', Password.resetPassword);

/**
 * @description Auth Routes - /api/auth - Public Routes
 * @route /api/auth
 */
router.use('/api/auth', authRoutes);

/**
 * @description User Routes - /api/user - Private Routes
 * @route /api/user
 */
router.use('/api/user', userRoutes);

export default router;
