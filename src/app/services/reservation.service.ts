import { Injectable, signal, computed, inject } from '@angular/core';
import { Reservation } from '../models/reservation.model';
import { MOCK_RESERVATIONS } from '../mocks/reservations.mock';
import { VehicleService } from './vehicle.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly STORAGE_KEY = 'app_reservations';
  private vehicleService = inject(VehicleService);
  private authService = inject(AuthService);

  private reservationsSignal = signal<Reservation[]>(this.loadFromStorage());

  readonly reservations = this.reservationsSignal.asReadonly();

  readonly userReservations = computed(() => {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return [];
    return this.reservationsSignal().filter(r => r.userId === userId);
  });

  readonly userReservedVehicles = computed(() => {
    const userRes = this.userReservations();
    return userRes
      .map(r => {
        const vehicle = this.vehicleService.getById(r.vehicleId);
        return vehicle ? { reservation: r, vehicle } : null;
      })
      .filter(item => item !== null);
  });

  readonly userHasReservation = computed(() => this.userReservations().length > 0);

  readonly latestReservedVehicles = computed(() => {
    return MOCK_RESERVATIONS
      .map(r => {
        const vehicle = this.vehicleService.getById(r.vehicleId);
        return vehicle ? { reservation: r, vehicle } : null;
      })
      .filter(item => item !== null);
  });

  private loadFromStorage(): Reservation[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reservationsSignal()));
  }

  reserve(vehicleId: string): { success: boolean; message: string } {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      return { success: false, message: 'Usuário não autenticado.' };
    }

    if (this.userHasReservation()) {
      return { success: false, message: 'Você já possui um veículo reservado. Libere-o antes de reservar outro.' };
    }

    const vehicle = this.vehicleService.getById(vehicleId);
    if (!vehicle) {
      return { success: false, message: 'Veículo não encontrado.' };
    }

    if (vehicle.reserved) {
      return { success: false, message: 'Este veículo já está reservado.' };
    }

    const reservation: Reservation = {
      id: crypto.randomUUID(),
      vehicleId,
      userId,
      createdAt: new Date()
    };

    this.reservationsSignal.update(list => [...list, reservation]);
    this.vehicleService.reserveVehicle(vehicleId, userId);
    this.saveToStorage();

    return { success: true, message: 'Veículo reservado com sucesso!' };
  }

  release(reservationId: string): { success: boolean; message: string } {
    const reservation = this.reservationsSignal().find(r => r.id === reservationId);
    if (!reservation) {
      return { success: false, message: 'Reserva não encontrada.' };
    }

    this.vehicleService.releaseVehicle(reservation.vehicleId);
    this.reservationsSignal.update(list => list.filter(r => r.id !== reservationId));
    this.saveToStorage();

    return { success: true, message: 'Reserva liberada com sucesso!' };
  }
}
