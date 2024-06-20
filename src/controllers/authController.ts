import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { NODE_ENV } from '@config';
import { UserService } from '@interfaces/IUser';
import { LoginUserInput, RegisterUserInput } from '@/schema/userSchema';
import { signedToken, cookieOptions } from '@utils/jwt';
import { SendEmail } from '@utils/sendEmail';

class AuthController {
  private userService = new UserService();
  private SendEmail = new SendEmail();

  public register = async (req: Request<{}, RegisterUserInput['body']>, res: Response, next: NextFunction) => {
    try {
      // payload
      const payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      };

      // Check if user already exists
      const user = await this.userService.getUserByQuery({ email: payload.email });
      if (user) return res.status(400).json({ message: 'User already exists' });

      // Hash password before saving in database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(payload.password, salt);
      payload.password = hashedPassword;

      // Create new user
      const newUser = await this.userService.createUser(payload);

      if (newUser) {
        // Send email to user
        await this.SendEmail.confirmEmail(newUser.email);
      }

      // Payload for JWT
      const payloadJWT = { user: { id: newUser._id as any, admin: newUser.isAdmin, email: newUser.email } };

      // Create token
      const _token = signedToken(payloadJWT);

      if (!_token) return res.status(500).json({ message: 'Token not found' });

      // Set cookies
      const cookieSettings = { ...cookieOptions, httpOnly: true };
      if (NODE_ENV === 'production') {
        cookieSettings.secure = true;
      }

      res.cookie('access_token', _token, cookieSettings);
      res.cookie('logged_in', true, { ...cookieSettings, httpOnly: false });

      res.status(201).json({
        data: newUser._id,
        token: _token,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  // Login user API
  public login = async (req: Request<{}, LoginUserInput['body']>, res: Response, next: NextFunction) => {
    try {
      // payload
      const payload = {
        email: req.body.email,
        password: req.body.password,
      };

      // Check if user exists
      const user = await this.userService.getUserByEmail(payload.email);
      if (!user) return res.status(400).json({ message: 'User does not exist' });

      // Check if password is correct
      const isMatch = await bcrypt.compare(payload.password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // Payload for JWT
      const payloadJWT = { user: { id: user._id, admin: user.isAdmin, email: user.email } };

      // Create token
      const _token = signedToken(payloadJWT);
      if (!_token) return res.status(500).json({ message: 'Token not found' });

      // Set cookies
      const cookieSettings = { ...cookieOptions, httpOnly: true };
      if (NODE_ENV === 'production') {
        cookieSettings.secure = true;
      }

      res.cookie('access_token', _token, cookieSettings);
      res.cookie('logged_in', true, { ...cookieSettings, httpOnly: false });

      // Send response
      return res.status(200).json({
        token: _token,
        data: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  // Logout user API
  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear cookies
      res.clearCookie('access_token');
      res.clearCookie('logged_in');
      res.clearCookie('token');

      // Send response
      res.status(200).json({
        message: 'User logged out successfully',
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  /**
   * @description Confirm email address of user using token after registration or email change request
   * @route GET /confirm/:token
   * @route GET /verify/:token
   * @access Public
   */
  public confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.params.token as string;

      if (!token) return res.status(400).json({ message: 'Token not found' });

      const user = await this.userService.getUserByToken(token);

      if (!user) return res.status(400).json({ message: 'User not found' });

      if (user.verified) return res.status(400).json({ message: 'User already verified' });

      // Remove token from user object and update user
      if (user) {
        const payload = { token: '', verified: true };

        await this.userService.findAndUpdateUser({ _id: user._id }, payload, {
          runValidators: false,
          new: true,
          upsert: false,
        });
      }

      res.status(200).json({ message: 'Email verified successfully' });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}

export { AuthController };
