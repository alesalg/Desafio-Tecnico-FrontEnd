import { Injectable, signal, computed } from '@angular/core';
import { User, LoginRequest, LoginResponse } from '../models/user.model';
import { MOCK_USERS } from '../mocks/users.mock';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private currentUserSignal = signal<Omit<User, 'password'> | null>(this.loadUserFromStorage());
  private tokenSignal = signal<string | null>(this.loadTokenFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  private loadTokenFromStorage(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUserFromStorage(): Omit<User, 'password'> | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  login(credentials: LoginRequest): LoginResponse | null {
    const users = this.getStoredUsers();
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) return null;

    const token = this.generateToken();
    const { password, ...userWithoutPassword } = user;

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));

    this.tokenSignal.set(token);
    this.currentUserSignal.set(userWithoutPassword);

    return { token, user: userWithoutPassword };
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
  }

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem('app_users');
    return stored ? JSON.parse(stored) : MOCK_USERS;
  }
}
