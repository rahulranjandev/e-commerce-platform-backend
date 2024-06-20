import { NextFunction, Request, Response } from 'express';

import { OrderService } from '@interfaces/IOrder';
import { ProductService } from '@interfaces/IProduct';
import { UserService } from '@interfaces/IUser';
import { SendEmail } from '@utils/sendEmail';

export class OrderController {
  private orderService = new OrderService();
  private productService = new ProductService();
  private userService = new UserService();
  private sendEmail = new SendEmail();

  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const productId = req.body.orderItems[0].product;

      // Check the product availability and InStock
      const product = await this.productService.getProductById(productId);

      if (!product) {
        return res.status(400).json({
          message: 'Product not found',
        });
      }

      if (product.countInStock < req.body.orderItems[0].qty) {
        return res.status(400).json({
          message: 'Product out of stock',
        });
      }

      const orderData = {
        user: userId,
        orderItems: {
          name: product.name,
          qty: req.body.orderItems[0].qty,
          image: product.image,
          price: product.price,
          product: productId,
        },
        shippingAddress: {
          address: req.body.shippingAddress.address,
          city: req.body.shippingAddress.city,
          postalCode: req.body.shippingAddress.postalCode,
          country: req.body.shippingAddress.country,
          phone: req.body.shippingAddress.phone,
        },
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        taxPrice: req.body.taxPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
      };

      const order = await this.orderService.createOrder(orderData);

      // Logic to update the product stock goes here
      for (const item of order.orderItems) {
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
        data: order,
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
        taxPrice,
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
        taxPrice: taxPrice || existingOrder.taxPrice,
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
      // Prepare payload for cancellation
      const payload = {
        status: 'cancelled',
        cancelledAt: new Date(),
      };

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
