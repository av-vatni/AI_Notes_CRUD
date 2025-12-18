const request = require('supertest');
const app = require('../../app');

let token;

beforeEach(async () => {
  const res = await request(app)
  .post('/api/auth/register')
  .send({
    username: 'noteuser',
    email: `note_${Date.now()}@example.com`,
    password: 'password123'
  });

  token = res.body.token;
});

describe('Note Routes', () => {

  test('should create a note (authenticated)', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Integration Test Note',
        content: 'Testing notes API'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Integration Test Note');
  });

  test('should fetch user notes', async () => {
    await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Note 1',
        content: 'Content 1'
      });

    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('should reject unauthenticated request', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({
        title: 'Fail Note',
        content: 'No token'
      });

    expect(res.statusCode).toBe(401);
  });
});
