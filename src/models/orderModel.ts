import { Schema, model, Types } from 'mongoose';

interface IOrder {
  _id?: string;
  user: Types.ObjectId;
  orderItems: {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: Types.ObjectId;
  }[];
  status?: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    state: string;
    phone: string;
  };
  paymentMethod: string;
  paymentResult?: {
    order_id: string;
    payment_id: string;
    signature: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  refundResult?: {
    order_id: String;
    payment_id: String;
    refund_id: String;
    status: String;
    update_time: String;
    email_address: String;
    arn: String;
  };
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid?: boolean;
  paidAt?: Date;
  isDelivered?: boolean;
  deliveredAt?: Date;
  cancelledAt?: Date;
  createdAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    status: {
      type: String,
      required: true,
      default: 'pending', // pending, confirmed, shipped, delivered, cancelled
    },
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String, // Cash, Razorpay
      required: true,
    },
    paymentResult: {
      order_id: { type: String },
      payment_id: { type: String },
      signature: { type: String },
      status: { type: String }, // pending, completed, failed
      update_time: { type: String },
      email_address: { type: String },
    },
    refundResult: {
      order_id: { type: String },
      payment_id: { type: String },
      refund_id: { type: String },
      status: { type: String }, // pending, completed, failed
      update_time: { type: String },
      email_address: { type: String },
      arn: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    createdAt: {
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

const Order = model('Order', orderSchema);

export { Order, IOrder };
