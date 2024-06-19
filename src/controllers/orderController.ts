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
      const order = await this.orderService.createOrder(req.body);

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

  public updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.updateOrder(req.params.id, req.body);

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

  public cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = {
        id: req.params.id,
        user: res.locals.user.id,
        status: 'cancelled',
        cancelledAt: new Date(),
      };
      const order = await this.orderService.cancelOrder(payload.id, payload.user, payload);

      return res.status(200).json({
        data: order,
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
      const orders = await this.orderService.getOrdersByUser(userID);

      if (!orders) {
        return res.status(404).json({
          message: 'Something went wrong',
        });
      }

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
