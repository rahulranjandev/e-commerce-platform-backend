// @ts-nocheck
import request from 'supertest';

import app from '../src/app';
import { userServiceMock } from './mocks/services';

describe('User routes', () => {
  const authHeader = { Authorization: 'Bearer token' };

  it('gets the current user', async () => {
    const res = await request(app).get('/api/user').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBeDefined();
  });

  it('updates user avatar', async () => {
    userServiceMock.findAndUpdateUser.mockResolvedValueOnce({ avatar: 'https://cdn.example.com/avatar.png' } as any);

    const res = await request(app)
      .put('/api/user')
      .set(authHeader)
      .send({ avatar: 'https://cdn.example.com/avatar.png' });

    expect(res.status).toBe(200);
    expect(res.body.data.avatar).toContain('cdn.example');
  });

  it('deletes a user as admin', async () => {
    userServiceMock.deleteUser.mockResolvedValueOnce({ _id: 'user-id' } as any);

    const res = await request(app).delete('/api/user/user-id').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });
});
