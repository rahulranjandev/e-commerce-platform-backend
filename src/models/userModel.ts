import mongoose from 'mongoose';

interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  avatar?: string;
  provider?: string;
  verified?: boolean;
  token?: string;
  resgisteredDate?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: 'https://img.icons8.com/stickers/100/null/super-mario.png',
    },
    provider: {
      type: String,
      default: 'local',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: '',
    },
    resgisteredDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser };
