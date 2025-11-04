import { httpClient } from "../http"
import { Product } from "./catalog"

export interface Order {
  _id: string
  id: string
  user: string
  orderItems: OrderItem[]
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentResult?: PaymentResult
  refundResult?: RefundResult
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt?: string
  isDelivered: boolean
  deliveredAt?: string
  cancelledAt?: string
  createdAt: string
}

export interface OrderItem {
  name: string
  qty: number
  image: string
  price: number
  product: string
}

export interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  state: string
  phone: string
}

export interface PaymentResult {
  order_id: string
  payment_id: string
  signature: string
  status: string
  update_time: string
  email_address: string
}

export interface RefundResult {
  order_id: string
  payment_id: string
  refund_id: string
  status: string
  update_time: string
  email_address: string
  arn: string
}

export interface CreateOrderData {
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
}

export interface VerifyPaymentData {
  order_id: string
  payment_id: string
  signature: string
}

export const ordersApi = {
  // Get all orders for current user
  getOrders: async (): Promise<Order[]> => {
    const response = await httpClient.get("/api/order")
    return response.data.orders
  },

  // Get single order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await httpClient.get(`/api/order/${id}`)
    return response.data.order
  },

  // Create new order
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await httpClient.post("/api/order", data)
    return response.data.order
  },

  // Verify payment
  verifyPayment: async (orderId: string, data: VerifyPaymentData): Promise<Order> => {
    const response = await httpClient.put(`/api/order/verify?oid=${orderId}`, data)
    return response.data.order
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await httpClient.put(`/api/order?oid=${orderId}`, { status })
    return response.data.order
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await httpClient.put(`/api/order/cancel?oid=${orderId}`)
    return response.data.order
  },
}
