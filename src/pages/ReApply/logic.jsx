import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoctorDetailsForEdit,
  resubmitDoctorApplication,
} from "../../api/services/AdminServices";
import { ToastManager } from "../../helpers/ToastManager";

export const ReApplyLogic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctorData, setDoctorData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const statusOptions = [
    { value: "rejected", label: "Rejected" },
    { value: "pending", label: "Pending" },
  ];

  const fetchDoctorDetails = useCallback(() => {
    setLoading(true);
    getDoctorDetailsForEdit(
      id,
      (res) => {
        setDoctorData(res.data);
        ToastManager.notify("Doctor data loaded", { type: "success" });
        setLoading(false);
      },
      (err) => {
        ToastManager.notify(err.toString(), { type: "error" });
        setLoading(false);
        navigate("/login"); // Redirect to login on error
      }
    );
  }, [id, navigate]);

  useEffect(() => {
    fetchDoctorDetails();
  }, [fetchDoctorDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to resubmit this application?")) {
      setLoading(true);

      const payload = {
        ...doctorData,
      };

      resubmitDoctorApplication(
        id,
        payload,
        (res) => {
          ToastManager.notify(res.data, { type: "success" });
          setIsSubmitted(true);
        },
        (err) => {
          ToastManager.notify(err.toString(), { type: "error" });
        },
        () => {
          setLoading(false);
        }
      );
    }
  };

  return {
    loading,
    doctorData,
    setDoctorData,
    handleSubmit,
    statusOptions,
    isSubmitted,
  };
}; 