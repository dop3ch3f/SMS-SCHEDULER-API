const request = require('supertest');
const app = require("../../server");

describe("User Endpoints", () => {
    it("Should create a new user", async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                "name": "test1",
                "password": "secret",
                "phone": "+2348145126202"
            });

        expect(res.status).toEqual(200);
        expect(res.body.status).toEqual(true);
    });
});