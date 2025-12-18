const request = require('supertest');
const app = require('../../app');

describe('Auth Routes', () => {
  const userData = {
  username: 'testuser',
  email: `test_${Date.now()}@example.com`,
  password: 'password123'
};

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test('should login an existing user', async () => {
    // Register first
    await request(app)
      .post('/api/auth/register')
      .send(userData);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('should reject invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpass'
      });

    expect(res.statusCode).toBe(401);
  });
});
