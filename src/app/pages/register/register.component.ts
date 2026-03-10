import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  password = signal('');
  phone = signal('');
  error = signal('');
  success = signal('');

  onRegister(): void {
    this.error.set('');
    this.success.set('');

    if (!this.name() || !this.email() || !this.password()) {
      this.error.set('Preencha todos os campos obrigatórios.');
      return;
    }

    const existing = this.userService.users().find(u => u.email === this.email());
    if (existing) {
      this.error.set('E-mail já cadastrado.');
      return;
    }

    this.userService.add({
      name: this.name(),
      email: this.email(),
      password: this.password(),
      phone: this.phone()
    });

    this.success.set('Conta criada com sucesso!');
    setTimeout(() => this.router.navigate(['/login']), 1500);
  }
}
