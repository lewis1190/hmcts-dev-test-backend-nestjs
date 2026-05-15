import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseService } from '../firebase/firebase.service';

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;
  let firebaseService: FirebaseService;

  const mockDecodedToken = {
    iss: 'https://securetoken.google.com/test-project',
    aud: 'test-project',
    auth_time: 1234567890,
    user_id: 'user-123',
    sub: 'user-123',
    iat: 1234567890,
    exp: 1234571490,
    email: 'test@example.com',
    email_verified: true,
  };

  const mockFirebaseService = {
    admin: {
      auth: jest.fn().mockReturnValue({
        verifyIdToken: jest.fn().mockResolvedValue(mockDecodedToken),
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirebaseAuthGuard,
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
      ],
    }).compile();

    guard = module.get<FirebaseAuthGuard>(FirebaseAuthGuard);
    firebaseService = module.get<FirebaseService>(FirebaseService);

    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true and set user when valid token is provided', async () => {
      const request = {
        headers: {
          authorization: 'Bearer valid-token-123',
        },
      };

      const context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(request.user).toEqual(mockDecodedToken);
      expect(
        firebaseService.admin.auth().verifyIdToken,
      ).toHaveBeenCalledWith('valid-token-123');
    });

    it('should throw UnauthorizedException when no authorization header', async () => {
      const request = {
        headers: {},
      };

      const context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'No authorization header',
      );
    });

    it('should throw UnauthorizedException when authorization header is missing', async () => {
      const request = {
        headers: {
          authorization: undefined,
        },
      };

      const context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when authorization header format is invalid', async () => {
      const request = {
        headers: {
          authorization: 'InvalidFormat',
        },
      };

      const context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid authorization header',
      );
    });

    it('should throw UnauthorizedException when authorization header does not start with Bearer', async () => {
      const request = {
        headers: {
          authorization: 'Basic dXNlcjpwYXNz',
        },
      };

      const context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token verification fails', async () => {
      const request = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      };

      const context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
      } as unknown as ExecutionContext;

      const authError = new Error('Invalid token');
      mockFirebaseService.admin
        .auth()
        .verifyIdToken.mockRejectedValueOnce(authError);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token is expired', async () => {
      const request = {
        headers: {
          authorization: 'Bearer expired-token',
        },
      };

      const context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
      } as unknown as ExecutionContext;

      const expiredError = new Error('Token expired');
      mockFirebaseService.admin
        .auth()
        .verifyIdToken.mockRejectedValueOnce(expiredError);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle Bearer token extraction', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(
        firebaseService.admin.auth().verifyIdToken,
      ).toHaveBeenCalledWith(token);
    });
  });
});
