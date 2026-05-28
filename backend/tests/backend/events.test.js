const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../models/userModel', () => ({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }),
  listUsers: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/eventModel', () => ({
  listEvents: jest.fn(),
  findEventById: jest.fn(),
  createEvent: jest.fn(),
  updateEventById: jest.fn(),
  deleteEventById: jest.fn(),
}));

const eventModel = require('../../models/eventModel');
const app = require('../../app');

function adminToken() {
  return jwt.sign(
    { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'
  );
}

describe('Events API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/admin/events lists events with auth', async () => {
    eventModel.listEvents.mockResolvedValue([
      { id: 1, title: 'Gold Expo', status: 'upcoming' }
    ]);

    const response = await request(app)
      .get('/api/admin/events')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].title).toBe('Gold Expo');
  });

  test('POST /api/admin/events validates date ranges (end_date < start_date)', async () => {
    const response = await request(app)
      .post('/api/admin/events')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        title: 'Expo 2026',
        start_date: '2026-05-26',
        end_date: '2026-05-25', // earlier
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('End date cannot be earlier than start date');
  });

  test('POST /api/admin/events auto-calculates status: upcoming, past, ongoing', async () => {
    eventModel.createEvent.mockResolvedValue(5);

    const format = (date) => date.toISOString().split('T')[0];
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 5);
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 5);
    const longFutureDate = new Date();
    longFutureDate.setDate(today.getDate() + 10);
    const longPastDate = new Date();
    longPastDate.setDate(today.getDate() - 10);

    // 1. Upcoming Event: start_date in future
    let response = await request(app)
      .post('/api/admin/events')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        title: 'Future Expo',
        start_date: format(futureDate),
        end_date: format(longFutureDate),
      });
    expect(response.status).toBe(201);
    expect(eventModel.createEvent).toHaveBeenCalledWith(expect.objectContaining({
      status: 'upcoming'
    }));

    // 2. Past Event: end_date in past
    response = await request(app)
      .post('/api/admin/events')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        title: 'Old Expo',
        start_date: format(longPastDate),
        end_date: format(pastDate),
      });
    expect(response.status).toBe(201);
    expect(eventModel.createEvent).toHaveBeenLastCalledWith(expect.objectContaining({
      status: 'past'
    }));

    // 3. Ongoing Event: start_date in past, end_date in future
    response = await request(app)
      .post('/api/admin/events')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        title: 'Now Expo',
        start_date: format(pastDate),
        end_date: format(futureDate),
      });
    expect(response.status).toBe(201);
    expect(eventModel.createEvent).toHaveBeenLastCalledWith(expect.objectContaining({
      status: 'ongoing'
    }));
  });
});
