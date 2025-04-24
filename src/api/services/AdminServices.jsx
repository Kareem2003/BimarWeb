import { $axios } from "../axios";

export const fetchDoctors = (onSuccess, onError, onFinally) => {
    $axios
      .get('/doctor/doctors')
      .then((response) => {
        const doctorsData = response.data?.doctors || response.data || [];
        console.log('Doctors data:', doctorsData);
        onSuccess(doctorsData);
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
        onError(error);
      })
      .finally(() => {
        onFinally();
      });
  };

  export const fetchPatients = (onSuccess, onError, onFinally) => {
    $axios
      .get('/admin/patients')
      .then((response) => {
        const patientsData = response.data?.patients || response.data || [];
        console.log('Patients data:', patientsData);
        onSuccess(patientsData);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
        onError(error?.response?.data?.message || 'Failed to fetch patients');
      })
      .finally(() => {
        onFinally();
      });
  };

export const fetchAdminBookings = (onSuccess, onError, onFinally) => {
    $axios
      .get('/admin/appointments')
      .then((response) => {
        const bookingsData = response.data?.bookings || response.data || [];
        console.log('Bookings data:', bookingsData);
        onSuccess(bookingsData);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
        onError(error?.response?.data?.message || 'Failed to fetch bookings');
      })
      .finally(() => {
        onFinally();
      });
};

export const fetchDoctorRequests = (onSuccess, onError, onFinally) => {
  $axios
    .get('/doctor-requests')
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};

// Add doctor request actions
export const approveDoctorRequest = (doctorId, onSuccess, onError, onFinally) => {
  $axios
    .patch(`/doctor-requests/${doctorId}/approve`)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};

export const rejectDoctorRequest = (doctorId, onSuccess, onError, onFinally) => {
  $axios
    .patch(`/doctor-requests/${doctorId}/reject`)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};