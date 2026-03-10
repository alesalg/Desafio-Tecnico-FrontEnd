export interface Vehicle {
  id: string;
  name: string;
  year: string;
  type: string;
  engine: string;
  size: string;
  image: string;
  reserved: boolean;
  reservedBy?: string;
}

export interface VehicleFilters {
  types: string[];
  engines: string[];
  sizes: string[];
  search: string;
}
