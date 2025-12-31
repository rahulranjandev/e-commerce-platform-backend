// @ts-nocheck
import request from 'supertest';

import app from '../src/app';
import { reviewServiceMock } from './mocks/services';

describe('Review routes', () => {
  const authHeader = { Authorization: 'Bearer token' };

  it('gets product reviews (admin)', async () => {
    const res = await request(app).get('/api/review?pid=prod1').set(authHeader);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('creates a product review', async () => {
    const res = await request(app)
      .post('/api/review?pid=prod1')
      .set(authHeader)
      .send({ rating: 5, comment: 'Fantastic product!', name: 'Tester' });

    expect(res.status).toBe(201);
    expect(res.body.data._id).toBeDefined();
  });

  it('updates a review', async () => {
    reviewServiceMock.getReviewById.mockResolvedValueOnce({
      _id: '507f1f77bcf86cd799439011',
      user: 'user-id',
      product: 'prod1',
      rating: 3,
      comment: 'ok',
    });

    const res = await request(app)
      .put('/api/review/507f1f77bcf86cd799439011')
      .set(authHeader)
      .send({ rating: 4, comment: 'Better product now' });

    expect(res.status).toBe(200);
    expect(res.body.data.rating).toBeDefined();
  });

  it('deletes a review', async () => {
    reviewServiceMock.getReviewById.mockResolvedValueOnce({
      _id: '507f1f77bcf86cd799439011',
      user: 'user-id',
      product: 'prod1',
      rating: 4,
      comment: 'ok',
    });

    const res = await request(app).delete('/api/review/507f1f77bcf86cd799439011').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });
});
