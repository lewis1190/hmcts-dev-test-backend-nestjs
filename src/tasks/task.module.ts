import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { TempTaskController } from 'src/seed_helpers/add_task';

@Module({
  imports: [FirebaseModule],
  providers: [TaskService, FirebaseAuthGuard],
  controllers: [TaskController, TempTaskController],
})
export class TaskModule {}
