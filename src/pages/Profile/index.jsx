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
} from "@fortawesome/free-solid-svg-icons";
import { DOCTOR_INFO } from "../../helpers/constants/StaticKeys";
import DoctorImage from "../../assets/WhatsApp Image 2023-07-23 at 15.23.54.jpg";

const ProfileScreen = () => {
  const { state, updateProp } = Logic();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="w-full min-h-screen overflow-auto p-6">
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
              <button
                onClick={handleEditToggle}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isEditing
                    ? "bg-tertiary text-primary"
                    : "bg-primary text-white hover:bg-primary/80"
                }`}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
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
            <h2 className="text-2xl font-bold text-white mb-6">
              Clinic Information
            </h2>
            <div className="grid md:grid-cols-1 gap-8">
              {/* Clinic Info Fields */}
              {state.clinic && state.clinic.length > 0 ? (
                state.clinic.map((clinic, index) => (
                  <div key={index} className="space-y-4 border-t pt-4">
                    <h3 className="text-xl font-semibold text-tertiary">
                      Clinic {index + 1}
                    </h3>

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
                            {clinic.clinicPhone?.[0] || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-white">Clinic Opening Hours</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicOpeningHours?.[0] || ""}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicOpeningHours.0`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300 bg-primary text-white"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-white">
                            {clinic.clinicOpeningHours?.[0] || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>

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
                                      {hours.start} - {hours.end}
                                      {i < workDay.workingHours.length - 1
                                        ? ", "
                                        : ""}
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
                                      {hours.start} - {hours.end}
                                      {i < workDay.workingHours.length - 1
                                        ? ", "
                                        : ""}
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
    </div>
  );
};

export default ProfileScreen;
