import { NextFunction, Request, Response } from 'express';

import { OrderService } from '@interfaces/IOrder';
import { ProductService } from '@interfaces/IProduct';
import { UserService } from '@interfaces/IUser';
import { SendEmail } from '@utils/sendEmail';
import { PaymentService } from '@utils/razorpay';
import { IOrder } from '@/models/orderModel';

export class OrderController {
  private orderService = new OrderService();
  private productService = new ProductService();
  private userService = new UserService();
  private sendEmail = new SendEmail();
  private paymentService = new PaymentService();

  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const userEmailAddress = res.locals.user.email;
      const productId = req.body.orderItems.product;
      const { paymentMethod } = req.body;

      // Validate payment method
      if (!['Cash', 'Razorpay'].includes(paymentMethod)) {
        return res.status(400).json({
          message: 'Invalid payment method. Allowed values are Cash and Razorpay.',
        });
      }

      // Check the product availability and InStock
      const product = await this.productService.getProductById(productId);

      if (!product) {
        return res.status(400).json({
          message: 'Product not found',
        });
      }

      if (product.countInStock < req.body.orderItems.qty) {
        return res.status(400).json({
          message: 'Product out of stock',
        });
      }

      // Calculate total price based on product price and quantity
      const totalPrice = product.price * req.body.orderItems.qty;

      // Calculate shipping price based on the total price, Charge Rs. 50 if total price is less than Rs. 500
      let shippingPrice = 0;
      if (totalPrice < 500) {
        shippingPrice = 50;
      }

      // Payload
      const orderData = {
        user: userId,
        orderItems: {
          name: product.name,
          qty: req.body.orderItems.qty,
          image: product.image[0],
          price: product.price,
          product: productId,
        },
        shippingAddress: {
          address: req.body.shippingAddress.address,
          city: req.body.shippingAddress.city,
          postalCode: req.body.shippingAddress.postalCode,
          state: req.body.shippingAddress.state,
          phone: req.body.shippingAddress.phone,
        },
        paymentMethod: paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice + (shippingPrice || 0),
        status: paymentMethod === 'Cash' ? 'confirmed' : 'pending', // Set status based on payment method
      };

      // Save order in database
      const createdOrder = await this.orderService.createOrder(orderData);

      let updatedOrder = createdOrder;

      if (createdOrder) {
        if (paymentMethod === 'Razorpay') {
          // Create Razorpay order if payment method is Razorpay
          const razorpayOrderResponse = await this.paymentService.createNewOrder(createdOrder.totalPrice);

          const updatedOrderData = {
            ...orderData,
            paymentResult: {
              order_id: razorpayOrderResponse.id,
              status: razorpayOrderResponse.status,
              update_time: razorpayOrderResponse.created_at,
              email_address: userEmailAddress,
            },
          };

          // Update order in your database with Razorpay order ID and status
          const razorpayOrder = await this.orderService.findAndUpdateOrder(
            { _id: createdOrder._id },
            { $set: { paymentResult: updatedOrderData.paymentResult } },
            { new: true }
          );

          // Update the order object
          updatedOrder = razorpayOrder as IOrder;
        }

        // Logic to update the product stock goes here
        for (const item of createdOrder.orderItems) {
          const productId = item.product;
          const product = await this.productService.getProductById(productId);

          if (product) {
            product.countInStock -= item.qty;
            await this.productService.findAndUpdateProduct(
              { _id: item.product },
              { $set: { countInStock: product.countInStock } },
              { new: true }
            );
          }
        }

        // Send order confirmation email
        // await this.sendEmail.sendOrderConfirmationEmail(order.user, order._id);

        return res.status(201).json({
          data: updatedOrder,
        });
      } else {
        return res.status(400).json({
          message: 'Something went wrong',
        });
      }
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public verifyOrderPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const orderId = req.query.oid as string;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      // Fetch the order
      const existingOrder = await this.orderService.getOrderByQuery({ _id: orderId, user: userId });

      // Check if the order exists
      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if the user is authorized to update the order
      if (existingOrder.user.toString() !== userId) {
        return res.status(401).json({ message: 'You are not authorized to update this order' });
      }

      // Verify payment
      const isPaymentValid = await this.paymentService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (isPaymentValid !== 'Payment Successful') {
        return res.status(400).json({ message: 'Payment verification failed' });
      }

      // Fetch payment details
      const paymentDetails = await this.paymentService.getPayment(razorpay_payment_id);

      // Update order data
      const orderData = {
        status: 'paid',
        paymentResult: {
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          status: paymentDetails.status,
        },
        isPaid: true,
        paidAt: new Date(),
      };

      const updatedOrder = await this.orderService.findAndUpdateOrder(
        { _id: orderId },
        { $set: orderData },
        { new: true }
      );

      return res.status(200).json({
        data: updatedOrder,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const orderId = req.query.oid as string;
      const {
        status,
        paymentMethod,
        paymentResult,
        itemsPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
        cancelledAt,
      } = req.body;

      // Fetch the order
      const existingOrder = await this.orderService.getOrderByQuery({ _id: orderId, user: userId });

      // Check if the order exists
      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if the user is authorized to update the order
      if (existingOrder.user.toString() !== userId) {
        return res.status(401).json({ message: 'You are not authorized to update this order' });
      }

      // Update order data
      const orderData = {
        status: status || existingOrder.status,
        paymentMethod: paymentMethod || existingOrder.paymentMethod,
        paymentResult: paymentResult || existingOrder.paymentResult,
        itemsPrice: itemsPrice || existingOrder.itemsPrice,
        shippingPrice: shippingPrice || existingOrder.shippingPrice,
        totalPrice: totalPrice || existingOrder.totalPrice,
        isPaid: isPaid !== undefined ? isPaid : existingOrder.isPaid,
        paidAt: paidAt || existingOrder.paidAt,
        isDelivered: isDelivered !== undefined ? isDelivered : existingOrder.isDelivered,
        deliveredAt: deliveredAt || existingOrder.deliveredAt,
        cancelledAt: cancelledAt || existingOrder.cancelledAt,
      };

      const updatedOrder = await this.orderService.findAndUpdateOrder(
        { _id: orderId },
        { $set: orderData },
        { new: true }
      );

      return res.status(200).json({
        data: updatedOrder,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.query.oid as string;
      const userId = res.locals.user.id;

      // Fetch the order
      const existingOrder = await this.orderService.getOrderByQuery({ _id: orderId, user: userId });

      // Check if the order exists
      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if the user is authorized to cancel the order
      if (existingOrder.user.toString() !== userId) {
        return res.status(401).json({ message: 'You are not authorized to cancel this order' });
      }

      // Check if the order is already cancelled or delivered
      if (existingOrder.status === 'cancelled') {
        return res.status(400).json({ message: 'Order is already cancelled' });
      }
      if (existingOrder.isDelivered) {
        return res.status(400).json({ message: 'Delivered orders cannot be cancelled' });
      }

      let payload: any = {
        status: 'cancelled',
        cancelledAt: new Date(),
      };

      // Refund payment if the order is paid
      if (existingOrder.isPaid) {
        if (existingOrder.paymentMethod === 'Razorpay') {
          const refund = await this.paymentService.refundPayment(
            existingOrder.paymentResult?.payment_id as string,
            existingOrder.totalPrice
          );

          payload.refundResult = refund;

          // Send order cancellation email for Razorpay payment
          // await this.sendEmail.sendOrderCancellationEmail(
          //   existingOrder.user.email,
          //   existingOrder._id,
          //   'Refund processed to your original payment method.'
          // );
        } else if (existingOrder.paymentMethod === 'Cash') {
          // Send order cancellation email for Cash payment
          // await this.sendEmail.sendOrderCancellationEmail(
          //   existingOrder.user.email,
          //   existingOrder._id,
          //   'Cheque for the refund will be sent to your address.'
          // );
        }
      } else {
        // Send order cancellation email for unpaid orders
        // await this.sendEmail.sendOrderCancellationEmail(
        //   existingOrder.user.email,
        //   existingOrder._id,
        //   'Your order has been cancelled.'
        // );
      }

      // Cancel the order
      const cancelledOrder = await this.orderService.findAndUpdateOrder(
        { _id: orderId },
        { $set: payload },
        { new: true }
      );

      return res.status(200).json({
        data: cancelledOrder,
        message: 'Your order has been cancelled successfully',
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public getOrdersByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userID = res.locals.user.id;

      // Fetch orders by user && status !== "pending"
      const orders = await this.orderService.getOrdersByUser(userID);

      return res.status(200).json({
        data: orders,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }

      return res.status(200).json({
        data: order,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}
