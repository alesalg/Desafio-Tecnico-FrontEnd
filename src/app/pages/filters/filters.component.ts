import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  vehicleService = inject(VehicleService);
  private router = inject(Router);

  selectedTypes = signal<string[]>([...this.vehicleService.filters().types]);
  selectedEngines = signal<string[]>([...this.vehicleService.filters().engines]);
  selectedSizes = signal<string[]>([...this.vehicleService.filters().sizes]);

  toggleType(type: string): void {
    this.selectedTypes.update(list =>
      list.includes(type) ? list.filter(t => t !== type) : [...list, type]
    );
  }

  toggleEngine(engine: string): void {
    this.selectedEngines.update(list =>
      list.includes(engine) ? list.filter(e => e !== engine) : [...list, engine]
    );
  }

  toggleSize(size: string): void {
    this.selectedSizes.update(list =>
      list.includes(size) ? list.filter(s => s !== size) : [...list, size]
    );
  }

  isTypeSelected(type: string): boolean {
    return this.selectedTypes().includes(type);
  }

  isEngineSelected(engine: string): boolean {
    return this.selectedEngines().includes(engine);
  }

  isSizeSelected(size: string): boolean {
    return this.selectedSizes().includes(size);
  }

  applyFilters(): void {
    this.vehicleService.setFilters({
      types: this.selectedTypes(),
      engines: this.selectedEngines(),
      sizes: this.selectedSizes(),
      search: this.vehicleService.filters().search
    });
    this.router.navigate(['/home']);
  }

  clearFilters(): void {
    this.selectedTypes.set([]);
    this.selectedEngines.set([]);
    this.selectedSizes.set([]);
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }
}
