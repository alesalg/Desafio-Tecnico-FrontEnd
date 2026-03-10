import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  onLogin(): void {
    this.error.set('');
    this.loading.set(true);

    setTimeout(() => {
      const result = this.authService.login({
        email: this.email(),
        password: this.password()
      });

      if (result) {
        this.router.navigate(['/home']);
      } else {
        this.error.set('E-mail ou senha inválidos.');
      }
      this.loading.set(false);
    }, 500);
  }
}
