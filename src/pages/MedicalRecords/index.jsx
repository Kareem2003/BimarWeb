import React, { useState, useEffect, useRef } from "react";
import Logic from "./logic";
import { FaUser, FaLock, FaNotesMedical, FaHistory, FaUserFriends, FaUsers, FaEdit } from "react-icons/fa";
import Layout from "../../components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toast from "../../components/Toast";
import { v4 as uuidv4 } from "uuid";
import {
  generateLink,
  createPrescription,
} from "../../api/services/requestServices";
import Cookies from "js-cookie";
import { DOCTOR_INFO } from "../../helpers/constants/StaticKeys";

const SECTIONS = [
  { id: "patient-overview", label: "Patient Overview", icon: FaUser },
  { id: "medical-family-history", label: "Medical & Family History", icon: FaNotesMedical },
  { id: "diagnosis-history", label: "Diagnosis History", icon: FaHistory },
];

const MedicalRecordsScreen = () => {
  const { state, updateProp } = Logic();
  const [showAccessPopup, setShowAccessPopup] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showFollowUpQuestion, setShowFollowUpQuestion] = useState(true);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorImage, setDoctorImage] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Track which section is active
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  // Get doctor information from local storage
  useEffect(() => {
    const doctorData = localStorage.getItem(DOCTOR_INFO);
    if (doctorData && doctorData.trim().startsWith("{")) {
      try {
        const doctor = JSON.parse(doctorData);
        console.log("Doctor Data:", doctor); // Console log to verify data
        setDoctorEmail(doctor.doctorEmail);
        setDoctorName(doctor.doctorName);
        setDoctorImage(doctor.doctorImage);
        setDoctorPhone(doctor.doctorPhone || "123-456-7890"); // Fallback if phone is not available
      } catch (error) {
        console.error("Error parsing doctor data:", error);
        setDoctorEmail("bimar.med24@gmail.com"); // Fallback to default email
        setToast({
          show: true,
          message: "Error setting doctor email. Using default email instead.",
          type: "warning",
        });
      }
    }
  }, []);

  // Handle data loading after successful verification
  useEffect(() => {
    if (location.state && location.state.data) {
      try {
        const medicalData = location.state.data;
        console.log("Medical Data:", medicalData); // Console log to verify data
        updateProp("hasAccess", true);
        updateProp("medicalRecords", medicalData);
        setToast({
          show: true,
          message: "Access granted successfully!",
          type: "success",
        });
      } catch (err) {
        console.error("Error parsing medical data:", err);
      }
    }
    if (location.state && location.state.patientEmail) {
      console.log("Patient Email from Dashboard:", location.state.patientEmail);
      updateProp("patientEmail", location.state.patientEmail);
    }
  }, [location.state]);

  const handleRequestAccess = async () => {
    generateLink(
      {
        patientEmail: state.patientEmail,
        doctorEmail: doctorEmail,
        accessDuration: parseInt(state.accessDuration),
      },
      (res) => {
        console.log("Res: ", res);
        setToast({
          show: true,
          message:
            "Access request sent successfully. Please check your email for the verification link.",
          type: "success",
        });
        setShowAccessPopup(false);
        navigate("/access");
      },
      (err) => {
        setToast({
          show: true,
          message:
            err.response?.data?.message ||
            "Failed to request access. Please try again.",
          type: "error",
        });
        console.error("Request access error:", err);
        setShowAccessPopup(false);
      },
      () => {}
    );
  };

  const calculateAge = (birthdate) => {
    // Handle date in DD/MM/YYYY format
    let birthDate;

    // Check if the date is in DD/MM/YYYY format
    if (typeof birthdate === "string" && birthdate.includes("/")) {
      const [day, month, year] = birthdate
        .split("/")
        .map((num) => parseInt(num, 10));
      birthDate = new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
    } else {
      // Fallback to regular Date parsing for other formats
      birthDate = new Date(birthdate);
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Sanity check to ensure we don't return an invalid age
    return age >= 0 && age < 120 ? age : 0;
  };

  const handleFollowUpChange = (e) => {
    const value = e.target.value === "yes";
    setShowFollowUpQuestion(false);
    if (value) {
      updateProp("followUpDate", new Date().toISOString().split("T")[0]); // Set default follow-up date to today
    } else {
      updateProp("followUpDate", null);
    }
  };

  const submitData = async () => {
    console.log("submit data");
    const prescriptionData = {
      prescriptionId: uuidv4(),
      prescriptionDate: new Date(),
      followUpDate: state.followUpDate,
      notes: state.notes,
      prescriptionInstruction: state.prescriptions.map((prescription) => ({
        medication: prescription.medication,
        dosage: prescription.dosage,
        frequency: parseInt(prescription.frequency),
        duration: parseInt(prescription.duration),
        notes: prescription.notes || "",
      })),
      prescriptionStatus: "Pending",
      doctorName: doctorName,
      doctorPhone: doctorPhone,
      diagnosis: state.diagnosis || [],
      doctorImage: doctorImage,
    };

    console.log("Prescription Data:", prescriptionData);
    createPrescription(
      {
        patientId: state.medicalRecords.patientId,
        prescriptionData,
        doctorImage: doctorImage,
      },
      (res) => {
        console.log("Res: ", res);
        setToast({
          show: true,
          message: "Data submitted successfully!",
          type: "success",
        });
      },
      (err) => {
        setToast({
          show: true,
          message: "Failed to submit data. Please try again.",
          type: "error",
        });
        console.error("Request access error:", err);
        setShowAccessPopup(false);
      },
      () => {}
    );
  };

  const [newPrescription, setNewPrescription] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const addPrescription = () => {
    if (
      newPrescription.medication.trim() &&
      newPrescription.dosage.trim() &&
      newPrescription.frequency.trim() &&
      newPrescription.duration.trim()
    ) {
      updateProp("prescriptions", [
        ...(state.prescriptions || []),
        newPrescription,
      ]);
      setNewPrescription({
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
      });
    }
  };

  const removePrescription = (index) => {
    const updatedPrescriptions = state.prescriptions.filter(
      (_, i) => i !== index
    );
    updateProp("prescriptions", updatedPrescriptions);
  };

  const AccessPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px]">
        <h3 className="text-[18.1px] font-extrabold mb-4">Request Access</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[18.1px] font-medium mb-2 block">
              Patient Email
            </label>
            <div className="w-full p-2 border rounded bg-gray-50">
              {state.patientEmail || "No email provided"}
            </div>
          </div>
          <div>
            <label className="text-[18.1px] font-medium mb-2 block">
              Access Duration (minutes)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Enter duration in minutes"
              value={state.accessDuration}
              onChange={(e) => updateProp("accessDuration", e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded text-gray-600"
              onClick={() => setShowAccessPopup(false)}
            >
              Cancel
            </button>
            <button
              className="bg-[#16423C] font-bold text-white px-4 py-2 rounded"
              onClick={handleRequestAccess}
            >
              Request Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add state for expanded diagnosis entries
  const [expandedDiagnosis, setExpandedDiagnosis] = useState([]);

  const toggleDiagnosis = (index) => {
    setExpandedDiagnosis((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Add a placeholder update handler
  const handleUpdateClick = (section) => {
    // Placeholder: show a toast or log
    setToast({ show: true, message: `Update clicked for ${section}`, type: "info" });
  };

  // Add state for update modal
  const [updateModal, setUpdateModal] = useState({ open: false, section: null, subSection: null });
  const [editValue, setEditValue] = useState("");
  const [editList, setEditList] = useState([]);

  const MEDICAL_RECORD_PARTS = [
    { key: "chronicMedications", label: "Chronic Medications" },
    { key: "surgeries", label: "Surgeries" },
    { key: "chronicDiseases", label: "Chronic Diseases" },
    { key: "vaccinations", label: "Vaccinations" },
  ];
  const FAMILY_HISTORY_PARTS = [
    { key: "genaticsDiseases", label: "Genetic Diseases" },
    { key: "genatics", label: "Genetics" },
  ];

  const openUpdateModal = (section, subSection = null) => {
    let list = [];
    if (section === "allergies") {
      list = state.medicalRecords?.medicalRecord?.allgeric || [];
    } else if (section === "medical-records") {
      const key = subSection || MEDICAL_RECORD_PARTS[0].key;
      list = state.medicalRecords?.medicalRecord?.[key] || [];
    } else if (section === "family-history") {
      const key = subSection || FAMILY_HISTORY_PARTS[0].key;
      list = state.medicalRecords?.medicalRecord?.familyHistory?.[key] || [];
    }
    setEditList(list);
    setEditValue("");
    setUpdateModal({ open: true, section, subSection });
  };

  const handleSelectSubSection = (subSection) => {
    openUpdateModal(updateModal.section, subSection);
  };

  const closeUpdateModal = () => setUpdateModal({ open: false, section: null, subSection: null });

  const handleAddEditItem = () => {
    if (!editValue.trim()) return;
    setEditList((prev) => [...prev, editValue.trim()]);
    setEditValue("");
  };

  const handleDeleteEditItem = (idx) => {
    setEditList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveEditList = () => {
    // Placeholder: just close modal and show toast
    setToast({ show: true, message: `Updated ${updateModal.section}`, type: "success" });
    closeUpdateModal();
  };

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-background to-white relative">
        {/* Overlay blur and block if no access */}
        {!state.hasAccess && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <button
              onClick={() => setShowAccessPopup(true)}
              className="bg-[#16423C] text-white px-20 py-6 font-black rounded-2xl text-xl flex items-center gap-3 shadow-2xl border-4 border-tertiary hover:bg-tertiary transition"
            >
              <FaLock className="text-lg" /> Get Access
            </button>
          </div>
        )}
        {/* Sidebar (disable navigation if no access) */}
        <aside className={`w-56 h-screen bg-primary text-white flex flex-col sticky top-0 z-30 shadow-xl ${!state.hasAccess ? 'pointer-events-none opacity-60' : ''}`}>
          <div className="p-4 border-b border-secondary/30">
            <h2 className="text-xl font-bold tracking-wide">Medical Records</h2>
          </div>
          <nav className="flex-1 mt-2">
            <ul className="space-y-1">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none ${activeSection === section.id ? 'bg-tertiary text-white shadow-md' : 'hover:bg-secondary/20 hover:text-tertiary'} ${!state.hasAccess ? 'pointer-events-none' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                    disabled={!state.hasAccess}
                  >
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 text-xs text-secondary border-t border-secondary/30 mt-auto">
            <p>© 2024 Bimar</p>
          </div>
        </aside>
        {/* Main Content (blur if no access) */}
        <div className={`flex-1 flex flex-col gap-8 p-8 bg-background/60 min-h-screen relative ${!state.hasAccess ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
          {/* Only show the active section */}
          <div className="flex-1">
            {activeSection === "patient-overview" && (
              <section id="patient-overview">
                <div className="flex flex-row gap-8 mb-8">
              {/* Patient Card */}
                  <div className="bg-gradient-to-br from-white to-background/60 rounded-lg shadow p-4 flex-1 min-w-[200px] border-l-2 border-primary transition-transform hover:-translate-y-0.5 hover:shadow-lg duration-200">
                    <div className="flex items-center gap-1 mb-2">
                      <FaUser className="text-base text-primary" />
                      <h3 className="text-base font-bold tracking-wide">Patient Info</h3>
                    </div>
                    {state.medicalRecords ? (
                      <div className="flex items-start gap-6">
                        <div className="w-[114px] h-[130px] rounded-2xl bg-gray-200 flex items-center justify-center mt-2 shadow-inner overflow-hidden">
                    {state.medicalRecords?.profileImage ? (
                      <img
                              src={`http://localhost:3000/${state.medicalRecords.profileImage.replace(/\\/g, "/")}`}
                        alt="Profile"
                              className="w-full h-full object-cover rounded-2xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                              }}
                      />
                    ) : (
                      <FaUser className="text-4xl text-gray-400" />
                    )}
                  </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {state.medicalRecords?.userName || "N/A"}
                    </h4>
                          <div className="flex flex-wrap gap-2 items-center mb-2">
                            <span className="text-base font-medium text-[#00000080]">{state.medicalRecords?.personalRecords?.Gender || "N/A"}</span>
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-xs ml-1">Age: {state.medicalRecords?.personalRecords?.DateOfBirth ? calculateAge(state.medicalRecords.personalRecords.DateOfBirth) : "N/A"}</span>
                      </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <div className="text-base font-normal text-black">
                              <span className="font-semibold">Area:</span> <span className="text-[#00000080]">{state.medicalRecords?.personalRecords?.Area || "N/A"}</span>
                      </div>
                            <div className="text-base font-normal text-black">
                              <span className="font-semibold">City:</span> <span className="text-[#00000080]">{state.medicalRecords?.personalRecords?.City || "N/A"}</span>
                      </div>
                            <div className="text-base font-normal text-black col-span-2">
                              <span className="font-semibold">Last Visit:</span> <span className="text-[#00000080]">{state.medicalRecords?.lastVisit || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                    ) : (
                      <div className="text-gray-400 text-center py-8">No patient data available</div>
                    )}
              </div>
                  {/* Overview Card */}
                  <div className="bg-gradient-to-br from-white to-background/60 rounded-lg shadow p-4 flex-1 border-l-2 border-tertiary transition-transform hover:-translate-y-0.5 hover:shadow-lg duration-200">
                    <div className="flex items-center gap-1 mb-2">
                      <FaUserFriends className="text-base text-tertiary" />
                      <h3 className="text-base font-bold tracking-wide">Overview</h3>
                    </div>
                    {state.medicalRecords && state.medicalRecords.personalRecords && state.medicalRecords.medicalRecord ? (
                      <>
                        <div className="flex flex-wrap gap-6 mb-2">
                          <div className="text-base font-normal text-black flex items-center gap-2">
                            <span className="font-semibold">Weight:</span>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">{state.medicalRecords.personalRecords.userWeight || "N/A"} kg</span>
                          </div>
                          <div className="text-base font-normal text-black flex items-center gap-2">
                            <span className="font-semibold">Height:</span>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">{state.medicalRecords.personalRecords.userHeight || "N/A"} cm</span>
                          </div>
                          <div className="text-base font-normal text-black flex items-center gap-2">
                            <span className="font-semibold">Blood Type:</span>
                            <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-semibold text-sm">{state.medicalRecords.medicalRecord.bloodType || "N/A"}</span>
                          </div>
                          <div className="text-base font-normal text-black flex items-center gap-2">
                            <span className="font-semibold">Status:</span>
                            <span className="px-3 py-1 rounded-full bg-secondary/20 text-primary font-semibold text-sm">{state.medicalRecords.personalRecords.familyStatus || "N/A"}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-6 mb-2">
                          <div className="text-base font-normal text-black flex items-center gap-2">
                            <span className="font-semibold">Smoking:</span>
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm">{state.medicalRecords.personalRecords.smoking || "N/A"}</span>
                          </div>
                          <div className="text-base font-normal text-black flex items-center gap-2">
                            <span className="font-semibold">Alcohol:</span>
                            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm">{state.medicalRecords.personalRecords.alcohol || "N/A"}</span>
                          </div>
                </div>
                <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-base font-semibold text-black border-b border-secondary/30 pb-1">Known Allergies</p>
                            <button
                              className="flex items-center gap-1 px-2 py-0.5 bg-tertiary text-white rounded shadow hover:bg-primary transition text-xs font-semibold"
                              style={{ fontSize: '11px' }}
                              onClick={() => openUpdateModal('allergies')}
                            >
                              <FaEdit className="text-xs" /> Update
                            </button>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {state.medicalRecords.medicalRecord.allgeric?.length > 0 ? (
                              state.medicalRecords.medicalRecord.allgeric.map((allergy, index) => (
                                <span key={index} className="bg-primary text-white px-6 py-1 rounded-full text-sm shadow hover:bg-tertiary transition cursor-pointer border border-primary/20">{allergy}</span>
                              ))
                            ) : (
                              <span className="text-[#00000080]">No data available</span>
                    )}
                  </div>
                </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-center py-8">No overview data available</div>
                    )}
              </div>
            </div>
                {/* Personal Records */}
                <div className="bg-gradient-to-br from-white to-background/60 rounded-lg shadow p-4 border-l-2 border-secondary transition-transform hover:-translate-y-0.5 hover:shadow-lg duration-200">
                  <div className="flex items-center gap-1 mb-2">
                    <FaUserFriends className="text-base text-secondary" />
                    <h4 className="text-base font-bold tracking-wide">Personal Records</h4>
                  </div>
                  {state.medicalRecords && state.medicalRecords.personalRecords ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Work Information */}
                      <div className="bg-white/80 rounded-md p-3 shadow border border-secondary/20">
                        <h6 className="font-semibold text-sm mb-1 border-b border-secondary/20 pb-0.5">Work Information</h6>
                        <div className="flex flex-col gap-2">
                          <div><span className="font-semibold">Work Name:</span> {state.medicalRecords.personalRecords.workName || 'N/A'}</div>
                          <div><span className="font-semibold">Work Place:</span> {state.medicalRecords.personalRecords.workPlace || 'N/A'}</div>
                        </div>
                      </div>
                      {/* Family Information */}
                      <div className="bg-white/80 rounded-md p-3 shadow border border-secondary/20">
                        <h6 className="font-semibold text-sm mb-1 border-b border-secondary/20 pb-0.5">Family Information</h6>
                        <div className="flex flex-col gap-2">
                          <div><span className="font-semibold">Number of Children:</span> {state.medicalRecords.personalRecords.childrenNumber || 'N/A'}</div>
                          <div><span className="font-semibold">First Child Birth Date:</span> {state.medicalRecords.personalRecords.birthDateOfFirstChild || 'N/A'}</div>
                          <div><span className="font-semibold">Number of Wives:</span> {state.medicalRecords.personalRecords.wifesNumber || 'N/A'}</div>
                        </div>
                      </div>
                      {/* Lifestyle Information */}
                      <div className="bg-white/80 rounded-md p-3 shadow border border-secondary/20 col-span-2">
                        <h6 className="font-semibold text-sm mb-1 border-b border-secondary/20 pb-0.5">Lifestyle Information</h6>
                        <div className="flex flex-wrap gap-6">
                          <div><span className="font-semibold">Smoking Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs ml-2 ${state.medicalRecords.personalRecords.smoking === 'Yes' ? 'bg-red-100 text-red-800' : state.medicalRecords.personalRecords.smoking === 'Former smoker' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{state.medicalRecords.personalRecords.smoking || 'N/A'}</span></div>
                          <div><span className="font-semibold">Alcohol Consumption:</span> <span className="px-2 py-0.5 rounded-full text-xs ml-2 bg-yellow-100 text-yellow-800">{state.medicalRecords.personalRecords.alcohol || 'N/A'}</span></div>
                          <div className="flex flex-col">
                            <span className="font-semibold mb-1">Pets:</span>
                            <div className="flex flex-wrap gap-2">
                              {state.medicalRecords.personalRecords.petsTypes && state.medicalRecords.personalRecords.petsTypes.length > 0 ? (
                                state.medicalRecords.personalRecords.petsTypes.map((pet, index) => (
                                  <span key={index} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs border border-blue-200 hover:bg-blue-100 cursor-pointer transition">{pet}</span>
                                ))
                              ) : (
                                <span className="text-gray-500">No pets recorded</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">No personal records available</div>
                  )}
                </div>
              </section>
            )}
            {activeSection === "medical-family-history" && (
              <section id="medical-family-history">
                {/* Medical Records */}
                <div className="bg-gradient-to-br from-white to-background/60 rounded-lg shadow p-4 mb-4 relative border-l-2 border-tertiary transition-transform hover:-translate-y-0.5 hover:shadow-lg duration-200">
                  <div className="flex items-center gap-1 mb-2 justify-between">
                    <span className="flex items-center gap-1">
                      <FaNotesMedical className="text-base text-tertiary" />
                      <h3 className="text-base font-bold tracking-wide">Medical Records</h3>
                    </span>
                    <button className="flex items-center gap-1 px-2 py-0.5 bg-tertiary text-white rounded shadow hover:bg-primary transition text-xs font-semibold" style={{ fontSize: '11px' }} onClick={() => openUpdateModal('medical-records', MEDICAL_RECORD_PARTS[0].key)}>
                      <FaEdit className="text-xs" /> Update
                    </button>
                  </div>
              <div className={!state.hasAccess ? "filter blur-sm" : ""}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Chronic Medications */}
                      <div className="bg-white/80 rounded-md p-3 shadow border border-tertiary/20 flex flex-col items-start">
                        <h4 className="text-sm font-semibold mb-1 border-b border-tertiary/20 pb-0.5">Chronic Medications</h4>
                        <ul className="flex flex-wrap gap-2 mt-2">
                          {state.medicalRecords?.medicalRecord?.chronicMedications?.length > 0 ? (
                            state.medicalRecords.medicalRecord.chronicMedications.map((med, index) => (
                              <li key={index} className="bg-tertiary/10 text-tertiary px-4 py-1 rounded-full text-sm font-medium border border-tertiary/20 hover:bg-tertiary/20 transition cursor-pointer">{med}</li>
                            ))
                          ) : (
                            <li className="text-gray-400">No data available</li>
                          )}
                    </ul>
                  </div>
                  {/* Surgeries */}
                      <div className="bg-white/80 rounded-md p-3 shadow border border-tertiary/20 flex flex-col items-start">
                        <h4 className="text-sm font-semibold mb-1 border-b border-tertiary/20 pb-0.5">Surgeries</h4>
                        <ul className="flex flex-wrap gap-2 mt-2">
                          {state.medicalRecords?.medicalRecord?.surgeries?.length > 0 ? (
                            state.medicalRecords.medicalRecord.surgeries.map((surgery, index) => (
                              <li key={index} className="bg-tertiary/10 text-tertiary px-4 py-1 rounded-full text-sm font-medium border border-tertiary/20 hover:bg-tertiary/20 transition cursor-pointer">{surgery}</li>
                            ))
                          ) : (
                            <li className="text-gray-400">No data available</li>
                          )}
                    </ul>
                  </div>
                  {/* Chronic Diseases */}
                      <div className="bg-white/80 rounded-md p-3 shadow border border-tertiary/20 flex flex-col items-start">
                        <h4 className="text-sm font-semibold mb-1 border-b border-tertiary/20 pb-0.5">Chronic Diseases</h4>
                        <ul className="flex flex-wrap gap-2 mt-2">
                          {state.medicalRecords?.medicalRecord?.chronicDiseases?.length > 0 ? (
                            state.medicalRecords.medicalRecord.chronicDiseases.map((disease, index) => (
                              <li key={index} className="bg-tertiary/10 text-tertiary px-4 py-1 rounded-full text-sm font-medium border border-tertiary/20 hover:bg-tertiary/20 transition cursor-pointer">{disease}</li>
                            ))
                          ) : (
                            <li className="text-gray-400">No data available</li>
                          )}
                    </ul>
                  </div>
                  {/* Vaccinations */}
                      <div className="bg-white/80 rounded-md p-3 shadow border border-tertiary/20 flex flex-col items-start">
                        <h4 className="text-sm font-semibold mb-1 border-b border-tertiary/20 pb-0.5">Vaccinations</h4>
                        <ul className="flex flex-wrap gap-2 mt-2">
                          {state.medicalRecords?.medicalRecord?.vaccinations?.length > 0 ? (
                            state.medicalRecords.medicalRecord.vaccinations.map((vaccine, index) => (
                              <li key={index} className="bg-tertiary/10 text-tertiary px-4 py-1 rounded-full text-sm font-medium border border-tertiary/20 hover:bg-tertiary/20 transition cursor-pointer">{vaccine}</li>
                            ))
                          ) : (
                            <li className="text-gray-400">No data available</li>
                          )}
                    </ul>
                  </div>
                </div>
                  </div>
                  {/* Restore Get Access button overlay if !state.hasAccess */}
                  {!state.hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <button
                        onClick={() => setShowAccessPopup(true)}
                        className="bg-[#16423C] text-white px-20 py-4 font-black rounded-lg text-[18.1px] flex items-center gap-2 shadow-lg"
                      >
                        <FaLock /> Get Access
                      </button>
                    </div>
                  )}
                </div>
                {/* Family History */}
                <div className="bg-gradient-to-br from-white to-background/60 rounded-lg shadow p-4 border-l-2 border-secondary transition-transform hover:-translate-y-0.5 hover:shadow-lg duration-200">
                  <div className="flex items-center gap-1 mb-2 justify-between">
                    <span className="flex items-center gap-1">
                      <FaUsers className="text-base text-secondary" />
                      <h4 className="text-base font-bold tracking-wide">Family History</h4>
                    </span>
                    <button className="flex items-center gap-1 px-2 py-0.5 bg-tertiary text-white rounded shadow hover:bg-primary transition text-xs font-semibold" style={{ fontSize: '11px' }} onClick={() => openUpdateModal('family-history', FAMILY_HISTORY_PARTS[0].key)}>
                      <FaEdit className="text-xs" /> Update
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Genetic Diseases */}
                    <div className="bg-white/80 rounded-md p-3 shadow border border-secondary/20 flex flex-col items-start">
                      <h5 className="text-sm font-semibold mb-1 border-b border-secondary/20 pb-0.5">Genetic Diseases</h5>
                      <ul className="flex flex-wrap gap-2 mt-2">
                        {state.medicalRecords?.medicalRecord?.familyHistory?.genaticsDiseases?.length > 0 ? (
                          state.medicalRecords.medicalRecord.familyHistory.genaticsDiseases.map((disease, index) => (
                            <li key={index} className="bg-secondary/20 text-primary px-4 py-1 rounded-full text-sm font-medium border border-secondary/30 hover:bg-secondary/40 transition cursor-pointer">{disease}</li>
                          ))
                        ) : (
                          <li className="text-gray-400">No data available</li>
                        )}
                                </ul>
                              </div>
                    {/* Genetics */}
                    <div className="bg-white/80 rounded-md p-3 shadow border border-secondary/20 flex flex-col items-start">
                      <h5 className="text-sm font-semibold mb-1 border-b border-secondary/20 pb-0.5">Genetics</h5>
                      <ul className="flex flex-wrap gap-2 mt-2">
                        {state.medicalRecords?.medicalRecord?.familyHistory?.genatics?.length > 0 ? (
                          state.medicalRecords.medicalRecord.familyHistory.genatics.map((genatic, index) => (
                            <li key={index} className="bg-secondary/20 text-primary px-4 py-1 rounded-full text-sm font-medium border border-secondary/30 hover:bg-secondary/40 transition cursor-pointer">{genatic}</li>
                          ))
                        ) : (
                          <li className="text-gray-400">No data available</li>
                        )}
                      </ul>
                            </div>
                  </div>
                </div>
              </section>
            )}
            {activeSection === "diagnosis-history" && (
              <section id="diagnosis-history">
                <div className="bg-gradient-to-br from-white to-background/60 rounded-lg shadow p-4 border-l-2 border-primary transition-transform hover:-translate-y-0.5 hover:shadow-lg duration-200">
                  <div className="flex items-center gap-1 mb-2">
                    <FaHistory className="text-base text-primary" />
                    <h4 className="text-base font-bold tracking-wide">Diagnosis History</h4>
                  </div>
                  <div className="relative">
                    {/* Timeline vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-1 bg-primary/10 rounded-full z-0" style={{ minHeight: '100%' }}></div>
                    <div className="space-y-8 ml-8">
                      {state.medicalRecords?.Diagnosis && state.medicalRecords.Diagnosis.length > 0 ? (
                        state.medicalRecords.Diagnosis.map((diagnosisEntry, index) => {
                          const isOpen = expandedDiagnosis.includes(index);
                          return (
                            <div key={index} className="relative group">
                              {/* Timeline dot/icon */}
                              <div className="absolute -left-8 top-8 z-10 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow border-2 border-white group-hover:scale-105 transition-transform">
                                  <FaNotesMedical className="text-white text-base" />
                                </div>
                              </div>
                              {/* Summary Card */}
                              <button
                                className={`w-full text-left bg-white/90 rounded-lg p-3 shadow border-l-2 border-primary/30 flex items-center justify-between hover:shadow-lg transition relative focus:outline-none text-sm ${isOpen ? 'mb-2' : ''}`}
                                onClick={() => toggleDiagnosis(index)}
                              >
                                <div className="flex items-center gap-4">
                                  <span className="font-bold text-lg text-primary">Diagnosis:</span>
                                  <span className="font-semibold text-lg text-gray-800">{diagnosisEntry.diagnosis.join(', ')}</span>
                                </div>
                                <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right text-primary"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </span>
                              </button>
                              {/* Details (collapsible) */}
                              <div
                                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                              >
                                <div className="bg-white/95 rounded-lg p-4 shadow border-l-2 border-primary/10 mt-1 text-sm">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                              <div>
                                      <h6 className="font-semibold mb-2 text-lg text-tertiary">Lab Results</h6>
                                      {diagnosisEntry.labResults && diagnosisEntry.labResults.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                          {diagnosisEntry.labResults.map((result, i) => (
                                        <a
                                          key={i}
                                          href={`http://localhost:3000/${result}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                              className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 border border-blue-200 transition"
                                        >
                                          View Result {i + 1}
                                        </a>
                                          ))}
                                  </div>
                                ) : (
                                        <p className="text-gray-400">No lab results available</p>
                                )}
                              </div>
                              <div>
                                      <h6 className="font-semibold mb-2 text-lg text-tertiary">X-rays</h6>
                                      {diagnosisEntry.Xray && diagnosisEntry.Xray.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {diagnosisEntry.Xray.map((xray, i) => (
                                      <a
                                        key={i}
                                        href={`http://localhost:3000/${xray}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                              className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 border border-blue-200 transition"
                                      >
                                        View X-ray {i + 1}
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                        <p className="text-gray-400">No X-rays available</p>
                                )}
                              </div>
                            </div>
                            {diagnosisEntry.prescription && (
                                    <div className="mb-4">
                                      <h6 className="font-semibold mb-2 text-lg text-primary">Prescription</h6>
                                      <div className="bg-gradient-to-r from-primary/5 to-tertiary/5 p-4 rounded-xl border-l-4 border-tertiary">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                            <p className="text-sm text-gray-500">Date: {new Date(diagnosisEntry.prescription.prescriptionDate).toLocaleDateString()}</p>
                                            {diagnosisEntry.prescription.followUpDate && (
                                              <p className="text-sm text-gray-500">Follow-up: {new Date(diagnosisEntry.prescription.followUpDate).toLocaleDateString()}</p>
                                      )}
                                    </div>
                                          <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow ${diagnosisEntry.prescription.prescriptionStatus === "Issued" ? "bg-green-100 text-green-800" : diagnosisEntry.prescription.prescriptionStatus === "Expired" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{diagnosisEntry.prescription.prescriptionStatus}</span>
                                  </div>
                                  <div className="space-y-2">
                                          {diagnosisEntry.prescription.prescriptionInstruction.map((instruction, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-white p-2 rounded border border-primary/10">
                                              <div className="flex-1 font-semibold">{instruction.medication}</div>
                                              <div className="flex-1">{instruction.dosage}</div>
                                              <div className="text-gray-600">{instruction.frequency}x/day</div>
                                              <div className="text-gray-600">{instruction.duration} weeks</div>
                                          </div>
                                          ))}
                                          </div>
                                          </div>
                                          </div>
                                    )}
                            {/* Consultations */}
                                  {diagnosisEntry.consultations && diagnosisEntry.consultations.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-primary/10">
                                      <h6 className="font-semibold mb-3 text-lg text-primary">Consultations</h6>
                                  <div className="space-y-2">
                                        {diagnosisEntry.consultations.map((consultation, i) => (
                                          <div key={i} className="bg-gray-50 p-4 rounded-lg border border-primary/10 flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-2 mb-2 md:mb-0">
                                              <span className="text-sm text-gray-500"><FaHistory className="inline mr-1 text-primary" /> {new Date(consultation.consultationDate).toLocaleDateString()}</span>
                                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ml-2 shadow ${consultation.consultationStatus === "Completed" ? "bg-green-100 text-green-800" : consultation.consultationStatus === "Scheduled" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>{consultation.consultationStatus}</span>
                                          </div>
                                            <p className="text-gray-700 font-medium">{consultation.consultationDescription}</p>
                                        </div>
                                        ))}
                                  </div>
                                </div>
                              )}
                          </div>
                      </div>
                  </div>
                          );
                        })
                      ) : (
                        <div className="bg-white rounded-lg p-8 text-center text-gray-500 shadow border border-primary/10">No diagnosis records available</div>
                              )}
                            </div>
                          </div>
                        </div>
              </section>
            )}
              </div>

          {/* Prescription Panel at the bottom */}
          <div className="w-full mt-8">
            <div className="bg-gradient-to-r from-tertiary/10 to-secondary/10 border-l-2 border-tertiary rounded-lg shadow p-4">
              <h3 className="text-base font-bold mb-4 text-primary flex items-center gap-1 border-b border-secondary/30 pb-2">
                <FaNotesMedical className="text-base" /> Prescription
              </h3>
              {/* Medication Row */}
              <div className="flex flex-wrap gap-3 mb-4 bg-white/70 rounded-md p-3 shadow-sm items-end">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-semibold mb-1">Medication</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md shadow-sm border-[#D0D5DD] placeholder-gray-500 focus:ring-1 focus:ring-tertiary text-xs"
                    placeholder="Medication"
                    value={newPrescription.medication}
                    onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                  />
                </div>
                <div className="flex-1 min-w-[100px]">
                  <label className="block text-xs font-semibold mb-1">Dosage</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md shadow-sm border-[#D0D5DD] placeholder-gray-500 focus:ring-1 focus:ring-tertiary text-xs"
                    placeholder="Dosage"
                    value={newPrescription.dosage}
                    onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-semibold mb-1">Frequency (per day)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md shadow-sm border-[#D0D5DD] placeholder-gray-500 focus:ring-1 focus:ring-tertiary text-xs"
                    placeholder="Frequency"
                    value={newPrescription.frequency}
                    onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-semibold mb-1">Duration (weeks)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md shadow-sm border-[#D0D5DD] placeholder-gray-500 focus:ring-1 focus:ring-tertiary text-xs"
                    placeholder="Duration"
                    value={newPrescription.duration}
                    onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                  />
                </div>
                <div className="flex items-center h-full">
                  <button
                    className="bg-tertiary text-white font-black w-8 h-8 flex items-center justify-center rounded-full text-base shadow hover:bg-primary transition mt-5"
                    onClick={addPrescription}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Diagnosis and Notes Row */}
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="flex-1 bg-white/70 rounded-md p-3 shadow-sm">
                  <label className="block text-xs font-semibold mb-1">Diagnosis</label>
                  <textarea
                    className="w-full h-16 p-2 border rounded-md shadow border-[#D0D5DD] placeholder-gray-500 focus:ring-1 focus:ring-tertiary text-xs"
                    placeholder="Diagnosis"
                    value={state.diagnosis}
                    onChange={(e) => updateProp('diagnosis', e.target.value.split(','))}
                  />
                </div>
                <div className="flex-1 bg-white/70 rounded-md p-3 shadow-sm">
                  <label className="block text-xs font-semibold mb-1">Notes</label>
                  <textarea
                    className="w-full h-16 p-2 border rounded-md shadow border-[#D0D5DD] placeholder-gray-500 focus:ring-1 focus:ring-tertiary text-xs"
                    placeholder="Notes"
                    value={state.notes}
                    onChange={(e) => updateProp('notes', e.target.value)}
                  ></textarea>
                </div>
              </div>
              {/* Prescription List */}
              {state.prescriptions && state.prescriptions.length > 0 && (
                <ul className="mt-2 space-y-1 mb-4">
                  {state.prescriptions.map((prescription, index) => (
                    <li
                      key={index}
                      className="text-xs text-[#000000] flex justify-between items-center bg-white rounded-md px-2 py-1 shadow border border-secondary/30"
                    >
                      <div>
                        <strong>Medication:</strong> {prescription.medication}, <strong>Dosage:</strong> {prescription.dosage}, <strong>Frequency:</strong> {prescription.frequency} times/day, <strong>Duration:</strong> {prescription.duration} weeks
                      </div>
                      <button
                        className="bg-red-500 text-white font-black w-6 h-6 flex items-center justify-center rounded-full text-xs shadow hover:bg-red-700 transition"
                        onClick={() => removePrescription(index)}
                      >
                        -
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {/* Follow Up Section */}
              <div className="flex flex-col md:flex-row items-center gap-3 mb-4 bg-white/70 rounded-md p-3 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-2 flex-1">
                  <label className="text-xs font-semibold mb-1 md:mb-0">Is there a follow-up?</label>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="followUp"
                        value="yes"
                        checked={!!state.followUpDate}
                        onChange={handleFollowUpChange}
                        className="accent-tertiary"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="followUp"
                        value="no"
                        checked={!state.followUpDate}
                        onChange={handleFollowUpChange}
                        className="accent-tertiary"
                      />
                      No
                    </label>
                  </div>
                </div>
                {state.followUpDate && (
                  <div className="flex flex-col gap-1 flex-1 max-w-xs">
                    <label className="text-xs font-semibold mb-1">Follow Up Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded shadow border-[#D0D5DD] focus:ring-1 focus:ring-tertiary text-xs"
                      value={state.followUpDate}
                      onChange={(e) => updateProp('followUpDate', e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="bg-primary text-white font-bold px-6 py-2 rounded-md text-xs shadow hover:bg-tertiary transition"
                  onClick={submitData}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAccessPopup && <AccessPopup />}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "" })}
        />
      )}
      {updateModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-xs mx-auto">
            <h3 className="text-base font-bold mb-2">Update {updateModal.section.replace('-', ' ')}
              {updateModal.section !== 'allergies' && (
                <span className="block text-xs font-normal mt-1 text-gray-500">{(updateModal.section === 'medical-records' ? MEDICAL_RECORD_PARTS : FAMILY_HISTORY_PARTS).find(p => p.key === updateModal.subSection)?.label}</span>
              )}
            </h3>
            {updateModal.section !== 'allergies' && (
              <div className="flex gap-2 mb-4">
                {(updateModal.section === 'medical-records' ? MEDICAL_RECORD_PARTS : FAMILY_HISTORY_PARTS).map(part => (
                  <button
                    key={part.key}
                    className={`px-2 py-1 rounded text-xs font-semibold border ${updateModal.subSection === part.key ? 'bg-tertiary text-white border-tertiary' : 'bg-gray-100 text-gray-700 border-gray-200'} transition`}
                    onClick={() => handleSelectSubSection(part.key)}
                  >
                    {part.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Add new item"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddEditItem(); }}
              />
              <button
                className="bg-primary text-white px-3 py-1 rounded text-xs font-semibold"
                onClick={handleAddEditItem}
              >
                Add
              </button>
            </div>
            <ul className="mb-4 max-h-32 overflow-y-auto">
              {editList.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between py-1 border-b last:border-b-0 text-sm">
                  <span>{item}</span>
                  <button
                    className="text-red-500 hover:text-red-700 text-xs px-2"
                    onClick={() => handleDeleteEditItem(idx)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold"
                onClick={closeUpdateModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 rounded bg-tertiary text-white text-xs font-semibold"
                onClick={handleSaveEditList}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicalRecordsScreen;
