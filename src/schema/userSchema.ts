import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(3).max(50),
    email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, `Password must be more than 6 character's`)
      .max(50, `Password must be less than 50 character's`),
    avatar: z.string().url({ message: 'Invalid URL' }).optional(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, `Password must be more than 6 character's`)
      .max(50, `Password must be less than 50 character's`),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email' }).optional(),
    password: z
      .string()
      .min(6, `Password must be more than 6 character's`)
      .max(50, `Password must be less than 50 character's`)
      .optional(),
    avatar: z.string().url({ message: 'Invalid URL' }).optional(),
  }),
});

export const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, `Password must be more than 6 character's`)
      .max(50, `Password must be less than 50 character's`),
  }),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
