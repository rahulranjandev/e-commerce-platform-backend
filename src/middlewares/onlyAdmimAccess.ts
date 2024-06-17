import { NextFunction, Request, Response } from 'express';

class OnlyAdminAccess {
  public onlyAdmimAccess =
    (...allowedRoles: boolean[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user;

      if (!allowedRoles.includes(user.admin)) {
        return res.status(403).json({
          message: 'You are not authorized, only admin can access',
        });
      }

      next();
    };
}

export default OnlyAdminAccess;
