import {
  MdDashboard,
  MdLocalHospital,
  MdPeople,
  MdEventNote,
  MdAssignment,
  MdExitToApp,
} from 'react-icons/md';

export const ADMIN_ROUTES = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: MdDashboard,
    path: '/admin',
  },
  {
    id: 'doctors',
    label: 'Doctors',
    icon: MdLocalHospital,
    path: '/admin/doctors',
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: MdPeople,
    path: '/admin/patients',
  },
  {
    id: 'bookings',
    label: 'All Bookings',
    icon: MdEventNote,
    path: '/admin/bookings',
  },
  {
    id: 'requests',
    label: 'Doctor Requests',
    icon: MdAssignment,
    path: '/admin/requests',
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: MdExitToApp,
    path: '/login',
  },
]; 