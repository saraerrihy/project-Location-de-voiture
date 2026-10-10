import React, { useState } from 'react';
import { Search, Filter, Star, CheckCircle } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';

const Cars: React.FC = () => {
  const { cars, addReservation } = useCars();
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<any>(null);

  const brands = Array.from(new Set(cars.map(car => car.brand)));
  const categories = Array.from(new Set(cars.map(car => car.category)));

  const filteredCars = cars.filter(car => {
    const matchSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBrand = !selectedBrand || car.brand === selectedBrand;
    const matchCategory = !selectedCategory || car.category === selectedCategory;
    const matchPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    
    return matchSearch && matchBrand && matchCategory && matchPrice;
  });

  const handleReservation = (carId: string) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour réserver une voiture');
      return;
    }
    setSelectedCar(carId);
    setShowReservationModal(true);
  };

  const confirmReservation = (startDate: string, endDate: string) => {
    if (selectedCar && user) {
      const car = cars.find(c => c.id === selectedCar);
      if (car) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        if (days <= 0) {
          alert('La date de fin doit être après la date de début');
          return;
        }

        const totalPrice = car.price * days;
        
        const newReservation = {
          carId: selectedCar,
          userId: user.id,
          startDate,
          endDate,
          totalPrice,
          status: 'confirmed' as const
        };

        addReservation(newReservation);
        
        // Préparer les détails pour la confirmation
        setReservationDetails({
          car,
          startDate,
          endDate,
          days,
          totalPrice
        });
        
        setShowReservationModal(false);
        setSelectedCar(null);
        setShowConfirmation(true);
      }
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setReservationDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Notre flotte de véhicules</h1>
          <p className="text-lg text-gray-600">Découvrez notre sélection de voitures premium</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une voiture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Toutes les marques</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Prix: {priceRange[0]}€ - {priceRange[1]}€</span>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">{car.logo}</span>
                    {car.brand}
                  </span>
                </div>
                {car.available ? (
                  <div className="absolute top-4 right-4 bg-success-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Disponible
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-error-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Indisponible
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {car.model}
                    </h3>
                    <p className="text-gray-600">{car.year}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-4">
                  <div className="text-center">
                    <div className="font-medium">{car.transmission}</div>
                    <div className="text-xs">Transmission</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{car.fuel}</div>
                    <div className="text-xs">Carburant</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{car.seats}</div>
                    <div className="text-xs">Places</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {car.price}€
                    <span className="text-sm text-gray-500 font-normal">/jour</span>
                  </div>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {car.category}
                  </span>
                </div>

                <button
                  onClick={() => handleReservation(car.id)}
                  disabled={!car.available}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    car.available
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {car.available ? 'Réserver maintenant' : 'Indisponible'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune voiture ne correspond à vos critères.</p>
          </div>
        )}

        {/* Reservation Modal */}
        {showReservationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Réserver cette voiture</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const startDate = formData.get('startDate') as string;
                const endDate = formData.get('endDate') as string;
                
                if (!startDate || !endDate) {
                  alert('Veuillez sélectionner les dates de début et de fin');
                  return;
                }
                
                confirmReservation(startDate, endDate);
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReservationModal(false);
                      setSelectedCar(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Confirmer la réservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && reservationDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-success-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Réservation confirmée !
                </h3>
                <p className="text-gray-600 mb-6">
                  Votre réservation a été enregistrée avec succès.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-semibold text-gray-900 mb-3">Détails de la réservation :</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voiture :</span>
                      <span className="font-medium">{reservationDetails.car.brand} {reservationDetails.car.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Du :</span>
                      <span className="font-medium">{new Date(reservationDetails.startDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Au :</span>
                      <span className="font-medium">{new Date(reservationDetails.endDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée :</span>
                      <span className="font-medium">{reservationDetails.days} jour{reservationDetails.days > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Prix total :</span>
                      <span className="font-bold text-primary-600">{reservationDetails.totalPrice}€</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={closeConfirmation}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Parfait !
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;