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

jest.mock('../../models/buildConnectionModel', () => ({
  listConnections: jest.fn(),
  findConnectionById: jest.fn(),
  createConnection: jest.fn(),
  deleteConnectionById: jest.fn(),
}));

jest.mock('../../services/mailService', () => ({
  sendConnectionAdminEmail: jest.fn().mockResolvedValue(true),
  sendConnectionUserThankYouEmail: jest.fn().mockResolvedValue(true),
}));

const buildConnectionModel = require('../../models/buildConnectionModel');
const mailService = require('../../services/mailService');
const app = require('../../app');

function adminToken() {
  return jwt.sign(
    { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'
  );
}

describe('Build Connection API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/build-connection stores submission, sends emails', async () => {
    buildConnectionModel.createConnection.mockResolvedValue(1);

    const payload = {
      fullName: 'John Doe',
      companyName: 'Jewellers Corp',
      email: 'john@example.com',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      pincode: '400001',
      contact: '+919999999999',
      category: 'Distributor',
      referredBy: 'Google',
      companyWebsite: 'https://example.com',
      message: 'Hello'
    };

    const response = await request(app)
      .post('/api/build-connection')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(buildConnectionModel.createConnection).toHaveBeenCalledWith({
      fullName: 'John Doe',
      companyName: 'Jewellers Corp',
      email: 'john@example.com',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      pincode: '400001',
      contact: '+919999999999',
      category: 'Distributor',
      referredBy: 'Google',
      companyWebsite: 'https://example.com',
      message: 'Hello'
    });
    expect(mailService.sendConnectionAdminEmail).toHaveBeenCalled();
    expect(mailService.sendConnectionUserThankYouEmail).toHaveBeenCalledWith('john@example.com', 'John Doe');
  });

  test('POST /api/build-connection validates fields', async () => {
    const payload = {
      fullName: '',
      companyName: 'Jewellers Corp',
      email: 'invalid-email',
      country: 'InvalidCountry',
      state: '',
      city: '',
      pincode: '123',
      contact: 'abc',
      category: 'Other'
    };

    const response = await request(app)
      .post('/api/build-connection')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/build-connection succeeds and defaults state/city to empty strings if they are missing', async () => {
    buildConnectionModel.createConnection.mockResolvedValue(1);

    const response = await request(app)
      .post('/api/build-connection')
      .send({
        fullName: 'John Doe',
        companyName: 'Jewellers Corp',
        email: 'john@example.com',
        country: 'India',
        pincode: '400001',
        contact: '+919999999999',
        category: 'Distributor'
      });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(buildConnectionModel.createConnection).toHaveBeenCalledWith(expect.objectContaining({
      state: '',
      city: ''
    }));
  });

  test('GET /api/build-connection requires auth', async () => {
    const response = await request(app).get('/api/build-connection');
    expect(response.status).toBe(401);
  });

  test('GET /api/build-connection returns inquiries when auth', async () => {
    buildConnectionModel.listConnections.mockResolvedValue([{ id: 1, fullName: 'John Doe' }]);

    const response = await request(app)
      .get('/api/build-connection')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.items).toHaveLength(1);
  });
});
