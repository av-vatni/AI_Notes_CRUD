const request = require('supertest');
const app = require('../../app');

describe('Base Route', () => {
  test('GET / should return API status', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
expect(res.body.status).toBe('online');

  });
});
