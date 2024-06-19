import { z } from 'zod';

const createOrderSchema = z.object({
  body: z.object({
    orderItems: z.array(
      z.object({
        name: z.string({ required_error: 'Name is required' }),
        qty: z.number({ required_error: 'Quantity is required' }),
        image: z.string({ required_error: 'Image is required' }),
        price: z.number({ required_error: 'Price is required' }),
        product: z.string({ required_error: 'Product is required' }),
      })
    ),
    shippingAddress: z.object({
      address: z.string({ required_error: 'Address is required' }),
      city: z.string({ required_error: 'City is required' }),
      postalCode: z.string({ required_error: 'Postal code is required' }),
      country: z.string({ required_error: 'Country is required' }),
      phone: z.string({ required_error: 'Phone is required' }),
    }),
    paymentMethod: z.string({ required_error: 'Payment method is required' }),
    itemsPrice: z.number({ required_error: 'Items price is required' }),
    taxPrice: z.number({ required_error: 'Tax price is required' }),
    shippingPrice: z.number({ required_error: 'Shipping price is required' }),
    totalPrice: z.number({ required_error: 'Total price is required' }),
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
