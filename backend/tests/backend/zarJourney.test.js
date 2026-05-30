const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../models/userModel', () => ({
  findUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }),
  listUsers: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/metaModel', () => ({
  listUserRoles: jest.fn().mockResolvedValue(['admin', 'staff']),
}));

jest.mock('../../models/eventModel', () => ({
  countEvents: jest.fn().mockResolvedValue(0),
  listEvents: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/zarJourneyModel', () => ({
  listJourneys: jest.fn(),
  findJourneyById: jest.fn(),
  createJourney: jest.fn(),
  updateJourneyById: jest.fn(),
  deleteJourneyById: jest.fn(),
}));

const zarJourneyModel = require('../../models/zarJourneyModel');
const app = require('../../app');

function adminToken() {
  return jwt.sign(
    { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'
  );
}

describe('Zar Journey API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/public/zar-journey lists journeys without auth', async () => {
    zarJourneyModel.listJourneys.mockResolvedValue([
      { id: 1, year: 2024, description: 'Started the journey', image: 'test.jpg' }
    ]);

    const response = await request(app).get('/api/public/zar-journey');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].year).toBe(2024);
  });

  test('GET /api/zar-journey requires auth', async () => {
    const response = await request(app).get('/api/zar-journey');
    expect(response.status).toBe(401);
  });

  test('GET /api/zar-journey with token returns list', async () => {
    zarJourneyModel.listJourneys.mockResolvedValue([
      { id: 1, year: 2024, description: 'Started the journey', image: 'test.jpg' }
    ]);

    const response = await request(app)
      .get('/api/zar-journey')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('GET /api/zar-journey/:id returns individual journey', async () => {
    zarJourneyModel.findJourneyById.mockResolvedValue({
      id: 1, year: 2024, description: 'Started the journey', image: 'test.jpg'
    });

    const response = await request(app)
      .get('/api/zar-journey/1')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.item.year).toBe(2024);
  });

  test('POST /api/zar-journey fails if missing required fields', async () => {
    const response = await request(app)
      .post('/api/zar-journey')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({ year: 2024, description: '' });

    expect(response.status).toBe(400);
  });

  test('DELETE /api/zar-journey/:id deletes journey', async () => {
    zarJourneyModel.findJourneyById.mockResolvedValue({
      id: 1, year: 2024, description: 'Started the journey', image: 'test.jpg'
    });

    const response = await request(app)
      .delete('/api/zar-journey/1')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(zarJourneyModel.deleteJourneyById).toHaveBeenCalledWith('1');
  });
});
