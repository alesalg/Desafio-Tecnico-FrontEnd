import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss'
})
export class VehicleCardComponent {
  vehicle = input.required<Vehicle>();
  showReserveButton = input(true);
  showReleaseButton = input(false);
  removeBadge = input(false);

  reserve = output<string>();
  release = output<string>();

  onCardClick(): void {
    if (this.showReserveButton() && !this.vehicle().reserved) {
      this.reserve.emit(this.vehicle().id);
    }
  }

  onRelease(): void {
    this.release.emit(this.vehicle().id);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/cars/default.png';
  }
}
