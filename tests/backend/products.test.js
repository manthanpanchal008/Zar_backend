const request = require('supertest');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

jest.mock('../../models/userModel', () => ({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }),
  listUsers: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/metaModel', () => ({
  listUserRoles: jest.fn().mockResolvedValue(['admin', 'staff']),
}));

jest.mock('../../models/productModel', () => ({
  listProducts: jest.fn(),
  findProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProductById: jest.fn(),
  deleteProductById: jest.fn(),
  findProductBySku: jest.fn().mockResolvedValue(null),
}));

jest.mock('../../models/categoryModel', () => ({
  listCategories: jest.fn().mockResolvedValue([]),
  listCategoriesForSelection: jest.fn().mockResolvedValue([{ id: 10, name: 'Bangles', slug: 'bangles' }]),
  findCategoryById: jest.fn().mockResolvedValue({ id: 10, name: 'Bangles', slug: 'bangles' }),
}));

jest.mock('../../models/goldTypeModel', () => ({
  listGoldTypes: jest.fn().mockResolvedValue([]),
  listGoldTypesForSelection: jest.fn().mockResolvedValue([{ id: 20, name: '22K', purity: 91.6 }]),
  findGoldTypeById: jest.fn().mockResolvedValue({ id: 20, name: '22K', purity: 91.6 }),
}));

jest.mock('../../models/makingTypeModel', () => ({
  listMakingTypes: jest.fn().mockResolvedValue([]),
  listMakingTypesForSelection: jest.fn().mockResolvedValue([{ id: 30, name: 'Handmade' }]),
  findMakingTypeById: jest.fn().mockResolvedValue({ id: 30, name: 'Handmade' }),
}));

jest.mock('../../models/eventModel', () => ({
  countEvents: jest.fn().mockResolvedValue(0),
  listEvents: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../models/contactModel', () => ({
  listContacts: jest.fn().mockResolvedValue([]),
  createContact: jest.fn(),
}));

const productModel = require('../../models/productModel');
const app = require('../../app');
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'products');

function adminToken() {
  return jwt.sign({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }, process.env.JWT_SECRET || 'your-jwt-secret-change-in-production');
}

describe('Admin product API', () => {
  afterEach(() => {
    if (!fs.existsSync(uploadDir)) return;
    for (const file of fs.readdirSync(uploadDir)) {
      if (file.endsWith('ring.png')) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    }
  });

  test('requires authentication for product list', async () => {
    const response = await request(app).get('/api/admin/products');

    expect(response.status).toBe(401);
  });

  test('lists products as JSON', async () => {
    productModel.listProducts.mockResolvedValue([
      {
        id: 1,
        title: 'Gold Ring',
        collection_name: 'Bridal',
        category_id: 10,
        gold_type_id: 20,
        making_type_id: 30,
        product_images: ['ring.jpg'],
      },
    ]);

    const response = await request(app).get('/api/admin/products').set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.items[0].product_images[0]).toBe('/uploads/products/ring.jpg');
  });

  test('validates image uploads', async () => {
    const response = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken()}`)
      .field('category_id', '10')
      .field('gold_type_id', '20')
      .field('making_type_id', '30')
      .field('title', 'Gold Ring')
      .field('collection_name', 'Bridal')
      .field('number_of_pcs', '1')
      .attach('images', Buffer.from('not-an-image'), { filename: 'bad.txt', contentType: 'text/plain' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/image/i);
  });

  test('creates product with valid multipart payload', async () => {
    productModel.createProduct.mockResolvedValue(99);
    productModel.findProductById.mockResolvedValue({
      id: 99,
      title: 'Gold Ring',
      collection_name: 'Bridal',
      category_id: 10,
      gold_type_id: 20,
      making_type_id: 30,
      product_images: ['ring.png'],
    });

    const response = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken()}`)
      .field('category_id', '10')
      .field('gold_type_id', '20')
      .field('making_type_id', '30')
      .field('title', 'Gold Ring')
      .field('collection_name', 'Bridal')
      .field('number_of_pcs', '1')
      .attach('images', Buffer.from('image'), { filename: 'ring.png', contentType: 'image/png' });

    expect(response.status).toBe(201);
    expect(productModel.createProduct).toHaveBeenCalledWith(expect.objectContaining({ title: 'Gold Ring' }));
  });

  test('allows admin but blocks staff from destructive product actions', async () => {
    const staffToken = jwt.sign({ id: 2, name: 'Staff', email: 'staff@example.com', role: 'staff' }, process.env.JWT_SECRET || 'your-jwt-secret-change-in-production');
    require('../../models/userModel').findUserById.mockResolvedValueOnce({ id: 2, name: 'Staff', email: 'staff@example.com', role: 'staff' });

    const response = await request(app).delete('/api/admin/products/99').set('Authorization', `Bearer ${staffToken}`);

    expect(response.status).toBe(403);
  });
});
