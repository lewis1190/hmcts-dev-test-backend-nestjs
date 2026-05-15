import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Module({
  imports: [FirebaseModule],
  providers: [TaskService, FirebaseAuthGuard],
  controllers: [TaskController],
})
export class TaskModule {}
