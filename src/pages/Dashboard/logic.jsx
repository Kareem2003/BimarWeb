import { reducer } from "../../reducers/reducer";
import { useReducer, useEffect, useState } from "react";
import { INITIAL_STATE } from "./constant";
import ACTION_TYPES from "../../reducers/actionTypes";
import { fetchAppointments, cancelAppointment, deleteAppointment } from "../../api/services/DashboardServices";

const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateProp = (prop, value) => {
    dispatch({
      payload: [
        {
          type: ACTION_TYPES.UPDATE_PROP,
          prop: prop,
          value: value,
        },
      ],
    });
  };

  const updateAppointments = async () => {
    try {
      setLoading(true);
      fetchAppointments(
        {},
        (res) => {
          console.log("Appointments response:", res);
          updateProp("appointments", res.data);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching appointments:", err);
          setError("Failed to fetch appointments");
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Exception in updateAppointments:", error);
      setError("Failed to update appointments");
      setLoading(false);
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    try {
      setLoading(true);
      cancelAppointment(
        appointmentId,
        (res) => {
          console.log("Appointment cancelled successfully:", res);
          setTimeout(() => updateAppointments(), 500);
        },
        (err) => {
          console.error("Error cancelling appointment:", err);
          setError("Failed to cancel appointment");
          setLoading(false);
        },
        () => {}
      );
    } catch (error) {
      console.error("Exception in handleCancelAppointment:", error);
      setError("Failed to cancel appointment");
      setLoading(false);
    }
  };

  const handleDeleteAppointment = (appointmentId) => {
    try {
      setLoading(true);
      deleteAppointment(
        appointmentId,
        (res) => {
          console.log("Appointment deleted successfully:", res);
          updateAppointments();
        },
        (err) => {
          console.error("Error deleting appointment:", err);
          setError("Failed to delete appointment");
          setLoading(false);
        },
        () => {}
      );
    } catch (error) {
      console.error("Exception in handleDeleteAppointment:", error);
      setError("Failed to delete appointment");
      setLoading(false);
    }
  };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const doctorData = localStorage.getItem("DOCTOR_INFO");
        if (doctorData) {
          const doctor = JSON.parse(doctorData);
          updateProp("loggedInUser", doctor.doctorName);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    getDashboardData();
    updateAppointments();
  }, []);

  return {
    state,
    error,
    loading,
    setError,
    updateProp,
    handleCancelAppointment,
    handleDeleteAppointment,
    updateAppointments
  };
};

export default Logic;
