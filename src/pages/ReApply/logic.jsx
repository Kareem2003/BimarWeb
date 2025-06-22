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

    const formData = new FormData();

    Object.entries(doctorData).forEach(([key, value]) => {
      if (key === "certificates" && Array.isArray(value)) {
        value.forEach((fileOrString) => {
          if (fileOrString instanceof File) {
            formData.append("certificates", fileOrString);
          }
        });
      } else if (key === "clinic" && Array.isArray(value)) {
        value.forEach((clinic, idx) => {
          Object.entries(clinic).forEach(([cKey, cValue]) => {
            if (cKey === "clinicLicense" && cValue instanceof File) {
              formData.append(`clinic[${idx}][clinicLicense]`, cValue);
            } else if (Array.isArray(cValue)) {
              cValue.forEach((item, i) => {
                formData.append(`clinic[${idx}][${cKey}][${i}]`, item);
              });
            } else {
              formData.append(`clinic[${idx}][${cKey}]`, cValue);
            }
          });
        });
      } else if (
        (key === "syndicateCard" || key === "doctorImage") &&
        value instanceof File
      ) {
        formData.append(key, value);
      } else if (
        key !== "doctorImage" &&
        key !== "syndicateCard" &&
        key !== "certificates"
      ) {
        formData.append(key, value);
      }
    });

    resubmitDoctorApplication(
      id,
      formData,
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
