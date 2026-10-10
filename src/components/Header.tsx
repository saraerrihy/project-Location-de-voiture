import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, User, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b-2 border-primary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Car className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-800">CarLoc</h1>
              <p className="text-xs text-gray-500 -mt-1">Location Premium</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              Accueil
            </Link>
            <Link 
              to="/cars" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/cars') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              Nos Voitures
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Tableau de bord
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-accent-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-700 transition-colors flex items-center space-x-1"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;