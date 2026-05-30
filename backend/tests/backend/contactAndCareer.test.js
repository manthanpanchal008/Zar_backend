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

jest.mock('../../models/contactInquiryModel', () => ({
  listInquiries: jest.fn(),
  findInquiryById: jest.fn(),
  createInquiry: jest.fn(),
  deleteInquiryById: jest.fn(),
}));

jest.mock('../../models/careerApplicationModel', () => ({
  listApplications: jest.fn(),
  findApplicationById: jest.fn(),
  createApplication: jest.fn(),
  deleteApplicationById: jest.fn(),
}));

jest.mock('../../services/mailService', () => ({
  sendContactInquiryAdminMail: jest.fn().mockResolvedValue(true),
  sendContactInquiryUserThankYouMail: jest.fn().mockResolvedValue(true),
  sendCareerApplicationAdminMail: jest.fn().mockResolvedValue(true),
  sendCareerApplicationUserThankYouMail: jest.fn().mockResolvedValue(true),
}));

const contactInquiryModel = require('../../models/contactInquiryModel');
const careerApplicationModel = require('../../models/careerApplicationModel');
const mailService = require('../../services/mailService');
const app = require('../../app');

function adminToken() {
  return jwt.sign(
    { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'
  );
}

describe('Contact Inquiry API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/contact-inquiry stores submission and sends emails', async () => {
    contactInquiryModel.createInquiry.mockResolvedValue(1);

    const payload = {
      fullName: 'John Doe',
      companyName: 'Luxury Wholesalers',
      email: 'john@example.com',
      contactNumber: '+919999999999',
      inquiryType: 'Distributor Inquiry',
      message: 'Hello, looking to partner.'
    };

    const response = await request(app)
      .post('/api/contact-inquiry')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(contactInquiryModel.createInquiry).toHaveBeenCalled();
    expect(mailService.sendContactInquiryAdminMail).toHaveBeenCalled();
    expect(mailService.sendContactInquiryUserThankYouMail).toHaveBeenCalledWith('john@example.com', 'John Doe');
  });

  test('POST /api/contact-inquiry rejects invalid email', async () => {
    const payload = {
      fullName: 'John Doe',
      companyName: 'Luxury Wholesalers',
      email: 'invalid-email',
      contactNumber: '+919999999999',
      inquiryType: 'Distributor Inquiry',
      message: 'Hello'
    };

    const response = await request(app)
      .post('/api/contact-inquiry')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('GET /api/contact-inquiry requires authorization', async () => {
    const response = await request(app).get('/api/contact-inquiry');
    expect(response.status).toBe(401);
  });

  test('GET /api/contact-inquiry returns list with valid token', async () => {
    contactInquiryModel.listInquiries.mockResolvedValue([{ id: 1, fullName: 'John Doe' }]);

    const response = await request(app)
      .get('/api/contact-inquiry')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.items).toHaveLength(1);
  });
});

describe('Career Application API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/career-application requires a CV file upload', async () => {
    const response = await request(app)
      .post('/api/career-application')
      .send({
        fullName: 'Jane Doe',
        companyName: 'Retail Corp',
        role: 'Sales Representative',
        workExperience: '5 years',
        email: 'jane@example.com',
        contactNumber: '+918888888888'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('CV file is required.');
  });

  test('GET /api/career-application requires authorization', async () => {
    const response = await request(app).get('/api/career-application');
    expect(response.status).toBe(401);
  });

  test('GET /api/career-application returns applications list with token', async () => {
    careerApplicationModel.listApplications.mockResolvedValue([{ id: 1, fullName: 'Jane Doe' }]);

    const response = await request(app)
      .get('/api/career-application')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.items).toHaveLength(1);
  });
});
