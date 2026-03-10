import { Injectable, signal, computed } from '@angular/core';
import { Vehicle, VehicleFilters } from '../models/vehicle.model';
import { MOCK_VEHICLES } from '../mocks/vehicles.mock';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly STORAGE_KEY = 'app_vehicles';

  private vehiclesSignal = signal<Vehicle[]>(this.loadFromStorage());
  private filtersSignal = signal<VehicleFilters>({
    types: [],
    engines: [],
    sizes: [],
    search: ''
  });

  readonly vehicles = this.vehiclesSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();

  readonly filteredVehicles = computed(() => {
    const vehicles = this.vehiclesSignal();
    const filters = this.filtersSignal();

    return vehicles.filter(v => {
      const matchSearch = !filters.search ||
        v.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.type.toLowerCase().includes(filters.search.toLowerCase());

      const matchType = filters.types.length === 0 ||
        filters.types.includes(v.type);

      const matchEngine = filters.engines.length === 0 ||
        filters.engines.includes(v.engine);

      const matchSize = filters.sizes.length === 0 ||
        filters.sizes.includes(v.size);

      return matchSearch && matchType && matchEngine && matchSize;
    });
  });

  readonly availableTypes = computed(() => {
    const types = new Set(this.vehiclesSignal().map(v => v.type));
    return Array.from(types).sort();
  });

  readonly availableEngines = computed(() => {
    const engines = new Set(this.vehiclesSignal().map(v => v.engine));
    return Array.from(engines).sort();
  });

  readonly availableSizes = computed(() => {
    const sizes = new Set(this.vehiclesSignal().map(v => v.size));
    return Array.from(sizes).sort((a, b) => Number(a) - Number(b));
  });

  private loadFromStorage(): Vehicle[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const vehicles: Vehicle[] = JSON.parse(stored);
      const mockIds = ['1', '3', '4'];
      return vehicles.map(v =>
        mockIds.includes(v.id) ? { ...v, reserved: false, reservedBy: undefined } : v
      );
    }
    return MOCK_VEHICLES;
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.vehiclesSignal()));
  }

  setFilters(filters: VehicleFilters): void {
    this.filtersSignal.set(filters);
  }

  clearFilters(): void {
    this.filtersSignal.set({ types: [], engines: [], sizes: [], search: '' });
  }

  setSearch(search: string): void {
    this.filtersSignal.update(f => ({ ...f, search }));
  }

  getById(id: string): Vehicle | undefined {
    return this.vehiclesSignal().find(v => v.id === id);
  }

  add(vehicle: Omit<Vehicle, 'id' | 'reserved' | 'reservedBy'>): void {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: crypto.randomUUID(),
      reserved: false
    };
    this.vehiclesSignal.update(list => [...list, newVehicle]);
    this.saveToStorage();
  }

  update(id: string, data: Partial<Vehicle>): void {
    this.vehiclesSignal.update(list =>
      list.map(v => v.id === id ? { ...v, ...data } : v)
    );
    this.saveToStorage();
  }

  remove(id: string): boolean {
    const vehicle = this.getById(id);
    if (vehicle?.reserved) return false;

    this.vehiclesSignal.update(list => list.filter(v => v.id !== id));
    this.saveToStorage();
    return true;
  }

  reserveVehicle(vehicleId: string, userId: string): void {
    this.vehiclesSignal.update(list =>
      list.map(v => v.id === vehicleId ? { ...v, reserved: true, reservedBy: userId } : v)
    );
    this.saveToStorage();
  }

  releaseVehicle(vehicleId: string): void {
    this.vehiclesSignal.update(list =>
      list.map(v => v.id === vehicleId ? { ...v, reserved: false, reservedBy: undefined } : v)
    );
    this.saveToStorage();
  }
}
