import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { UserService } from '@interfaces/IUser';
import { ForgetPasswordInput } from '@/schema/userSchema';
import { SendEmail } from '@utils/sendEmail';

export class PasswdController {
  private userService = new UserService();
  private sendEmail = new SendEmail();

  public forgotPassword = async (req: Request<{}, ForgetPasswordInput['body']>, res: Response, next: NextFunction) => {
    const payload = {
      email: req.body.email,
    };

    try {
      const user = await this.userService.getUserByQuery({ email: payload.email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // To send email using Mailgun API
      if (user) {
        await this.sendEmail.forgotPassword(user, res);
      }
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const resttoken = req.params.resttoken;
    const payload = {
      password: req.body.password,
    };

    if (!resttoken) {
      return res.status(401).json({ message: 'Token is required' });
    }

    if (!payload.password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    try {
      const user = await this.userService.getUserByToken(resttoken);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(payload.password, salt);
      const newChangedPassword = (user.password = hash);
      const newToken = (user.token = '');

      await this.userService.resetPassword(newChangedPassword, newToken);

      res.status(200).json({
        message: 'Password reset successful',
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string };
    const { id } = res.locals.user.id;

    try {
      const user = await this.userService.getUserByQuery({ _id: id });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      const newChangedPassword = (user.password = hash);

      await this.userService.findAndUpdateUser({ _id: id }, { password: newChangedPassword }, { new: true });

      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public changePasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: 'Passwd API called, Under construction 🚧',
    });
  };
}
