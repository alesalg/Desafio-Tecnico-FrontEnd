import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  private router = inject(Router);

  showForm = signal(false);
  editingId = signal<string | null>(null);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  formData = signal({ name: '', email: '', password: '', phone: '' });

  openEdit(user: User): void {
    this.formData.set({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || ''
    });
    this.editingId.set(user.id);
    this.showForm.set(true);
  }

  openEditProfile(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.formData.set({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone || ''
      });
      this.editingId.set(user.id);
      this.showForm.set(true);
    }
  }

  save(): void {
    const data = this.formData();
    if (!data.name || !data.email) {
      this.showToast('Nome e e-mail são obrigatórios.', 'error');
      return;
    }

    const updateData: Partial<User> = {
      name: data.name,
      email: data.email,
      phone: data.phone
    };
    if (data.password) {
      updateData.password = data.password;
    }

    this.userService.update(this.editingId()!, updateData);
    this.showToast('Dados atualizados com sucesso!', 'success');
    this.showForm.set(false);
  }

  removeUser(user: User): void {
    if (user.id === this.authService.currentUser()?.id) {
      this.showToast('Não é possível remover seu próprio usuário.', 'error');
      return;
    }
    this.userService.remove(user.id);
    this.showToast('Usuário removido com sucesso!', 'success');
  }

  cancel(): void {
    this.showForm.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateField(field: string, value: string): void {
    this.formData.update(d => ({ ...d, [field]: value }));
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
