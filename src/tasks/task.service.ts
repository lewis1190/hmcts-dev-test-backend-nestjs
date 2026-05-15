import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './interfaces/task.interface';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TaskService {
  private collectionName = 'tasks';

  constructor(private readonly firebase: FirebaseService) { }

  private get collection() {
    return this.firebase.admin.firestore().collection(this.collectionName);
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const now = new Date().toISOString();
    const data: Task = {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      dueDate: dto.dueDate,
      createdAt: now,
      updatedAt: now,
    };
    const ref = await this.collection.add(data as any);
    return { id: ref.id, ...data };
  }

  async findById(id: string): Promise<Task> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) throw new NotFoundException('Task not found');
    return { id: doc.id, ...(doc.data() as Task) };
  }

  async findAll(): Promise<Task[]> {
    const snap = await this.collection.get();
    const tasks = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Task) }));
    return tasks.sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException('Task not found');
    const updatedAt = new Date().toISOString();
    await docRef.update({ status, updatedAt });
    const updated = await docRef.get();
    return { id: updated.id, ...(updated.data() as Task) };
  }

  async update(id: string, updateData: any): Promise<Task> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException('Task not found');
    const updatedAt = new Date().toISOString();
    const dataToUpdate = { ...updateData, updatedAt };
    await docRef.update(dataToUpdate);
    const updated = await docRef.get();
    return { id: updated.id, ...(updated.data() as Task) };
  }

  async delete(id: string): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException('Task not found');
    await docRef.delete();
  }
}
