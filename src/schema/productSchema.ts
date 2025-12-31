import { z } from 'zod';

const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ error: 'Name is required' })
      .min(3, { message: 'Name must be at least 3 characters' })
      .max(100, { message: 'Name must be at most 100 characters' }),
    price: z.string({ error: 'Price is required' }).min(1),
    description: z
      .string({ error: 'Description is required' })
      .min(10, { message: 'Description must be at least 10 characters' })
      .max(2000, { message: 'Description must be at most 500 characters' }),
    category: z.array(z.string()).min(1, { message: 'Category is required' }),
    brand: z
      .string({ error: 'Brand is required' })
      .min(3, { message: 'Brand must be at least 3 characters' })
      .max(50, { message: 'Brand must be at most 50 characters' }),
    countInStock: z.string({ error: 'Stock is required' }).min(0),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    price: z.number().min(1).optional(),
    description: z.string().min(10).max(2000).optional(),
    category: z.array(z.string()).min(1).optional(),
    brand: z.string().optional(),
    countInStock: z.number().min(0).optional(),
    rating: z.number().optional(),
    numReviews: z.number().optional(),
  }),
});

const ProductByCategorySchema = z.object({ params: z.object({ category: z.string().min(3).max(50) }) });

const ProductByIdSchema = z.object({ params: z.object({ productId: z.string() }) });

export { createProductSchema, updateProductSchema, ProductByCategorySchema, ProductByIdSchema };

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductByCategoryInput = z.infer<typeof ProductByCategorySchema>;
export type ProductByIdInput = z.infer<typeof ProductByIdSchema>;
