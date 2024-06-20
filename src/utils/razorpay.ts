import Razorpay from 'razorpay';
import crypto from 'crypto';

import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@config';

export class PaymentService {
  private razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID as string,
    key_secret: RAZORPAY_KEY_SECRET as string,
  });

  // Create a order for payment of product
  public createNewOrder = async (amount: number) => {
    try {
      const options = {
        amount: amount * 100, // Razorpay expects the amount in paise
        currency: 'INR',
        receipt: crypto.randomBytes(10).toString('hex'),
        payment_capture: 1,
      };

      const order = await this.razorpay.orders.create(options);

      return order;
    } catch (err: any) {
      console.error('Razorpay Error:', err.message);
      throw new Error('Failed to create Razorpay order');
    }
  };

  /**
   * @description Verify payment
   * @Access Private
   */
  public verifyPayment = async (razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) => {
    try {
      const shasum = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET as string);

      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);

      const digest = shasum.digest('hex');

      if (digest === razorpay_signature) {
        console.log('Payment verification successful');

        return 'Payment Successful';
      } else {
        return 'Payment verification failed';
      }
    } catch (err: any) {
      console.error('Razorpay Error:', err.message);
      throw new Error('Please try again, something went wrong');
    }
  };

  public getPayment = async (paymentId: string) => {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);

      return payment;
    } catch (err: any) {
      console.error('Razorpay Error:', err.message);
      throw new Error('Please try again, something went wrong');
    }
  };

  public refundPayment = async (paymentId: string, amount: number) => {
    try {
      const refundOptions = amount ? { amount: amount * 100 } : {}; // If amount is specified, convert to paise

      const refund = await this.razorpay.payments.refund(paymentId, refundOptions);

      return refund;
    } catch (err: any) {
      console.error('Razorpay Error:', err.message);
      throw new Error('Please try again, something went wrong');
    }
  };

  public capturePayment = async (paymentId: string, amount: number) => {
    try {
      const payment = await this.razorpay.payments.capture(paymentId, amount * 100, 'INR'); // Convert to paise

      return payment;
    } catch (err: any) {
      console.error('Razorpay Error:', err.message);
      throw new Error('Please try again, something went wrong');
    }
  };
}
