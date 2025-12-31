import { z } from 'zod';

const createOrderSchema = z.object({
  body: z.object({
    orderItems: z.array(
      z.object({
        name: z.string({ error: 'Name is required' }),
        qty: z.number({ error: 'Quantity is required' }),
        image: z.string({ error: 'Image is required' }),
        price: z.number({ error: 'Price is required' }),
        product: z.string({ error: 'Product is required' }),
      })
    ),
    shippingAddress: z.object({
      address: z.string({ error: 'Address is required' }),
      city: z.string({ error: 'City is required' }),
      postalCode: z.string({ error: 'Postal code is required' }),
      country: z.string({ error: 'Country is required' }),
      phone: z.string({ error: 'Phone is required' }),
    }),
    paymentMethod: z.string({ error: 'Payment method is required' }),
    itemsPrice: z.number({ error: 'Items price is required' }),
    taxPrice: z.number({ error: 'Tax price is required' }),
    shippingPrice: z.number({ error: 'Shipping price is required' }),
    totalPrice: z.number({ error: 'Total price is required' }),
  }),
});

const updateOrderSchema = z.object({
  body: z.object({
    orderItems: z.array(
      z.object({
        name: z.string().optional(),
        qty: z.number().optional(),
        image: z.string().optional(),
        price: z.number().optional(),
        product: z.string().optional(),
      })
    ),
    shippingAddress: z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      phone: z.string().optional(),
    }),
    paymentMethod: z.string().optional(),
    isPaid: z.boolean().optional(),
    paidAt: z.string().optional(),
    isDelivered: z.boolean().optional(),
    deliveredAt: z.string().optional(),
    itemsPrice: z.number().optional(),
    taxPrice: z.number().optional(),
    shippingPrice: z.number().optional(),
    totalPrice: z.number().optional(),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
