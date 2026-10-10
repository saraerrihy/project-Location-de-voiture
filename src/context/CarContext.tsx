import React, { createContext, useContext, useState } from 'react';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  available: boolean;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  logo: string;
}

export interface Reservation {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface CarContextType {
  cars: Car[];
  reservations: Reservation[];
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const useCars = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};

const initialCars: Car[] = [
  {
    id: '1',
    brand: 'BMW',
    model: 'Série 3',
    year: 2023,
    price: 89,
    image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
    category: 'Luxury',
    transmission: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    logo: '🚗'
  },
  {
    id: '2',
    brand: 'Mercedes',
    model: 'Classe C',
    year: 2023,
    price: 95,
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
    category: 'Luxury',
    transmission: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    logo: '⭐'
  },
  {
    id: '3',
    brand: 'Dacia',
    model: 'Sandero',
    year: 2022,
    price: 35,
    image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
    category: 'Economy',
    transmission: 'Manuelle',
    fuel: 'Essence',
    seats: 5,
    logo: '🔷'
  },
  {
    id: '4',
    brand: 'Audi',
    model: 'A4',
    year: 2023,
    price: 85,
    image: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
    category: 'Luxury',
    transmission: 'Automatique',
    fuel: 'Diesel',
    seats: 5,
    logo: '🔺'
  },
  {
    id: '5',
    brand: 'Peugeot',
    model: '308',
    year: 2022,
    price: 55,
    image: 'https://images.pexels.com/photos/627678/pexels-photo-627678.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
    category: 'Compact',
    transmission: 'Manuelle',
    fuel: 'Essence',
    seats: 5,
    logo: '🦁'
  },
  {
    id: '6',
    brand: 'Renault',
    model: 'Clio',
    year: 2022,
    price: 45,
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
    category: 'Compact',
    transmission: 'Manuelle',
    fuel: 'Essence',
    seats: 5,
    logo: '💎'
  }
];

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const addCar = (car: Omit<Car, 'id'>) => {
    const newCar = { ...car, id: Date.now().toString() };
    setCars(prev => [...prev, newCar]);
  };

  const updateCar = (id: string, carUpdate: Partial<Car>) => {
    setCars(prev => prev.map(car => car.id === id ? { ...car, ...carUpdate } : car));
  };

  const deleteCar = (id: string) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const addReservation = (reservation: Omit<Reservation, 'id'>) => {
    const newReservation = { ...reservation, id: Date.now().toString() };
    setReservations(prev => [...prev, newReservation]);
  };

  const updateReservation = (id: string, reservationUpdate: Partial<Reservation>) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, ...reservationUpdate } : res));
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  const value = {
    cars,
    reservations,
    addCar,
    updateCar,
    deleteCar,
    addReservation,
    updateReservation,
    deleteReservation
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
};