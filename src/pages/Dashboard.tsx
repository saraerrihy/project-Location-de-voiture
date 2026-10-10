import React from 'react';
import { Calendar, Car, CreditCard, User, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCars } from '../context/CarContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { reservations, cars } = useCars();

  const userReservations = reservations.filter(res => res.userId === user?.id);

  const getCarDetails = (carId: string) => {
    return cars.find(car => car.id === carId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'completed': return 'bg-primary-100 text-primary-800';
      case 'cancelled': return 'bg-error-100 text-error-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-lg text-gray-600">Bienvenue, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full">
                <Car className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Réservations totales</p>
                <p className="text-2xl font-bold text-gray-900">{userReservations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-success-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Réservations confirmées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userReservations.filter(res => res.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-warning-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userReservations.filter(res => res.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-accent-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total dépensé</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userReservations.reduce((total, res) => total + res.totalPrice, 0)}€
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations History */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Historique des réservations
            </h2>
          </div>

          {userReservations.length === 0 ? (
            <div className="p-8 text-center">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune réservation pour le moment</p>
              <p className="text-gray-400">Découvrez notre flotte et faites votre première réservation !</p>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userReservations.map((reservation) => {
                    const car = getCarDetails(reservation.carId);
                    return (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {car && (
                              <>
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={car.image}
                                  alt={`${car.brand} ${car.model}`}
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {car.brand} {car.model}
                                  </div>
                                  <div className="text-sm text-gray-500">{car.year}</div>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(reservation.startDate).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-gray-500">
                            au {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.totalPrice}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {getStatusIcon(reservation.status)}
                            <span className="ml-1">
                              {reservation.status === 'pending' && 'En attente'}
                              {reservation.status === 'confirmed' && 'Confirmée'}
                              {reservation.status === 'completed' && 'Terminée'}
                              {reservation.status === 'cancelled' && 'Annulée'}
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;