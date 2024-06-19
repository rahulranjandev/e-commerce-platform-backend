import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IUser, User } from '@models/userModel';

export class UserService {
  /**
   * @description Get User Info
   * @Access Middleware access - Protected
   */
  public async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).lean().select('-password').select('-token');
  }

  /**
   * @description Get User Info - Public Access
   * @Access User access
   */
  public async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email });
  }

  /**
   * @description Get User Info
   * @Access User access - Protected
   */
  public async getUserByQuery(query: FilterQuery<IUser>): Promise<IUser | null> {
    return await User.findOne(query as FilterQuery<IUser>)
      .select('-password')
      .select('-token');
  }

  /**
   * @description Create User - Public Access
   * @Access Public access
   */
  public async createUser(user: IUser | any): Promise<IUser> {
    return await User.create(user);
  }

  /**
   * @description Update User - User access only
   * @Access User access - Protected
   */
  public async updateUser(id: string, user: IUser | any): Promise<IUser | null> {
    return await User.findOneAndUpdate({ _id: id }, user, { upsert: true });
  }

  /**
   * @description Update User - User access only
   * @Access User access - Protected
   */
  public async findAndUpdateUser(query: FilterQuery<IUser>, update: UpdateQuery<IUser>, options: QueryOptions) {
    return await User.findOneAndUpdate(query, update, options);
  }

  /**
   * @description Reset Password - User access only (via email)
   * @description Send email with token to user email address and save token to user document
   */
  public async forgetPasswordToken(email: string, token: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      {
        email: email,
      },
      { token: token }
    );
  }

  /**
   * @description Save token to user document
   * @description Used for verifying user email address
   */
  public async saveTokenToUser(email: string, token: string): Promise<IUser | null> {
    return await User.findOneAndUpdate({ email: email }, { token: token });
  }

  /**
   * @description Save token to user document
   * @description Used for verifying user email address
   */
  public async savedToken(id: string, token: string): Promise<IUser | null> {
    return await User.findOneAndUpdate({ _id: id }, { token: token });
  }

  /**
   * @description Change Password via email and token - User access only
   * @description Find user by token and return user
   * @description Used to check if user exists
   */
  public async getUserByToken(token: string): Promise<IUser | null> {
    return await User.findOne({ token: token }).select('-password');
  }

  /**
   * @description Change Password via email and token - User access only
   * @description Use token to find user and update password with new password and remove token
   */
  public async resetPassword(hash: string, token: string): Promise<IUser | null> {
    return await User.findOneAndUpdate({ password: hash, resetPasswordToken: token });
  }

  /**
   * @description Delete User - Admin access only
   */
  public async deleteUser(id: string): Promise<IUser | null> {
    return await User.findOneAndDelete({ _id: id });
  }
}
