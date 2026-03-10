import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleCardComponent, BottomNavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  vehicleService = inject(VehicleService);
  reservationService = inject(ReservationService);
  authService = inject(AuthService);
  private router = inject(Router);

  searchQuery = signal('');
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  onSearch(): void {
    this.vehicleService.setSearch(this.searchQuery());
  }

  openFilters(): void {
    this.router.navigate(['/filters']);
  }

  onReserve(vehicleId: string): void {
    const result = this.reservationService.reserve(vehicleId);
    this.showToast(result.message, result.success ? 'success' : 'error');
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
