import React, { useState } from 'react';
import { Car, Users, Calendar, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCars, Car as CarType, Reservation } from '../context/CarContext';

const Admin: React.FC = () => {
  const { isAdmin } = useAuth();
  const { cars, reservations, addCar, updateCar, deleteCar, deleteReservation } = useCars();
  const [activeTab, setActiveTab] = useState('cars');
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const handleAddCar = (carData: Omit<CarType, 'id'>) => {
    addCar(carData);
    setShowCarModal(false);
  };

  const handleEditCar = (carData: Omit<CarType, 'id'>) => {
    if (editingCar) {
      updateCar(editingCar.id, carData);
      setEditingCar(null);
      setShowCarModal(false);
    }
  };

  const handleDeleteCar = (carId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      deleteCar(carId);
    }
  };

  const handleDeleteReservation = (reservationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      deleteReservation(reservationId);
    }
  };

  const getCarDetails = (carId: string) => {
    return cars.find(car => car.id === carId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration CarLoc</h1>
          <p className="text-lg text-gray-600">Gestion des voitures et réservations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full">
                <Car className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total voitures</p>
                <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-success-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Réservations totales</p>
                <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-accent-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Voitures disponibles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cars.filter(car => car.available).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('cars')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'cars'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Gestion des voitures
                </button>
                <button
                  onClick={() => setActiveTab('reservations')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reservations'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Gestion des réservations
                </button>
              </div>
            </div>
          </div>

          {/* Cars Tab */}
          {activeTab === 'cars' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Voitures ({cars.length})</h2>
                <button
                  onClick={() => {
                    setEditingCar(null);
                    setShowCarModal(true);
                  }}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter une voiture</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <div key={car.id} className="bg-gray-50 rounded-lg p-4">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{car.brand} {car.model}</h3>
                      <p className="text-gray-600">Année: {car.year}</p>
                      <p className="text-gray-600">Prix: {car.price}€/jour</p>
                      <p className="text-gray-600">Catégorie: {car.category}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          car.available ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                        }`}>
                          {car.available ? 'Disponible' : 'Indisponible'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingCar(car);
                              setShowCarModal(true);
                            }}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="text-error-600 hover:text-error-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Réservations ({reservations.length})</h2>
              
              {reservations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune réservation pour le moment</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Voiture
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((reservation) => {
                        const car = getCarDetails(reservation.carId);
                        return (
                          <tr key={reservation.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {car && (
                                <div className="flex items-center">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={car.image}
                                    alt={`${car.brand} ${car.model}`}
                                  />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {car.brand} {car.model}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {reservation.totalPrice}€
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                reservation.status === 'confirmed' ? 'bg-success-100 text-success-800' :
                                reservation.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                                reservation.status === 'completed' ? 'bg-primary-100 text-primary-800' :
                                'bg-error-100 text-error-800'
                              }`}>
                                {reservation.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleDeleteReservation(reservation.id)}
                                className="text-error-600 hover:text-error-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Car Modal */}
        {showCarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">
                {editingCar ? 'Modifier la voiture' : 'Ajouter une voiture'}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const carData = {
                  brand: formData.get('brand') as string,
                  model: formData.get('model') as string,
                  year: parseInt(formData.get('year') as string),
                  price: parseInt(formData.get('price') as string),
                  image: formData.get('image') as string,
                  available: formData.get('available') === 'on',
                  category: formData.get('category') as string,
                  transmission: formData.get('transmission') as string,
                  fuel: formData.get('fuel') as string,
                  seats: parseInt(formData.get('seats') as string),
                  logo: formData.get('logo') as string,
                };
                
                if (editingCar) {
                  handleEditCar(carData);
                } else {
                  handleAddCar(carData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                    <input
                      type="text"
                      name="brand"
                      defaultValue={editingCar?.brand}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                    <input
                      type="text"
                      name="model"
                      defaultValue={editingCar?.model}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                    <input
                      type="number"
                      name="year"
                      defaultValue={editingCar?.year}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix par jour (€)</label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={editingCar?.price}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                    <input
                      type="url"
                      name="image"
                      defaultValue={editingCar?.image}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo/Emoji</label>
                    <input
                      type="text"
                      name="logo"
                      defaultValue={editingCar?.logo}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      name="category"
                      defaultValue={editingCar?.category}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Economy">Economy</option>
                      <option value="Compact">Compact</option>
                      <option value="Luxury">Luxury</option>
                      <option value="SUV">SUV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                    <select
                      name="transmission"
                      defaultValue={editingCar?.transmission}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Manuelle">Manuelle</option>
                      <option value="Automatique">Automatique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
                    <select
                      name="fuel"
                      defaultValue={editingCar?.fuel}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Essence">Essence</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Électrique">Électrique</option>
                      <option value="Hybride">Hybride</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de places</label>
                    <input
                      type="number"
                      name="seats"
                      defaultValue={editingCar?.seats}
                      min="2"
                      max="9"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      defaultChecked={editingCar?.available ?? true}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Disponible</label>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCarModal(false);
                      setEditingCar(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingCar ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;