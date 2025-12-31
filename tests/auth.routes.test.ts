// @ts-nocheck
import request from 'supertest';

import app from '../src/app';
import { userServiceMock, jwtMock } from './mocks/services';

describe('Auth routes', () => {
  it('registers a user', async () => {
    userServiceMock.getUserByQuery.mockResolvedValueOnce(null);
    userServiceMock.createUser.mockResolvedValueOnce({ _id: 'new-user', isAdmin: false, email: 'new@example.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'new@example.com', password: 'Passw0rd!' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBe('signed-jwt');
  });

  it('logs in a user', async () => {
    userServiceMock.getUserByEmail.mockResolvedValueOnce({
      _id: 'user-id',
      email: 'user@example.com',
      password: 'hashed-password',
      isAdmin: false,
    });

    const res = await request(app).post('/api/auth/login').send({ email: 'user@example.com', password: 'Passw0rd!' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('signed-jwt');
  });

  it('logs out a user', async () => {
    const res = await request(app).post('/api/auth/logout').set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/logged out/i);
  });

  it('confirms email with token', async () => {
    userServiceMock.getUserByToken.mockResolvedValueOnce({ _id: 'user-id', verified: false });

    const res = await request(app).get('/confirm/abc-token');

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/verified/i);
  });

  it('resets password with token', async () => {
    userServiceMock.getUserByToken.mockResolvedValueOnce({ _id: 'user-id', password: 'old', token: 'abc' });

    const res = await request(app).post('/resetpassword/abc').send({ password: 'NewPass123!' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/reset successful/i);
  });
});
