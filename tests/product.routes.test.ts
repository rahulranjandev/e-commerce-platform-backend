// @ts-nocheck
import request from 'supertest';

import app from '../src/app';
import { productServiceMock } from './mocks/services';

describe('Product routes', () => {
  const authHeader = { Authorization: 'Bearer token' };

  it('lists products', async () => {
    const res = await request(app).get('/api/product');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('gets products by category', async () => {
    const res = await request(app).get('/api/product/category/cat');

    expect(res.status).toBe(200);
    expect(res.body.data[0].category).toBeDefined();
  });

  it('gets product by id', async () => {
    const res = await request(app).get('/api/product/prod1');

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBeDefined();
  });

  it('creates a product (admin)', async () => {
    productServiceMock.createProduct.mockResolvedValueOnce({ _id: 'prod2', name: 'Created Product' });

    const res = await request(app)
      .post('/api/product')
      .set(authHeader)
      .send({
        name: 'Created Product',
        description: 'Great product description',
        price: '150',
        countInStock: '10',
        brand: 'BrandX',
        category: ['cat'],
      });

    expect(res.status).toBe(201);
    expect(res.body.data._id).toBe('prod2');
  });

  it('updates a product (admin)', async () => {
    productServiceMock.updateProduct.mockResolvedValueOnce({ _id: 'prod1', name: 'Updated Product' });

    const res = await request(app)
      .put('/api/product/prod1')
      .set(authHeader)
      .send({ name: 'Updated Product', category: ['cat'], price: 200, countInStock: 5 });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toContain('Updated');
  });

  it('deletes a product (admin)', async () => {
    productServiceMock.deleteProduct.mockResolvedValueOnce({
      _id: 'prod1',
      name: 'Product 1',
      image: ['https://cdn.example.com/blob.jpg'],
      category: ['cat'],
    });

    const res = await request(app).delete('/api/product/prod1').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });
});
