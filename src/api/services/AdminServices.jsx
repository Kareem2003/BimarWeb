import { $axios } from "../axios";

export const fetchDoctors = (onSuccess, onError, onFinally) => {
  $axios
    .get("/doctor/doctors")
    .then((response) => {
      const doctorsData = response.data?.doctors || response.data || [];
      console.log("Doctors data:", doctorsData);
      onSuccess(doctorsData);
    })
    .catch((error) => {
      console.error("Error fetching doctors:", error);
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};

export const fetchPatients = (onSuccess, onError, onFinally) => {
  $axios
    .get("/admin/patients")
    .then((response) => {
      const patientsData = response.data?.patients || response.data || [];
      console.log("Patients data:", patientsData);
      onSuccess(patientsData);
    })
    .catch((error) => {
      console.error("Error fetching patients:", error);
      onError(error?.response?.data?.message || "Failed to fetch patients");
    })
    .finally(() => {
      onFinally();
    });
};

export const fetchAdminBookings = (onSuccess, onError, onFinally) => {
  $axios
    .get("/admin/appointments")
    .then((response) => {
      const bookingsData = response.data?.bookings || response.data || [];
      console.log("Bookings data:", bookingsData);
      onSuccess(bookingsData);
    })
    .catch((error) => {
      console.error("Error fetching bookings:", error);
      onError(error?.response?.data?.message || "Failed to fetch bookings");
    })
    .finally(() => {
      onFinally();
    });
};

export const fetchDoctorRequests = (onSuccess, onError, onFinally) => {
  $axios
    .get("/admin/doctors?status=pending")
    .then((response) => {
      const requestsData = Array.isArray(response.data)
        ? response.data
        : response.data.data
        ? response.data.data
        : [response.data];

      const pendingDoctors = requestsData.filter(
        (doctor) => doctor.status === "pending"
      );
      console.log("Doctor requests:", pendingDoctors);
      onSuccess(pendingDoctors);
    })
    .catch((error) => {
      console.error("Error fetching doctor requests:", error);
      onError(error?.response?.data?.message || "Failed to fetch requests");
    })
    .finally(() => {
      onFinally();
    });
};

export const approveDoctorRequest = (
  doctorId,
  onSuccess,
  onError,
  onFinally
) => {
  $axios
    .put(`/admin/doctor/activate/${doctorId}`, {
      newStatus: "active",
    })
    .then((response) => {
      console.log("Doctor approved:", response.data);
      onSuccess(response.data);
    })
    .catch((error) => {
      console.error("Error approving doctor:", error);
      onError(error?.response?.data?.message || "Failed to approve doctor");
    })
    .finally(() => {
      onFinally();
    });
};

export const rejectDoctorRequest = (
  doctorId,
  onSuccess,
  onError,
  onFinally
) => {
  $axios
    .put(`/admin/doctor/reject/${doctorId}`, {
      newStatus: "rejected",
    })
    .then((response) => {
      console.log("Doctor rejected:", response.data);
      onSuccess(response.data);
    })
    .catch((error) => {
      console.error("Error rejecting doctor:", error);
      onError(error?.response?.data?.message || "Failed to reject doctor");
    })
    .finally(() => {
      onFinally();
    });
};

export const fetchRatingsOverview = (onSuccess, onError, onFinally) => {
  $axios
    .get("/rateApp/admin")
    .then((response) => {
      console.log("Ratings overview:", response.data);
      onSuccess(response.data);
    })
    .catch((error) => {
      onError(
        error?.response?.data?.message || "Failed to fetch ratings overview"
      );
    })
    .finally(() => {
      onFinally();
    });
};
