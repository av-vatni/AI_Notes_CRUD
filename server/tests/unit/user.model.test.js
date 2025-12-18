const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {

  test('should create user with hashed password', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'plaintext123'
    });

    expect(user._id).toBeDefined();
    expect(user.password).not.toBe('plaintext123');
  });

  test('should require email field', async () => {
    let error;

    try {
      await User.create({
        username: 'testuser',
        password: 'test123'
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  test('should require password field', async () => {
    let error;

    try {
      await User.create({
        username: 'testuser',
        email: 'test@example.com'
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

});
