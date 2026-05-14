import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  public admin: typeof admin;

  constructor() {
    this.admin = admin;
    if (!admin.apps.length) {
      const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (serviceAccountPath) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        this.logger.log('Initialized Firebase Admin using application default credentials');
      } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
          const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as string;
          admin.initializeApp({
            credential: admin.credential.cert(parsed),
          });
          this.logger.log('Initialized Firebase Admin using FIREBASE_SERVICE_ACCOUNT');
        } catch (err) {
          this.logger.error('Invalid FIREBASE_SERVICE_ACCOUNT JSON', err as any);
          throw err;
        }
      } else {
        admin.initializeApp();
        this.logger.log('Initialized Firebase Admin with default app');
      }
    }
  }
}
