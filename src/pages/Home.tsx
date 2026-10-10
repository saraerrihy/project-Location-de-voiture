import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, Clock, ArrowRight } from 'lucide-react';
import { useCars } from '../context/CarContext';

const Home: React.FC = () => {
  const { cars } = useCars();
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  const brands = Array.from(new Set(cars.map(car => car.brand)));
  
  const filteredCars = selectedBrand 
    ? cars.filter(car => car.brand === selectedBrand)
    : cars.slice(0, 6);

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(selectedBrand === brand ? '' : brand);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Louez votre voiture
              <span className="block text-accent-400">en toute simplicité</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Découvrez notre flotte premium de véhicules disponibles 24h/24. 
              Des voitures de qualité pour tous vos déplacements.
            </p>
            <Link
              to="/cars"
              className="inline-flex items-center bg-accent-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Découvrir nos voitures
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recherchez par marque
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cliquez sur une marque pour découvrir tous les modèles disponibles
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {brands.map((brand) => {
              const brandCar = cars.find(car => car.brand === brand);
              return (
                <button
                  key={brand}
                  onClick={() => handleBrandClick(brand)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    selectedBrand === brand
                      ? 'border-primary-500 bg-primary-50 shadow-lg'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{brandCar?.logo}</div>
                  <div className="text-sm font-semibold text-gray-900">{brand}</div>
                  <div className="text-xs text-gray-500">
                    {cars.filter(car => car.brand === brand).length} modèles
                  </div>
                </button>
              );
            })}
          </div>

          {selectedBrand && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Modèles {selectedBrand} disponibles
              </h3>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-900">{car.brand}</span>
                  </div>
                  {car.available && (
                    <div className="absolute top-4 right-4 bg-success-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Disponible
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {car.model} ({car.year})
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      {car.price}€<span className="text-sm text-gray-500">/jour</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{car.transmission}</span>
                    <span>{car.fuel}</span>
                    <span>{car.seats} places</span>
                  </div>
                  <Link
                    to="/cars"
                    className="block w-full bg-primary-600 text-white text-center py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Réserver maintenant
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir CarLoc ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recherche facile</h3>
              <p className="text-gray-600">
                Trouvez rapidement votre voiture idéale grâce à notre système de recherche par marque.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sécurité garantie</h3>
              <p className="text-gray-600">
                Tous nos véhicules sont régulièrement entretenus et assurés pour votre sécurité.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Disponibilité 24h/24</h3>
              <p className="text-gray-600">
                Réservez à tout moment et récupérez votre véhicule quand vous en avez besoin.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;