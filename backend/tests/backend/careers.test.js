const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../models/userModel', () => ({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }),
  listUsers: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/metaModel', () => ({
  listUserRoles: jest.fn().mockResolvedValue(['admin', 'staff']),
}));

jest.mock('../../models/careerModel', () => ({
  listCareers: jest.fn(),
  findCareerById: jest.fn(),
  createCareer: jest.fn(),
  updateCareerById: jest.fn(),
  deleteCareerById: jest.fn(),
}));

jest.mock('../../models/eventModel', () => ({
  countEvents: jest.fn().mockResolvedValue(0),
  listEvents: jest.fn().mockResolvedValue([]),
}));

const careerModel = require('../../models/careerModel');
const app = require('../../app');

function adminToken() {
  return jwt.sign(
    { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'
  );
}

function staffToken() {
  return jwt.sign(
    { id: 2, name: 'Staff', email: 'staff@example.com', role: 'staff' },
    process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'
  );
}

describe('Careers API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/careers lists careers without auth', async () => {
    careerModel.listCareers.mockResolvedValue([
      { id: 1, position: 'QA Engineer', experience: '3 Years', location: 'Mumbai', jobDescription: 'Test everything.' }
    ]);

    const response = await request(app).get('/api/careers');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].position).toBe('QA Engineer');
  });

  test('GET /api/careers/:id gets career by id without auth', async () => {
    careerModel.findCareerById.mockResolvedValue({
      id: 1,
      position: 'QA Engineer',
      experience: '3 Years',
      location: 'Mumbai',
      jobDescription: 'Test everything.'
    });

    const response = await request(app).get('/api/careers/1');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.item.position).toBe('QA Engineer');
  });

  test('GET /api/careers/:id returns 404 if not found', async () => {
    careerModel.findCareerById.mockResolvedValue(null);

    const response = await request(app).get('/api/careers/999');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/careers requires admin auth', async () => {
    const response = await request(app).post('/api/careers').send({
      position: 'QA Engineer',
      experience: '3 Years',
      location: 'Mumbai',
      jobDescription: 'Test everything.'
    });

    expect(response.status).toBe(401);
  });

  test('POST /api/careers rejects staff role', async () => {
    require('../../models/userModel').findUserById.mockResolvedValueOnce({ id: 2, name: 'Staff', email: 'staff@example.com', role: 'staff' });

    const response = await request(app)
      .post('/api/careers')
      .set('Authorization', `Bearer ${staffToken()}`)
      .send({
        position: 'QA Engineer',
        experience: '3 Years',
        location: 'Mumbai',
        jobDescription: 'Test everything.'
      });

    expect(response.status).toBe(403);
  });

  test('POST /api/careers validates required fields', async () => {
    const response = await request(app)
      .post('/api/careers')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        position: '',
        experience: '3 Years',
        location: 'Mumbai',
        jobDescription: 'Test everything.'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/position/i);
  });

  test('POST /api/careers creates career listing', async () => {
    careerModel.createCareer.mockResolvedValue(10);
    careerModel.findCareerById.mockResolvedValue({
      id: 10,
      position: 'QA Engineer',
      experience: '3 Years',
      location: 'Mumbai',
      jobDescription: 'Test everything.'
    });

    const response = await request(app)
      .post('/api/careers')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        position: 'QA Engineer',
        experience: '3 Years',
        location: 'Mumbai',
        jobDescription: 'Test everything.'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.item.position).toBe('QA Engineer');
    expect(careerModel.createCareer).toHaveBeenCalledWith({
      position: 'QA Engineer',
      experience: '3 Years',
      location: 'Mumbai',
      jobDescription: 'Test everything.'
    });
  });

  test('PUT /api/careers/:id updates career listing', async () => {
    careerModel.findCareerById.mockResolvedValue({
      id: 10,
      position: 'QA Engineer',
      experience: '3 Years',
      location: 'Mumbai',
      jobDescription: 'Test everything.'
    });

    const response = await request(app)
      .put('/api/careers/10')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        position: 'Senior QA Engineer',
        experience: '5 Years',
        location: 'Delhi',
        jobDescription: 'Test all components.'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(careerModel.updateCareerById).toHaveBeenCalledWith('10', {
      position: 'Senior QA Engineer',
      experience: '5 Years',
      location: 'Delhi',
      jobDescription: 'Test all components.'
    });
  });

  test('DELETE /api/careers/:id deletes career listing', async () => {
    careerModel.findCareerById.mockResolvedValue({
      id: 10,
      position: 'QA Engineer',
      experience: '3 Years'
    });

    const response = await request(app)
      .delete('/api/careers/10')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(careerModel.deleteCareerById).toHaveBeenCalledWith('10');
  });
});
