import React, { useState } from "react";
import Logic from "./logic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faMapMarker,
  faIdCard,
  faVenusMars,
  faBriefcase,
  faCertificate,
  faBuilding,
  faClock,
  faMapPin,
  faPlus,
  faTrash,
  faCheckCircle,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { DOCTOR_INFO } from "../../helpers/constants/StaticKeys";
import DoctorImage from "../../assets/WhatsApp Image 2023-07-23 at 15.23.54.jpg";
import { ProfileScreen, addClinic, deleteClinic } from "../../api/services/ProfileScreen";

const ProfileScreenComponent = () => {
  const { state, updateProp } = Logic();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddClinic, setShowAddClinic] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, clinicId: null, clinicName: "" });
  const [newClinic, setNewClinic] = useState({
    clinicName: "",
    clinicCity: "",
    clinicArea: "",
    clinicAddress: "",
    clinicPhone: "",
    clinicEmail: "",
    clinicWebsite: "",
    clinicLocationLinks: "",
    Price: "",
    clinicWorkDays: [
      {
        day: "Sunday",
        workingHours: ["09:00-17:00"],
        NoBookings: 10
      }
    ]
  });

  // Custom alert function
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 4000);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Call the ProfileScreen service to update the doctor data
      ProfileScreen(
        { email: state.doctorEmail, newData: state },
        (response) => {
          console.log("Profile updated successfully:", response);
          showAlert("Profile updated successfully!", "success");
          // Update local storage with new data
          const currentDoctorData = JSON.parse(localStorage.getItem(DOCTOR_INFO) || '{}');
          const updatedDoctorData = {
            ...currentDoctorData,
            doctorName: state.doctorName,
            doctorDateOfBirth: state.doctorDateOfBirth,
            doctorPhone: state.doctorPhone,
            doctorEmail: state.doctorEmail
          };
          localStorage.setItem(DOCTOR_INFO, JSON.stringify(updatedDoctorData));
          setIsEditing(false);
        },
        (error) => {
          console.error("Error updating profile:", error);
          showAlert("Failed to update profile. Please try again.", "error");
        },
        () => {}
      );
    } else {
      setIsEditing(!isEditing);
    }
  };

  const handleAddClinic = () => {
    addClinic(
      { clinicData: newClinic },
      (response) => {
        console.log("Clinic added successfully:", response);
        showAlert("Clinic added successfully!", "success");
        
        // Update the state with the new clinic
        const newClinicWithId = {
          ...newClinic,
          _id: response.data?.clinic?._id || Date.now().toString() // Use response ID or generate temporary one
        };
        
        // Update the clinic array in state
        const updatedClinics = [...(state.clinic || []), newClinicWithId];
        updateProp("clinic", updatedClinics);
        
        // Update local storage
        const currentDoctorData = JSON.parse(localStorage.getItem(DOCTOR_INFO) || '{}');
        const updatedDoctorData = {
          ...currentDoctorData,
          clinic: updatedClinics
        };
        localStorage.setItem(DOCTOR_INFO, JSON.stringify(updatedDoctorData));
        
        setShowAddClinic(false);
        setNewClinic({
          clinicName: "",
          clinicCity: "",
          clinicArea: "",
          clinicAddress: "",
          clinicPhone: "",
          clinicEmail: "",
          clinicWebsite: "",
          clinicLocationLinks: "",
          Price: "",
          clinicWorkDays: [
            {
              day: "Sunday",
              workingHours: ["09:00-17:00"],
              NoBookings: 10
            }
          ]
        });
      },
      (error) => {
        console.error("Error adding clinic:", error);
        if (typeof error === 'string') {
          showAlert(`Error: ${error}`, "error");
        } else if (error.message) {
          showAlert(`Error: ${error.message}`, "error");
        } else {
          showAlert("An error occurred while adding the clinic. Please try again.", "error");
        }
      },
      () => {}
    );
  };

  const handleDeleteClinic = (clinicId) => {
    deleteClinic(
      { doctorEmail: state.doctorEmail, clinicId: clinicId },
      (response) => {
        console.log("Clinic deleted successfully:", response);
        showAlert("Clinic deleted successfully!", "success");
        
        // Remove the clinic from state
        const updatedClinics = (state.clinic || []).filter(clinic => clinic._id !== clinicId);
        updateProp("clinic", updatedClinics);
        
        // Update local storage
        const currentDoctorData = JSON.parse(localStorage.getItem(DOCTOR_INFO) || '{}');
        const updatedDoctorData = {
          ...currentDoctorData,
          clinic: updatedClinics
        };
        localStorage.setItem(DOCTOR_INFO, JSON.stringify(updatedDoctorData));
        
        // Close confirmation modal
        setDeleteConfirmation({ show: false, clinicId: null, clinicName: "" });
      },
      (error) => {
        console.error("Error deleting clinic:", error);
        showAlert("Failed to delete clinic. Please try again.", "error");
        setDeleteConfirmation({ show: false, clinicId: null, clinicName: "" });
      },
      () => {}
    );
  };

  const showDeleteConfirmation = (clinicId, clinicName) => {
    setDeleteConfirmation({ show: true, clinicId, clinicName });
  };

  const addWorkingDay = () => {
    setNewClinic(prev => ({
      ...prev,
      clinicWorkDays: [
        ...prev.clinicWorkDays,
        {
          day: "Sunday",
          workingHours: ["09:00-17:00"],
          NoBookings: 10
        }
      ]
    }));
  };

  const removeWorkingDay = (index) => {
    setNewClinic(prev => ({
      ...prev,
      clinicWorkDays: prev.clinicWorkDays.filter((_, i) => i !== index)
    }));
  };

  const updateWorkingDay = (index, field, value) => {
    setNewClinic(prev => ({
      ...prev,
      clinicWorkDays: prev.clinicWorkDays.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  const addWorkingHour = (dayIndex) => {
    setNewClinic(prev => ({
      ...prev,
      clinicWorkDays: prev.clinicWorkDays.map((day, i) => 
        i === dayIndex 
          ? { ...day, workingHours: [...day.workingHours, "09:00-17:00"] }
          : day
      )
    }));
  };

  const removeWorkingHour = (dayIndex, hourIndex) => {
    setNewClinic(prev => ({
      ...prev,
      clinicWorkDays: prev.clinicWorkDays.map((day, i) => 
        i === dayIndex 
          ? { ...day, workingHours: day.workingHours.filter((_, h) => h !== hourIndex) }
          : day
      )
    }));
  };

  const updateWorkingHour = (dayIndex, hourIndex, value) => {
    setNewClinic(prev => ({
      ...prev,
      clinicWorkDays: prev.clinicWorkDays.map((day, i) => 
        i === dayIndex 
          ? { 
              ...day, 
              workingHours: day.workingHours.map((hour, h) => 
                h === hourIndex ? value : hour
              )
            }
          : day
      )
    }));
  };

  return (
    <div className="w-full min-h-screen overflow-auto p-6">
      {/* Custom Alert */}
      {alert.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          alert.type === "success" 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon 
                icon={alert.type === "success" ? faCheckCircle : faExclamationTriangle} 
                className="text-xl"
              />
              <span className="font-medium">{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert({ show: false, message: "", type: "success" })}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="container mx-auto">
        {/* Profile Header */}
        <div className="bg-primary rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-full shadow-lg overflow-hidden">
              <img
                src={`http://localhost:3000/${state.doctorImage}`}
                onError={(e) => (e.target.src = DoctorImage)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                {state.doctorName}
              </h1>
              <p className="text-xl text-tertiary mt-2">{state.field}</p>
            </div>
          </div>
        </div>

        {/* Info Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-tertiary">
                Personal Information
              </h2>
              <div className="flex gap-2">
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-medium border-2 border-red-600 shadow-md"
                    style={{ minWidth: '80px', display: 'inline-block' }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleEditToggle}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                    isEditing
                      ? "bg-tertiary text-primary"
                      : "bg-primary text-white hover:bg-primary/80"
                  }`}
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>
            </div>
            <hr className="mb-5"></hr>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.doctorName}
                      onChange={(e) => updateProp("doctorName", e.target.value)}
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{state.doctorName}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Email</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.doctorEmail}
                      onChange={(e) =>
                        updateProp("doctorEmail", e.target.value)
                      }
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{state.doctorEmail}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Phone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.doctorPhone}
                      onChange={(e) =>
                        updateProp("doctorPhone", e.target.value)
                      }
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{state.doctorPhone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Date of Birth</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.doctorDateOfBirth}
                      onChange={(e) =>
                        updateProp("doctorDateOfBirth", e.target.value)
                      }
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <p className="text-lg font-semibold">
                      {state.doctorDateOfBirth}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faIdCard}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">National ID</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.nationalID}
                      onChange={(e) => updateProp("nationalID", e.target.value)}
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{state.nationalID}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faVenusMars}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Gender</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.Gender}
                      onChange={(e) => updateProp("Gender", e.target.value)}
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{state.Gender}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-tertiary mb-6">
              Professional Information
            </h2>
            <hr className="mb-5 mt-8"></hr>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Field of Specialization</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.field}
                      onChange={(e) => updateProp("field", e.target.value)}
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{state.field}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Years of Experience</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.yearsOfExprience}
                      onChange={(e) =>
                        updateProp("yearsOfExprience", e.target.value)
                      }
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <p className="text-lg font-semibold">
                      {state.yearsOfExprience}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faIdCard}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Syndicate ID</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.syndicateID}
                      onChange={(e) =>
                        updateProp("syndicateID", e.target.value)
                      }
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{state.syndicateID}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faIdCard}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Syndicate Card Number</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.syndicateCard}
                      onChange={(e) =>
                        updateProp("syndicateCard", e.target.value)
                      }
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <a
                      href={`http://localhost:3000/${state.syndicateCard}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-tertiary hover:text-primary-dark underline"
                    >
                      View Syndicate Card
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faCertificate}
                  className="text-primary w-6 h-6"
                />
                <div>
                  <p className="text-gray-600">Certificates</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={state.certificates}
                      onChange={(e) =>
                        updateProp("certificates", e.target.value)
                      }
                      className="text-lg font-semibold border-b border-gray-300"
                    />
                  ) : (
                    <div>
                      {Array.isArray(state.certificates) ? (
                        state.certificates.map((cert, idx) => (
                          <a
                            key={idx}
                            href={`http://localhost:3000/${cert}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-tertiary hover:text-primary-dark underline block"
                          >
                            View Certificate {idx + 1}
                          </a>
                        ))
                      ) : (
                        <a
                          href={`http://localhost:3000/${state.certificates}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-tertiary hover:text-primary-dark underline"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Information Card - Full Width */}
          <div className="md:col-span-2 bg-primary rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Clinic Information
              </h2>
              <button
                onClick={() => setShowAddClinic(true)}
                className="px-6 py-2 bg-tertiary text-primary rounded-lg hover:bg-tertiary/80 transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Clinic
              </button>
            </div>
            <div className="grid md:grid-cols-1 gap-8">
              {/* Clinic Info Fields */}
              {state.clinic && state.clinic.length > 0 ? (
                state.clinic.map((clinic, index) => (
                  <div key={index} className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-tertiary">
                        {clinic.clinicName || `Clinic ${index + 1}`}
                      </h3>
                      <button
                        onClick={() => showDeleteConfirmation(clinic._id, clinic.clinicName || `Clinic ${index + 1}`)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-white">Clinic License</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicLicense}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicLicense`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300 bg-primary text-white"
                          />
                        ) : (
                          <a
                            href={`http://localhost:3000/${clinic.clinicLicense}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-tertiary hover:text-primary-dark underline"
                          >
                            View Clinic License
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faMapMarker}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-white">Clinic City</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicCity}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicCity`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300 bg-primary text-white"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-white">
                            {clinic.clinicCity}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faMapPin}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-white">Clinic Area</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicArea}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicArea`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300 bg-primary text-white"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-white">
                            {clinic.clinicArea}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faMapMarker}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-white">Clinic Address</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicAddress}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicAddress`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300 bg-primary text-white"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-white">
                            {clinic.clinicAddress}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-white">Clinic Phone</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicPhone?.[0] || ""}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicPhone.0`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300 bg-primary text-white"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-white">
                            {typeof clinic.clinicPhone?.[0] === 'string' ? clinic.clinicPhone[0].replace(/[[\]"]/g, '') : clinic.clinicPhone?.[0] || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-white">Clinic Opening Hours</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicWorkDays[0].workingHours|| ""}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicWorkDays.0.workingHours`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300 bg-primary text-white"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-white">
                              {clinic.clinicWorkDays[0].workingHours || "N/A"}
                          </p>
                        )}
                      </div>
                    </div> */}

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-white">Clinic Work Days</p>
                        {isEditing ? (
                          <div>
                            {clinic.clinicWorkDays?.map((workDay, dayIndex) => (
                              <div key={dayIndex} className="mb-2 ">
                                <input
                                  type="text"
                                  value={workDay.day || ""}
                                  onChange={(e) =>
                                    updateProp(
                                      `clinic.${index}.clinicWorkDays.${dayIndex}.day`,
                                      e.target.value
                                    )
                                  }
                                  className="text-lg font-semibold border-b border-gray-300 mr-2 bg-primary text-white"
                                />
                                <span className="text-sm text-white">
                                {workDay.workingHours?.map((hours, i) => (
                                  <span key={i}>
                                    {hours}
                                    {i < workDay.workingHours.length - 1 ? ", " : ""}
                                  </span>
                                ))}

                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>
                            {clinic.clinicWorkDays?.map((workDay, dayIndex) => (
                              <p
                                key={dayIndex}
                                className="text-lg font-semibold text-white"
                              >
                                {workDay.day}:{" "}
                                <span className="text-sm text-gray-500">
                                {workDay.workingHours?.map((hours, i) => (
                                  <span key={i}>
                                    {hours}
                                    {i < workDay.workingHours.length - 1 ? ", " : ""}
                                  </span>
                                ))}

                                </span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faMapPin}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-white">Clinic Location Links</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicLocationLinks}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicLocationLinks`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300 bg-primary text-white"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-white">
                            {clinic.clinicLocationLinks}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No clinic information available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Clinic Modal */}
      {showAddClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Add New Clinic</h2>
                <button
                  onClick={() => setShowAddClinic(false)}
                  className="text-white hover:text-gray-200 transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Clinic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-tertiary mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBuilding} className="text-primary" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Clinic Name
                      </label>
                      <input
                        type="text"
                        value={newClinic.clinicName}
                        onChange={(e) => setNewClinic(prev => ({ ...prev, clinicName: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter clinic name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Clinic City
                      </label>
                      <input
                        type="text"
                        value={newClinic.clinicCity}
                        onChange={(e) => setNewClinic(prev => ({ ...prev, clinicCity: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Clinic Area
                      </label>
                      <input
                        type="text"
                        value={newClinic.clinicArea}
                        onChange={(e) => setNewClinic(prev => ({ ...prev, clinicArea: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter area"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Clinic Address
                      </label>
                      <input
                        type="text"
                        value={newClinic.clinicAddress}
                        onChange={(e) => setNewClinic(prev => ({ ...prev, clinicAddress: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter full address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Clinic Phone
                      </label>
                      <input
                        type="text"
                        value={newClinic.clinicPhone}
                        onChange={(e) => setNewClinic(prev => ({ ...prev, clinicPhone: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Clinic Email
                      </label>
                      <input
                        type="email"
                        value={newClinic.clinicEmail}
                        onChange={(e) => setNewClinic(prev => ({ ...prev, clinicEmail: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Clinic Website
                      </label>
                      <input
                        type="url"
                        value={newClinic.clinicWebsite}
                        onChange={(e) => setNewClinic(prev => ({ ...prev, clinicWebsite: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="https://example.com (optional)"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Location Links
                      </label>
                      <input
                        type="text"
                        value={newClinic.clinicLocationLinks}
                        onChange={(e) => setNewClinic(prev => ({ ...prev, clinicLocationLinks: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Google Maps link"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Consultation Price
                      </label>
                      <input
                        type="number"
                        value={newClinic.Price}
                        onChange={(e) => setNewClinic(prev => ({ ...prev, Price: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter price"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Working Days */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-tertiary flex items-center gap-2">
                      <FontAwesomeIcon icon={faClock} className="text-primary" />
                      Working Days & Hours
                    </h3>
                    <button
                      onClick={addWorkingDay}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Add Day
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newClinic.clinicWorkDays.map((workDay, dayIndex) => (
                      <div key={dayIndex} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-tertiary">Day {dayIndex + 1}</h4>
                          <button
                            onClick={() => removeWorkingDay(dayIndex)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Day
                            </label>
                            <select
                              value={workDay.day}
                              onChange={(e) => updateWorkingDay(dayIndex, 'day', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                              <option value="Sunday">Sunday</option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              No. of Bookings
                            </label>
                            <input
                              type="number"
                              value={workDay.NoBookings}
                              onChange={(e) => updateWorkingDay(dayIndex, 'NoBookings', parseInt(e.target.value))}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                              min="1"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Working Hours
                            </label>
                            <button
                              onClick={() => addWorkingHour(dayIndex)}
                              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                            >
                              Add Hour
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Working Hours
                          </label>
                          {workDay.workingHours.map((hour, hourIndex) => (
                            <div key={hourIndex} className="flex items-center gap-3">
                              <input
                                type="text"
                                value={hour}
                                onChange={(e) => updateWorkingHour(dayIndex, hourIndex, e.target.value)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="09:00-17:00"
                              />
                              <button
                                onClick={() => removeWorkingHour(dayIndex, hourIndex)}
                                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    onClick={() => setShowAddClinic(false)}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddClinic}
                    className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Clinic
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 text-center">
              <div className="text-red-500 mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl text-tertiary" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">Are you sure?</h2>
              <p className="text-gray-600">
                You are about to delete the clinic:
              </p>
              {deleteConfirmation.clinicName && (
                <p className="text-primary font-semibold text-lg my-2">
                  "{deleteConfirmation.clinicName}"
                </p>
              )}
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmation({ show: false, clinicId: null, clinicName: "" })}
                className="px-6 py-2 border border-gray-300 text-white bg-test rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClinic(deleteConfirmation.clinicId)}
                className="px-6 py-2 bg-red-600 text-white bg-primary rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreenComponent;
