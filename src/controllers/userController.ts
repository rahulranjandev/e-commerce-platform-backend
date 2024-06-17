import { NextFunction, Request, Response } from 'express';

import { UpdateUserInput } from '@/schema/userSchema';
import { UserService } from '@interfaces/IUser';
import { SendEmail } from '@utils/sendEmail';

export class UserController {
  private userService = new UserService();
  private sendEmail = new SendEmail();

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(res.locals.user.id);

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      return res.status(200).json({
        data: user,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public updateUser = async (req: Request<{}, UpdateUserInput['body']>, res: Response, next: NextFunction) => {
    try {
      const id = res.locals.user.id;

      // Initialize payload with only verified field
      const payload: Partial<UpdateUserInput['body']> & { verified: boolean } = {
        verified: true,
      };

      if (req.body.email) {
        const user = await this.userService.getUserByQuery({ email: req.body.email });

        if (user) {
          return res.status(400).json({
            message: 'Email already taken',
          });
        }

        // Set the email in the payload
        payload.email = req.body.email;

        // Send verification email
        await this.sendEmail.sendVerificationEmail(id, req.body.email);

        // Update user's email_verified field to false
        payload.verified = false;

        // Update user's email and verified status in the database
        await this.userService.findAndUpdateUser(
          { _id: id },
          { $set: { email: req.body.email, verified: payload.verified } },
          { new: true }
        );
      }

      if (req.body.avatar) {
        // Set the avatar in the payload
        payload.avatar = req.body.avatar;

        // Update user's avatar in the database
        await this.userService.findAndUpdateUser({ _id: id }, { $set: { avatar: req.body.avatar } }, { new: true });
      }

      // Return only the fields that were updated
      return res.status(200).json({
        data: payload,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const user = await this.userService.deleteUser(id);

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      res.status(200).json({
        message: 'User deleted successfully',
        data: user,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}
