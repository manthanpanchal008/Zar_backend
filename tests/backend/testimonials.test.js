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

jest.mock('../../models/testimonialModel', () => ({
  listTestimonials: jest.fn(),
  findTestimonialById: jest.fn(),
  createTestimonial: jest.fn(),
  updateTestimonialById: jest.fn(),
  deleteTestimonialById: jest.fn(),
}));

jest.mock('../../models/eventModel', () => ({
  countEvents: jest.fn().mockResolvedValue(0),
  listEvents: jest.fn().mockResolvedValue([]),
}));

const testimonialModel = require('../../models/testimonialModel');
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

describe('Testimonials API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/testimonials lists testimonials without auth', async () => {
    testimonialModel.listTestimonials.mockResolvedValue([
      { id: 1, name: 'John Doe', comment: 'Great service!', position: 'CEO', companyName: 'Acme Corp' }
    ]);

    const response = await request(app).get('/api/testimonials');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].name).toBe('John Doe');
  });

  test('GET /api/testimonials/:id gets testimonial by id without auth', async () => {
    testimonialModel.findTestimonialById.mockResolvedValue({
      id: 1,
      name: 'John Doe',
      comment: 'Great service!',
      position: 'CEO',
      companyName: 'Acme Corp'
    });

    const response = await request(app).get('/api/testimonials/1');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.item.name).toBe('John Doe');
  });

  test('GET /api/testimonials/:id returns 404 if not found', async () => {
    testimonialModel.findTestimonialById.mockResolvedValue(null);

    const response = await request(app).get('/api/testimonials/999');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/testimonials requires admin auth', async () => {
    const response = await request(app).post('/api/testimonials').send({
      name: 'Jane Doe',
      comment: 'Excellent!',
    });

    expect(response.status).toBe(401);
  });

  test('POST /api/testimonials rejects staff role', async () => {
    require('../../models/userModel').findUserById.mockResolvedValueOnce({ id: 2, name: 'Staff', email: 'staff@example.com', role: 'staff' });

    const response = await request(app)
      .post('/api/testimonials')
      .set('Authorization', `Bearer ${staffToken()}`)
      .send({
        name: 'Jane Doe',
        comment: 'Excellent!',
      });

    expect(response.status).toBe(403);
  });

  test('POST /api/testimonials validates required fields', async () => {
    const response = await request(app)
      .post('/api/testimonials')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        name: '',
        comment: 'Excellent!',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/name/i);
  });

  test('POST /api/testimonials creates testimonial', async () => {
    testimonialModel.createTestimonial.mockResolvedValue(10);
    testimonialModel.findTestimonialById.mockResolvedValue({
      id: 10,
      name: 'Jane Doe',
      comment: 'Excellent!',
      position: 'Designer',
      companyName: 'Stellar'
    });

    const response = await request(app)
      .post('/api/testimonials')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        name: 'Jane Doe',
        comment: 'Excellent!',
        position: 'Designer',
        companyName: 'Stellar'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.item.name).toBe('Jane Doe');
    expect(testimonialModel.createTestimonial).toHaveBeenCalledWith({
      name: 'Jane Doe',
      comment: 'Excellent!',
      position: 'Designer',
      companyName: 'Stellar'
    });
  });

  test('PUT /api/testimonials/:id updates testimonial', async () => {
    testimonialModel.findTestimonialById.mockResolvedValue({
      id: 10,
      name: 'Jane Doe',
      comment: 'Excellent!'
    });

    const response = await request(app)
      .put('/api/testimonials/10')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        name: 'Jane Smith',
        comment: 'Brilliant!',
        position: 'Manager',
        companyName: 'Acme'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(testimonialModel.updateTestimonialById).toHaveBeenCalledWith('10', {
      name: 'Jane Smith',
      comment: 'Brilliant!',
      position: 'Manager',
      companyName: 'Acme'
    });
  });

  test('DELETE /api/testimonials/:id deletes testimonial', async () => {
    testimonialModel.findTestimonialById.mockResolvedValue({
      id: 10,
      name: 'Jane Doe',
      comment: 'Excellent!'
    });

    const response = await request(app)
      .delete('/api/testimonials/10')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(testimonialModel.deleteTestimonialById).toHaveBeenCalledWith('10');
  });
});
