const jwt = require('jsonwebtoken');

describe('JWT Service', () => {
  const payload = { userId: '12345' };
  const secret = 'your_super_secret_jwt_key_2024'; // test-only secret

  test('should generate a valid JWT token', () => {
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    expect(token).toBeDefined();
  });

  test('should verify a valid JWT token', () => {
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);

    expect(decoded.userId).toBe(payload.userId);
  });

  test('should fail for expired token', () => {
    const token = jwt.sign(payload, secret, { expiresIn: '1ms' });

    expect(() => {
      jwt.verify(token, secret);
    }).toThrow();
  });
});
