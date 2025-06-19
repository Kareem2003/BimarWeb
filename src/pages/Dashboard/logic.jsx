import { reducer } from "../../reducers/reducer";
import { useReducer, useEffect, useState } from "react";
import { INITIAL_STATE } from "./constant";
import ACTION_TYPES from "../../reducers/actionTypes";
import {
  fetchAppointments,
  cancelAppointment,
  deleteAppointment,
  getTodayIncome,
  getMonthlyIncome,
  getYearlyIncome,
} from "../../api/services/DashboardServices";

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

  const updateTodayIncome = async () => {
    try {
      getTodayIncome(
        {},
        (res) => {
          // Support both res.data and res directly
          const data = res.data || res;
          console.log("Today's income response:", data);
          updateProp("todayIncome", data.totalMoney);
          updateProp("totalPatientsToday", data.totalPatientsToday);
        },
        (err) => {
          console.error("Error fetching today's income:", err);
          updateProp("todayIncome", 0);
          updateProp("totalPatientsToday", 0);
        },
        () => {}
      );
    } catch (error) {
      console.error("Exception in updateTodayIncome:", error);
      updateProp("todayIncome", 0);
      updateProp("totalPatientsToday", 0);
    }
  };

  const updateMonthlyStats = async () => {
    try {
      getMonthlyIncome(
        {},
        (res) => {
          console.log("Monthly stats response:", res);
          updateProp("totalPatientsThisMonth", res.totalPatients || 0);
        },
        (err) => {
          console.error("Error fetching monthly stats:", err);
          updateProp("totalPatientsThisMonth", 0);
        },
        () => {}
      );
    } catch (error) {
      console.error("Exception in updateMonthlyStats:", error);
      updateProp("totalPatientsThisMonth", 0);
    }
  };

  const updateYearlyStats = async () => {
    try {
      getYearlyIncome(
        {},
        (res) => {
          console.log("Yearly stats response:", res);
          const chartData = res.map((item) => ({
            month: new Date(2024, item.month - 1).toLocaleString("default", {
              month: "short",
            }),
            income: item.totalMoney,
          }));
          updateProp("yearlyStats", chartData);
        },
        (err) => {
          console.error("Error fetching yearly stats:", err);
          updateProp("yearlyStats", []);
        },
        () => {}
      );
    } catch (error) {
      console.error("Exception in updateYearlyStats:", error);
      updateProp("yearlyStats", []);
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
    updateTodayIncome();
    updateMonthlyStats();
    updateYearlyStats();
  }, []);

  return {
    state,
    error,
    loading,
    setError,
    updateProp,
    handleCancelAppointment,
    handleDeleteAppointment,
    updateAppointments,
    updateTodayIncome,
    updateMonthlyStats,
    updateYearlyStats,
  };
};

export default Logic;
