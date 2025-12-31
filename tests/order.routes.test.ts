// @ts-nocheck
import request from 'supertest';

import app from '../src/app';
import { orderServiceMock, paymentServiceMock } from './mocks/services';

describe('Order routes', () => {
  const authHeader = { Authorization: 'Bearer token' };

  it('creates an order (cash)', async () => {
    const res = await request(app)
      .post('/api/order')
      .set(authHeader)
      .send({
        orderItems: { product: 'prod1', qty: 1 },
        shippingAddress: { address: '123 Street', city: 'City', postalCode: '00000', state: 'ST', phone: '1234567890' },
        paymentMethod: 'Cash',
      });

    expect(res.status).toBe(201);
    expect(res.body.data._id).toBeDefined();
  });

  it('gets orders for user', async () => {
    const res = await request(app).get('/api/order').set(authHeader);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('gets an order by id', async () => {
    const res = await request(app).get('/api/order/order1').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBeDefined();
  });

  it('verifies an order payment', async () => {
    orderServiceMock.getOrderByQuery.mockResolvedValueOnce({
      _id: 'order1',
      user: 'user-id',
      paymentResult: {},
      paymentMethod: 'Razorpay',
      orderItems: [{ product: 'prod1', qty: 1 }],
      totalPrice: 100,
      status: 'pending',
      isPaid: false,
    } as any);
    paymentServiceMock.verifyPayment.mockResolvedValueOnce('Payment Successful');
    paymentServiceMock.getPayment.mockResolvedValueOnce({ status: 'captured' });

    const res = await request(app)
      .put('/api/order/verify?oid=order1')
      .set(authHeader)
      .send({ razorpay_order_id: 'rzo', razorpay_payment_id: 'rzp', razorpay_signature: 'sig' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('paid');
  });

  it('updates an order status', async () => {
    orderServiceMock.getOrderByQuery.mockResolvedValueOnce({
      _id: 'order1',
      user: 'user-id',
      paymentResult: {},
      paymentMethod: 'Cash',
      orderItems: [{ product: 'prod1', qty: 1 }],
      totalPrice: 100,
      status: 'confirmed',
      isPaid: false,
    } as any);

    orderServiceMock.findAndUpdateOrder.mockResolvedValueOnce({ _id: 'order1', status: 'delivered' } as any);

    const res = await request(app).put('/api/order?oid=order1').set(authHeader).send({ status: 'delivered' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('delivered');
  });

  it('cancels an order', async () => {
    orderServiceMock.getOrderByQuery.mockResolvedValueOnce({
      _id: 'order1',
      user: 'user-id',
      status: 'confirmed',
      isPaid: false,
      paymentMethod: 'Cash',
      orderItems: [{ product: 'prod1', qty: 1 }],
      totalPrice: 100,
    } as any);

    orderServiceMock.findAndUpdateOrder.mockResolvedValueOnce({ _id: 'order1', status: 'cancelled' } as any);

    const res = await request(app).put('/api/order/cancel?oid=order1').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/cancelled successfully/i);
  });
});
