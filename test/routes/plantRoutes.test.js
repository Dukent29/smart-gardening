// test/routes/plantRoutes.test.js
const request = require('supertest');
const app = require('../../server'); // this is your Express app

describe('POST /api/plants/add-plant', () => {
    test('should add a new plant and return success', async () => {
        const mockToken = '7b73998dc3d8fe9968f502727323fb99b0e73b186b647c2e7b2cb55c436d225a2404f6be13bd2f154615527bf5e91170aa11b2c67c50be4148330dd842619314';
        const response = await request(app)
            .post('/api/plants/add-plant')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({
                plant_name: '',
                user_id: 1,
                is_automatic: true,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toMatch(/added/i);
    });
});
