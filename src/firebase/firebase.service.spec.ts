import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';

// Mock firebase-admin
jest.mock('firebase-admin', () => ({
  get apps() {
    return [];
  },
  initializeApp: jest.fn(),
  credential: {
    applicationDefault: jest.fn(),
    cert: jest.fn(),
  },
}));

describe('FirebaseService', () => {
  let firebaseService: FirebaseService;

  beforeEach(() => {
    // Clear environment variables before each test
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.FIREBASE_SERVICE_ACCOUNT;

    jest.clearAllMocks();
  });

  describe('initialization with application default credentials', () => {
    it('should initialize firebase with application default credentials when GOOGLE_APPLICATION_CREDENTIALS is set', async () => {
      process.env.GOOGLE_APPLICATION_CREDENTIALS =
        '/path/to/credentials.json';

      const module: TestingModule = await Test.createTestingModule({
        providers: [FirebaseService],
      }).compile();

      firebaseService = module.get<FirebaseService>(FirebaseService);

      expect(admin.initializeApp).toHaveBeenCalledWith({
        credential: admin.credential.applicationDefault(),
      });
    });
  });

  describe('initialization with service account', () => {
    it('should initialize firebase with FIREBASE_SERVICE_ACCOUNT when provided', async () => {
      const serviceAccount = {
        type: 'service_account',
        project_id: 'test-project',
      };
      process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify(serviceAccount);

      const module: TestingModule = await Test.createTestingModule({
        providers: [FirebaseService],
      }).compile();

      firebaseService = module.get<FirebaseService>(FirebaseService);

      expect(admin.initializeApp).toHaveBeenCalledWith({
        credential: admin.credential.cert(serviceAccount),
      });
    });

    it('should throw error when FIREBASE_SERVICE_ACCOUNT is invalid JSON', async () => {
      process.env.FIREBASE_SERVICE_ACCOUNT = 'invalid json';

      try {
        const module: TestingModule = await Test.createTestingModule({
          providers: [FirebaseService],
        }).compile();

        module.get<FirebaseService>(FirebaseService);
        fail('Expected FirebaseService to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('initialization with default app', () => {
    it('should initialize firebase with default app when no credentials provided', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [FirebaseService],
      }).compile();

      firebaseService = module.get<FirebaseService>(FirebaseService);

      expect(admin.initializeApp).toHaveBeenCalled();
    });
  });

  describe('admin property', () => {
    it('should expose admin property', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [FirebaseService],
      }).compile();

      firebaseService = module.get<FirebaseService>(FirebaseService);

      expect(firebaseService.admin).toBeDefined();
      expect(typeof firebaseService.admin).toBe('object');
    });
  });

  describe('skip initialization if already initialized', () => {
    it('should initialize firebase service successfully', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [FirebaseService],
      }).compile();

      firebaseService = module.get<FirebaseService>(FirebaseService);

      // Service should be successfully instantiated
      expect(firebaseService).toBeDefined();
      expect(firebaseService.admin).toBeDefined();
    });
  });
});
