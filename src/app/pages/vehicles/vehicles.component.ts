import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent {
  vehicleService = inject(VehicleService);

  showForm = signal(false);
  editingId = signal<string | null>(null);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  formData = signal({
    name: '',
    year: '',
    type: '',
    engine: '',
    size: '',
    image: ''
  });

  openAdd(): void {
    this.formData.set({ name: '', year: '', type: '', engine: '', size: '', image: '' });
    this.editingId.set(null);
    this.showForm.set(true);
  }

  openEdit(vehicle: Vehicle): void {
    this.formData.set({
      name: vehicle.name,
      year: vehicle.year,
      type: vehicle.type,
      engine: vehicle.engine,
      size: vehicle.size,
      image: vehicle.image
    });
    this.editingId.set(vehicle.id);
    this.showForm.set(true);
  }

  save(): void {
    const data = this.formData();
    if (!data.name || !data.year || !data.type || !data.engine || !data.size) {
      this.showToast('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (this.editingId()) {
      this.vehicleService.update(this.editingId()!, data);
      this.showToast('Veículo atualizado com sucesso!', 'success');
    } else {
      this.vehicleService.add({ ...data, image: data.image || 'assets/cars/default.png' });
      this.showToast('Veículo cadastrado com sucesso!', 'success');
    }

    this.showForm.set(false);
  }

  remove(vehicle: Vehicle): void {
    if (vehicle.reserved) {
      this.showToast('Não é possível remover um veículo reservado.', 'error');
      return;
    }
    this.vehicleService.remove(vehicle.id);
    this.showToast('Veículo removido com sucesso!', 'success');
  }

  cancel(): void {
    this.showForm.set(false);
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
