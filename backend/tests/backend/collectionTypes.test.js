const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../models/userModel', () => ({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }),
  listUsers: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/collectionTypeModel', () => ({
  listCollectionTypes: jest.fn(),
  findCollectionTypeById: jest.fn(),
  createCollectionType: jest.fn(),
  updateCollectionTypeById: jest.fn(),
  deleteCollectionTypeById: jest.fn(),
}));

const collectionTypeModel = require('../../models/collectionTypeModel');
const app = require('../../app');

function adminToken() {
  return jwt.sign(
    { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'
  );
}

describe('Collection Types API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/admin/collection-types lists collection types with auth', async () => {
    collectionTypeModel.listCollectionTypes.mockResolvedValue([
      { id: 1, name: 'Handmade', image: 'handmade.jpg', is_active: 1 }
    ]);

    const response = await request(app)
      .get('/api/admin/collection-types')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].name).toBe('Handmade');
  });

  test('POST /api/admin/collection-types requires validation', async () => {
    const response = await request(app)
      .post('/api/admin/collection-types')
      .set('Authorization', `Bearer ${adminToken()}`)
      .field('name', '');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/admin/collection-types creates collection type', async () => {
    collectionTypeModel.createCollectionType.mockResolvedValue(12);
    collectionTypeModel.findCollectionTypeById.mockResolvedValue({
      id: 12,
      name: 'Machine Made',
      image: 'machine.jpg',
      is_active: 1
    });

    const response = await request(app)
      .post('/api/admin/collection-types')
      .set('Authorization', `Bearer ${adminToken()}`)
      .field('name', 'Machine Made')
      .attach('image', Buffer.from('mock image'), { filename: 'machine.jpg', contentType: 'image/jpeg' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.item.name).toBe('Machine Made');
  });
});
