import { z } from 'zod';

export const createReviewSchema = z.object({
  query: z.object({
    pid: z.string({ message: 'pid is required' }),
  }),
  body: z.object({
    rating: z.number({ message: 'Rating is required' }).min(1).max(5),
    comment: z.string().min(10).max(1000).optional(),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({
    reviewId: z.string(),
  }),
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().min(10).max(500).optional(),
  }),
});

export const reviewIdSchema = z.object({
  params: z.object({
    reviewId: z.string(),
  }),
});

export type ReviewIdInput = z.infer<typeof reviewIdSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
