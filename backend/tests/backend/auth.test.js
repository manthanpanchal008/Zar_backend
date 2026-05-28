const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../models/userModel', () => ({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  listUsers: jest.fn(),
}));

jest.mock('../../models/metaModel', () => ({
  listUserRoles: jest.fn().mockResolvedValue(['admin', 'staff']),
}));

jest.mock('../../models/productModel', () => ({
  listProducts: jest.fn().mockResolvedValue([]),
  findProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProductById: jest.fn(),
  deleteProductById: jest.fn(),
}));

jest.mock('../../models/jewelModel', () => ({
  listJewels: jest.fn().mockResolvedValue([]),
  listJewelsForCategorySelection: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/subcategoryModel', () => ({
  listSubcategories: jest.fn().mockResolvedValue([]),
  listSubcategoriesForSelectionByCategoryId: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/eventModel', () => ({
  countEvents: jest.fn().mockResolvedValue(0),
  listEvents: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/contactModel', () => ({
  listContacts: jest.fn().mockResolvedValue([]),
  createContact: jest.fn(),
}));

const userModel = require('../../models/userModel');
const app = require('../../app');

describe('JWT authentication API', () => {
  test('rejects missing credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/required/i);
  });

  test('rejects invalid credentials', async () => {
    userModel.findUserByEmail.mockResolvedValue(null);

    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
  });

  test('returns token and safe user for valid credentials', async () => {
    userModel.findUserByEmail.mockResolvedValue({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      password: await bcrypt.hash('secret123', 4),
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'secret123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.password).toBeUndefined();
  });

  test('protects /api/auth/me with bearer token', async () => {
    userModel.findUserById.mockResolvedValue({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' });
    const token = jwt.sign({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }, process.env.JWT_SECRET || 'your-jwt-secret-change-in-production');

    const response = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe('admin@example.com');
  });
});
