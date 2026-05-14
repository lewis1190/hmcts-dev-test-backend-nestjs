import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebase: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers?.authorization;
    if (!auth) throw new UnauthorizedException('No authorization header');
    const match = auth.match(/^Bearer (.+)$/);
    if (!match) throw new UnauthorizedException('Invalid authorization header');
    const token = match[1];
    try {
      const decoded = await this.firebase.admin.auth().verifyIdToken(token);
      req.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
