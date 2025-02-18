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

const ProfileScreen = () => {
  const { state, updateProp } = Logic();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Profile Header */}
      {/* <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center mb-6">
            <FontAwesomeIcon icon={faUser} className="text-6xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold">{state.doctorName}</h1>
          <p className="text-gray-200 mt-2">{state.field}</p>
        </div>
      </div> */}

      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center mb-6">
            <img
              src={state.doctorImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold">{state.doctorName}</h1>
          <p className="text-gray-200 mt-2">{state.field}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section: Personal Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Personal Information
            </h2>

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

              <button
                onClick={handleEditToggle}
                className="mt-4 bg-primary text-white py-2 px-4 rounded"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
          </div>

          {/* Right Section: Professional Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Professional Information
            </h2>

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
                    <p className="text-lg font-semibold">
                      {state.syndicateCard}
                    </p>
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
                    <p className="text-lg font-semibold">
                      {state.certificates}
                    </p>
                  )}
                </div>
              </div>

              {/* Clinic Information */}
              {state.clinic && state.clinic.length > 0 ? (
                state.clinic.map((clinic, index) => (
                  <div key={index} className="space-y-4 border-t pt-4">
                    <h3 className="text-xl font-semibold text-primary">
                      Clinic {index + 1}
                    </h3>

                    <div className="flex items-center space-x-4">
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className="text-primary w-6 h-6"
                      />
                      <div>
                        <p className="text-gray-600">Clinic License</p>
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
                            className="text-lg font-semibold border-b border-gray-300"
                          />
                        ) : (
                          <p className="text-lg font-semibold">
                            {clinic.clinicLicense}
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
                        <p className="text-gray-600">Clinic City</p>
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
                            className="text-lg font-semibold border-b border-gray-300"
                          />
                        ) : (
                          <p className="text-lg font-semibold">
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
                        <p className="text-gray-600">Clinic Area</p>
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
                            className="text-lg font-semibold border-b border-gray-300"
                          />
                        ) : (
                          <p className="text-lg font-semibold">
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
                        <p className="text-gray-600">Clinic Address</p>
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
                            className="text-lg font-semibold border-b border-gray-300"
                          />
                        ) : (
                          <p className="text-lg font-semibold">
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
                        <p className="text-gray-600">Clinic Phone</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicPhone[0]}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicPhone.0`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300"
                          />
                        ) : (
                          <p className="text-lg font-semibold">
                            {clinic.clinicPhone[0]}
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
                        <p className="text-gray-600">Clinic Opening Hours</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicOpeningHours[0]}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicOpeningHours.0`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300"
                          />
                        ) : (
                          <p className="text-lg font-semibold">
                            {clinic.clinicOpeningHours[0]}
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
                        <p className="text-gray-600">Clinic Work Days</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={clinic.clinicWorkDays[0]}
                            onChange={(e) =>
                              updateProp(
                                `clinic.${index}.clinicWorkDays.0`,
                                e.target.value
                              )
                            }
                            className="text-lg font-semibold border-b border-gray-300"
                          />
                        ) : (
                          <p className="text-lg font-semibold">
                            {clinic.clinicWorkDays[0]}
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
                        <p className="text-gray-600">Clinic Location Links</p>
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
                            className="text-lg font-semibold border-b border-gray-300"
                          />
                        ) : (
                          <p className="text-lg font-semibold">
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
