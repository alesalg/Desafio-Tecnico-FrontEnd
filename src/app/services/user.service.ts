import { Injectable, signal, inject } from '@angular/core';
import { User } from '../models/user.model';
import { MOCK_USERS } from '../mocks/users.mock';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly STORAGE_KEY = 'app_users';

  private usersSignal = signal<User[]>(this.loadFromStorage());
  readonly users = this.usersSignal.asReadonly();

  private loadFromStorage(): User[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_USERS;
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usersSignal()));
  }

  getById(id: string): User | undefined {
    return this.usersSignal().find(u => u.id === id);
  }

  add(user: Omit<User, 'id'>): void {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID()
    };
    this.usersSignal.update(list => [...list, newUser]);
    this.saveToStorage();
  }

  update(id: string, data: Partial<User>): void {
    this.usersSignal.update(list =>
      list.map(u => u.id === id ? { ...u, ...data } : u)
    );
    this.saveToStorage();
  }

  remove(id: string): void {
    this.usersSignal.update(list => list.filter(u => u.id !== id));
    this.saveToStorage();
  }
}
