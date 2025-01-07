const request = require('supertest');
const express = require('express');
const fridgeRouter = require('../src/fridge/fridgeRouter');
const mongoose = require('mongoose');
const FridgeItem = require('../src/fridge/fridgeItemModel');

const app = express();
app.use(express.json());
app.use('/fridge', fridgeRouter);

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/fridge_test_db`;
  try {
    await mongoose.connect(url);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
}, 30000); // Increase timeout for beforeAll hook to 30 seconds

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}, 30000); // Increase timeout for afterAll hook to 30 seconds

describe('Fridge Router', () => {
  it('should add a new item', async () => {
    const newItem = {
      name: 'Milk',
      price: 2.5,
      weight: 1,
      expireDate: '2023-12-31'
    };
    const res = await request(app).post('/fridge/add').send(newItem);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newItem.name);
  });

  it('should get all items', async () => {
    const res = await request(app).get('/fridge/items');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get an item by ID', async () => {
    const item = await FridgeItem.findOne();
    const res = await request(app).get(`/fridge/item/${item._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', item._id.toString());
  });

  it('should update an item', async () => {
    const item = await FridgeItem.findOne();
    const updatedData = { name: 'Updated Milk', price: 3.0 };
    const res = await request(app).put(`/fridge/update/${item._id}`).send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.price).toBe(updatedData.price);
  });

  it('should delete an item', async () => {
    const item = await FridgeItem.findOne();
    const res = await request(app).delete(`/fridge/delete/${item._id}`);
    expect(res.status).toBe(204);
    const deletedItem = await FridgeItem.findById(item._id);
    expect(deletedItem).toBeNull();
  });
}, 30000); // Increase timeout for the test suite to 30 seconds