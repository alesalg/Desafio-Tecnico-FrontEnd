import { Reservation } from '../models/reservation.model';

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    vehicleId: '1',
    userId: '2',
    createdAt: new Date('2025-12-10')
  },
  {
    id: 'res-2',
    vehicleId: '3',
    userId: '3',
    createdAt: new Date('2025-12-15')
  },
  {
    id: 'res-3',
    vehicleId: '4',
    userId: '2',
    createdAt: new Date('2025-12-20')
  }
];
