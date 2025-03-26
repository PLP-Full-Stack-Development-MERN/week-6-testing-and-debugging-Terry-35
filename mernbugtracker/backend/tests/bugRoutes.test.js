// backend/tests/bugRoutes.test.js

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import Bug from '../models/bugs.js';


describe('Bug Tracker API Tests', () => {
    let mongoServer;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
    });

    
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    test('POST /bugs - Should create a new bug', async () => {
        const res = await request(app).post('/bugs').send({
            title: 'Sample Bug',
            description: 'This is a test bug',
            status: 'open'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Sample Bug');
    });

    test('GET /bugs - Should fetch all bugs', async () => {
        const res = await request(app).get('/bugs');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('PUT /bugs/:id - Should update a bug', async () => {
        const bug = new Bug({ title: 'Bug to Update', description: 'Old description', status: 'open' });
        await bug.save();
        
        const res = await request(app).put(`/bugs/${bug._id}`).send({
            description: 'Updated description',
            status: 'in-progress'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.description).toBe('Updated description');
    });

    test('DELETE /bugs/:id - Should delete a bug', async () => {
        const bug = new Bug({ title: 'Bug to Delete', description: 'Will be removed', status: 'open' });
        await bug.save();
        
        const res = await request(app).delete(`/bugs/${bug._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Bug deleted');
    });
});
