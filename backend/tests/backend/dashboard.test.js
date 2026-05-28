const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock all the required models to prevent actual DB hits during tests
jest.mock('../../models/userModel', () => ({
  listUsers: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
  findUserById: jest.fn(),
}));

jest.mock('../../models/productModel', () => ({
  listProducts: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]),
}));

jest.mock('../../models/goldTypeModel', () => ({
  listGoldTypes: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
}));

jest.mock('../../models/categoryModel', () => ({
  listCategories: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]),
}));

jest.mock('../../models/collectionTypeModel', () => ({
  listCollectionTypes: jest.fn().mockResolvedValue([{ id: 1 }]),
}));

jest.mock('../../models/eventModel', () => ({
  listEvents: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
}));

jest.mock('../../models/testimonialModel', () => ({
  listTestimonials: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]),
}));

jest.mock('../../models/careerModel', () => ({
  listCareers: jest.fn().mockResolvedValue([{ id: 1 }]),
}));

// Mock the db connection pool for manufacturing check
jest.mock('../../config/db', () => ({
  execute: jest.fn().mockResolvedValue([[{ total: 5 }]]),
}));

const userModel = require('../../models/userModel');
const app = require('../../app');

describe('Dashboard statistics API', () => {
  const secret = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
  let token;

  beforeAll(() => {
    token = jwt.sign(
      { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
      secret
    );
  });

  test('rejects request if unauthorized', async () => {
    const response = await request(app).get('/api/admin/dashboard');
    expect(response.status).toBe(401);
  });

  test('returns counts for all dashboard modules when authenticated', async () => {
    userModel.findUserById.mockResolvedValue({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    });

    const response = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.stats).toEqual({
      products: 3,
      goldTypes: 2,
      categories: 4,
      makingTypes: 1,
      collectionTypes: 1,
      users: 2,
      orders: 0,
      events: 2,
      testimonials: 3,
      careers: 1,
      manufacturing: 5,
    });
  });
});
