import request from 'supertest';
import App from '../app.js';

describe('Health Check', () => {
  let app: any;

  beforeAll(async () => {
    const appInstance = new App();
    await appInstance.initialize();
    app = appInstance.getExpressApp();
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.version).toBeDefined();
    });
  });

  describe('GET /api/health', () => {
    it('should return detailed health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.database).toBe('connected');
      expect(response.body.environment).toBeDefined();
      expect(response.body.version).toBeDefined();
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.message).toContain('MovieFlix Dashboard API');
      expect(response.body.version).toBeDefined();
      expect(response.body.docs).toBeDefined();
    });
  });

  describe('GET /api', () => {
    it('should return API endpoints information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('MovieFlix Dashboard API');
      expect(response.body.endpoints).toBeDefined();
      expect(response.body.endpoints.movies).toBeDefined();
      expect(response.body.endpoints.auth).toBeDefined();
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
    });
  });
});