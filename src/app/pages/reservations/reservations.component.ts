import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent, BottomNavComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent {
  reservationService = inject(ReservationService);

  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  onRelease(vehicleId: string): void {
    const reservation = this.reservationService.reservations().find(r => r.vehicleId === vehicleId);
    if (reservation) {
      const result = this.reservationService.release(reservation.id);
      this.showToast(result.message, result.success ? 'success' : 'error');
    }
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
