import request from 'supertest';

import app from '../src/app';

describe('Vector search route', () => {
  it('returns search results', async () => {
    const res = await request(app).post('/vsearch').send({ vs: 'shoes' }).query({ vs: 'shoes' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
