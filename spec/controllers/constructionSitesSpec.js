const { randomUUID } = require('crypto');
const request = require('supertest');
const createServer = require('../../server.js');


describe('Construction Sites API', () => {
  const TEST_PORT = 8081;
  let testServer;
  

  beforeAll((done) => {
    testServer = createServer(TEST_PORT);
    return done();
  });

  afterAll((done) => {
    testServer.close(done);
  });
  
  /**
   * Valid UUID expectations.
   * @param {string} uuid 
   * @returns {bool}
   */
  const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };
  
  /**
 * Generates a random UUID that is not already present in the construction-sites database.
 * Will try up to 10 times and print a warning if no unused UUID is found.
 * @param {Object} server - The test server instance.
 * @returns {Promise<string>} - A promise that resolves to a random unused UUID.
 */
const getRandomUnusedId = async (server) => {
  // First, check if anything is in the database
  let response = await request(server).get('/construction-sites');

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);

  let randomUnusedId = randomUUID();
  let attempts = 0;

  // Try to find an unused UUID up to 10 times
  while (response.body.some(site => site.id === randomUnusedId)) {
    randomUnusedId = randomUUID();
    attempts += 1;
    
    if (attempts >= 10) {
      console.warn('Warning: Could not find an unused UUID after 10 attempts. Something is probably wrong.');
      break;
    }
  }

  return randomUnusedId;
};

  describe('POST /construction-sites', () => {
    it('should create a new construction site with a valid UUID', async () => {
      const response = await request(testServer)
        .post('/construction-sites')
        .send({
          name: 'Test Site',
          volume: 100,
          cost: 5000,
          color: '#FF0000',
          delivery_date: '2024-08-01T00:00:00Z'
        });

      expect(response.status).toBe(201);
      expect(isValidUUID(response.body.id)).toBe(true);
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
          delivery_date: '2024-08-01T00:00:00Z'
        });

      const siteId = createResponse.body.id;

      // GET Response
      const response = await request(testServer).get(`/construction-sites/${siteId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(siteId);
      expect(response.body.name).toBe('Single Site');
    });

    it('should return 500 for an impossible/invalid ID', async () => {
      const response = await request(testServer).get('/construction-sites/impossible-id-string');

      expect(response.status).toBe(500);
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
          delivery_date: '2024-08-03T00:00:01Z'
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
          delivery_date: '2024-09-23T00:00:00Z'
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
          delivery_date: '2024-08-19T00:00:00Z'
        });

      const siteId = createResponse.body.id;

      // Delete
      const deleteResponse = await request(testServer).delete(`/construction-sites/${siteId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Construction site deleted.' });
    });

    it('should return 404 for a valid, unused ID', async () => {
      const randomUnusedId = await getRandomUnusedId(testServer);
      
      const response = await request(testServer).delete(`/construction-sites/${randomUnusedId}`);

      expect(response.status).toBe(404);
    });
    
    it('should return 500 for an impossible/invalid UUID format', async () => {
      const response = await request(testServer).delete('/construction-sites/impossible-id-string');

      expect(response.status).toBe(500);
    });
  });
});
