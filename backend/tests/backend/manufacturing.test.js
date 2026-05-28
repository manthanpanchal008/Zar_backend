const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../models/userModel', () => ({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }),
  listUsers: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/manufacturingModel', () => ({
  listManufacturing: jest.fn(),
  findManufacturingById: jest.fn(),
  createManufacturing: jest.fn(),
  updateManufacturingById: jest.fn(),
  deleteManufacturingById: jest.fn(),
}));

const manufacturingModel = require('../../models/manufacturingModel');
const app = require('../../app');

function adminToken() {
  return jwt.sign(
    { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'
  );
}

describe('Manufacturing API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/admin/manufacturing lists records with auth', async () => {
    manufacturingModel.listManufacturing.mockResolvedValue([
      { id: 1, name: 'Custom Ring Design', description: 'Handcrafted', image: 'ring.jpg', is_active: 1 }
    ]);

    const response = await request(app)
      .get('/api/admin/manufacturing')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].name).toBe('Custom Ring Design');
  });

  test('POST /api/admin/manufacturing requires validation', async () => {
    const response = await request(app)
      .post('/api/admin/manufacturing')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        name: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/admin/manufacturing creates a record', async () => {
    manufacturingModel.createManufacturing.mockResolvedValue(5);
    manufacturingModel.findManufacturingById.mockResolvedValue({
      id: 5,
      name: 'Bespoke Bracelet',
      description: 'Custom details',
      image: null,
      is_active: 1
    });

    const response = await request(app)
      .post('/api/admin/manufacturing')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        name: 'Bespoke Bracelet',
        description: 'Custom details',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.item.name).toBe('Bespoke Bracelet');
  });
});
