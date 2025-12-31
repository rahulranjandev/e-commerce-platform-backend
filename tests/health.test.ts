import request from 'supertest';

import app from '../src/app';

describe('Health route', () => {
  it('returns healthy status', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBeDefined();
  });
});
