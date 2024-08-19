const request = require('supertest');
const { server } = require('../../server.js');


describe('Construction Sites API', () => {
  const TEST_PORT = 8081;
  let testServer;

  beforeAll((done) => {
    server.close();  // Close out server if it is in use... maybe server.js shouldn't listen
    testServer = server.listen(TEST_PORT, () => done());
  });

  afterAll((done) => {
    testServer.close(done);
  });

  describe('POST /construction-sites', () => {
    it('should create a new construction site', async () => {
      const response = await request(testServer)
        .post('/construction-sites')
        .send({
          name: 'Test Site',
          volume: 100,
          cost: 5000,
          color: '#FF0000',
          deliveryDate: '2024-08-01T00:00:00Z'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Site');
    });
  });

  describe('GET /construction-sites', () => {
    it('should return a list of construction sites', async () => {
      const response = await request(testServer).get('/construction-sites');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /construction-sites/:id', () => {
    it('should return a single construction site by ID', async () => {

      const createResponse = await request(testServer)
        .post('/construction-sites')
        .send({
          name: 'Single Site',
          volume: 50,
          cost: 2500,
          color: '#00FF00',
          deliveryDate: '2024-08-01T00:00:00Z'
        });

      const siteId = createResponse.body.id;

      // GET Response
      const response = await request(testServer).get(`/construction-sites/${siteId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(siteId);
      expect(response.body.name).toBe('Single Site');
    });

    it('should return 404 for an impossible/invalid ID', async () => {
      const response = await request(testServer).get('/construction-sites/impossible-id-string');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /construction-sites/:id', () => {
    it('should update a construction site', async () => {
      const createResponse = await request(testServer)
        .post('/construction-sites')
        .send({
          name: 'Update Site',
          volume: 70,
          cost: 3000,
          color: '#0000FF',
          deliveryDate: '2024-08-03T00:00:01Z'
        });

      const siteId = createResponse.body.id;

      // Update
      const updateResponse = await request(testServer)
        .put(`/construction-sites/${siteId}`)
        .send({
          name: 'Updated Site',
          volume: 75,
          cost: 3200,
          color: '#FF00FF',
          deliveryDate: '2024-09-23T00:00:00Z'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.name).toBe('Updated Site');
    });
  });

  describe('DELETE /construction-sites/:id', () => {
    it('should delete a construction site', async () => {
      const createResponse = await request(testServer)
        .post('/construction-sites')
        .send({
          name: 'Delete Site',
          volume: 80,
          cost: 4004,
          color: '#FFFF00',
          deliveryDate: '2024-08-19T00:00:00Z'
        });

      const siteId = createResponse.body.id;

      // Delete
      const deleteResponse = await request(testServer).delete(`/construction-sites/${siteId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Construction site deleted.' });
    });

    it('should return 404 for an impossible/invalid ID', async () => {
      const response = await request(testServer).delete('/construction-sites/impossible-id-string');

      expect(response.status).toBe(404);
    });
  });
});
