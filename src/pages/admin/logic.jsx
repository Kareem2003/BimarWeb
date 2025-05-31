import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as AdminServices from "../../api/services/AdminServices";
export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear all localStorage items
    localStorage.removeItem("AUTHENTICATION_TOKEN");
    localStorage.removeItem("ADMIN_INFO");
    localStorage.removeItem("DOCTOR_INFO");
    localStorage.clear();

    // Navigate to login page with replace to prevent back navigation
    navigate("/login", { replace: true });
  };

  return { handleLogout };
};

export const useFetchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AdminServices.fetchDoctors(
      (response) => setDoctors(response),
      (error) => setError(error.message),
      () => setLoading(false)
    );
  }, []);

  return { doctors, loading, error };
};

export const useFetchPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AdminServices.fetchPatients(
      (response) => setPatients(response),
      (error) => setError(error.message),
      () => setLoading(false)
    );
  }, []);

  return { patients, loading, error };
};

export const useFetchBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AdminServices.fetchAdminBookings(
      (response) => setBookings(response),
      (error) => setError(error.message),
      () => setLoading(false)
    );
  }, []);

  return { bookings, loading, error };
};

export const useFetchDoctorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(() => {
    setLoading(true);
    AdminServices.fetchDoctorRequests(
      (response) => {
        setRequests(response);
        setError(null);
      },
      (error) => {
        setError(error);
        setRequests([]);
      },
      () => setLoading(false)
    );
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refetch: fetchRequests };
};
