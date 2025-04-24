import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { DoctorsList } from './components/DoctorsList';
import { PatientsList } from './components/PatientsList';
import { BookingsList } from './components/BookingsList';
import { DoctorRequests } from './components/DoctorRequests';
import { ADMIN_ROUTES } from './constants';
import { useLogout } from './logic';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'doctors':
        return <DoctorsList />;
      case 'patients':
        return <PatientsList />;
      case 'bookings':
        return <BookingsList />;
      case 'requests':
        return <DoctorRequests />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary mb-6">
            {ADMIN_ROUTES.find(route => route.id === activeTab)?.label || 'Dashboard'}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 