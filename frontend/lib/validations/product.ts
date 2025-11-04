import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  brand: z.string().optional(),
  countInStock: z.number().min(0, "Stock must be non-negative"),
  image: z.array(z.string()).min(1, "At least one image is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
})

export const addressSchema = z.object({
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  phone: z.string().min(10, "Valid phone number is required"),
})

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.string().refine(
    (val) => val === "Razorpay" || val === "Cash",
    { message: "Please select a valid payment method" }
  ),
})

export type ProductInput = z.infer<typeof productSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
