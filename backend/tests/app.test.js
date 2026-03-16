const request = require('supertest');
const app = require('../server');

describe('GET /api/hello', () => {
  it('responds with Hello World', async () => {
    const response = await request(app).get('/api/hello');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Hello World from Backend!');
  });
});
