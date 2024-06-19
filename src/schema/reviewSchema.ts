import { z } from 'zod';

const createReviewSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(3).max(50),
    rating: z.number({ required_error: 'Rating is required' }).min(1).max(5),
    comment: z.string({ required_error: 'Comment is required' }).min(10).max(500),
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50).optional(),
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().min(10).max(500).optional(),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
