import React from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '../constants';

export const AdminSidebar = ({ activeTab, onTabChange, onLogout }) => {
  const handleItemClick = (route) => {
    if (route.id === 'logout') {
      onLogout();
    } else {
      onTabChange(route.id);
    }
  };

  return (
    <div className="w-64 h-screen bg-primary text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {ADMIN_ROUTES.map((route) => (
            <li key={route.id}>
              <Link
                to={route.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === route.id
                    ? 'bg-tertiary text-white'
                    : 'text-secondary hover:bg-secondary/10'
                }`}
                onClick={() => handleItemClick(route)}
              >
                <route.icon className="w-5 h-5 mr-3" />
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 text-sm text-secondary">
        <p>© 2024 Admin Dashboard</p>
      </div>
    </div>
  );
}; 