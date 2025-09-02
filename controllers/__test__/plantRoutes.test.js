// plantRoutes.test.js
const request = require('supertest');
const app = require('../../server'); // adapte le chemin si besoin

test('should add a new plant and return success', async () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJyb2xlIjoiZ2FyZGVuZXIiLCJpYXQiOjE3NTY1MDc4ODcsImV4cCI6MTc1NjUxMTQ4N30.Rhg3lVlJSe0g6bGvYkOwPL8lupwV6_lRY8OHUg6DV7U'; // remplace par un vrai token

  const response = await request(app)
    .post('/api/plants/add-plant')
    .set('Authorization', token)
    .send({ name: 'Ficus' });

  expect(response.statusCode).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.message).toMatch(/added/i);
});