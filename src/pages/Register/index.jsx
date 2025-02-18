import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logic from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import AppSelect from "../../components/AppSelect";
import DoctorImage from "../../assets/doctorLogin.jpg";

const RegisterScreen = () => {
  const { state, updateProp, handleRegister } = Logic();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Function to validate the current step before proceeding
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          state.doctorName &&
          state.doctorPhone &&
          state.doctorEmail &&
          state.doctorPassword
        );
      case 2:
        return state.nationalID && state.Gender && state.doctorDateOfBirth;
      case 3:
        return state.field && state.yearsOfExprience && state.syndicateID;
      case 4:
        return state.clinic.every(
          (clinic) =>
            clinic.clinicCity &&
            clinic.clinicArea &&
            clinic.clinicAddress &&
            clinic.clinicPhone[0] &&
            clinic.clinicOpeningHours[0] &&
            clinic.clinicWorkDays[0] &&
            clinic.clinicLocationLinks
        );
      case 5:
        state.clinic.every((clinic) => clinic.clinicLicense);
        return state.doctorImage && state.certificates && state.syndicateCard;

      default:
        return false;
    }
  };

  // Function to handle the "Next" button click
  const handleNextStep = () => {
    console.log(JSON.stringify(state));
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Please fill out all fields before proceeding.");
    }
  };

  // Function to handle the "Previous" button click
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Function to add a new clinic
  const addClinic = () => {
    const newClinic = {
      clinicLicense: "",
      clinicCity: "",
      clinicArea: "",
      clinicAddress: "",
      clinicPhone: [""],
      clinicEmail: "",
      clinicWebsite: "",
      clinicOpeningHours: [""],
      clinicWorkDays: [""],
      clinicLocationLinks: "",
    };
    updateProp("clinic", [...state.clinic, newClinic]);
  };

  // Function to remove a clinic
  const removeClinic = (index) => {
    const updatedClinics = state.clinic.filter((_, i) => i !== index);
    updateProp("clinic", updatedClinics);
  };

  // Function to update a specific clinic field
  const updateClinic = (index, field, value) => {
    const updatedClinics = [...state.clinic];
    updatedClinics[index][field] = value;
    updateProp("clinic", updatedClinics);
  };

  // Animation variants for Framer Motion
  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage: `url(${DoctorImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Centered Form Container */}
      <div className="max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden relative z-10 p-10">
        {/* Header Section */}
        <div className="p-8 text-center">
          <AuthTitles
            text="Doctor Registration"
            descriptionText={
              <div className="flex items-center justify-center">
                {[...Array(totalSteps)].map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center">
                      {/* Bullet */}
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          currentStep > index + 1
                            ? ""
                            : currentStep === index + 1
                            ? "bg-tertiary border-2 border-white"
                            : "bg-secondary border-2 border-white/40"
                        }`}
                      >
                        <span
                          className={`font-bold ${
                            currentStep > index + 1
                              ? "text-primary bg-tertiary w-8 h-8 rounded-full"
                              : currentStep === index + 1
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                      {/* Line */}
                      {index < totalSteps - 1 && (
                        <motion.div
                          className={`h-1 w-12 transition-colors duration-300 ${
                            currentStep > index + 1
                              ? "bg-tertiary"
                              : "bg-primary"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: "4rem" }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            }
            titleClass="text-4xl font-bold text-primary mb-4"
            descClass="text-white/80"
          />
        </div>

        {/* Form Content */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === 5) {
              handleRegister();
            }
          }}
          className="flex flex-col p-8 space-y-8"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold border-b-2 border-blue-500 pb-2">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <label className="block text-gray-700">
                    Doctor Name <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    term={state.doctorName}
                    onChangeText={(e) =>
                      updateProp("doctorName", e.target.value)
                    }
                    placeholder="Enter your full name"
                  />
                  <label className="block text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    term={state.doctorPhone}
                    onChangeText={(e) =>
                      updateProp("doctorPhone", e.target.value)
                    }
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                  <label className="block text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    term={state.doctorEmail}
                    onChangeText={(e) =>
                      updateProp("doctorEmail", e.target.value)
                    }
                    placeholder="Enter your email"
                    type="email"
                  />
                  <label className="block text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    type={state.showPassword ? "text" : "password"}
                    term={state.doctorPassword}
                    onChangeText={(e) =>
                      updateProp("doctorPassword", e.target.value)
                    }
                    placeholder="Create a password"
                    secureTextEntry={!state.showPassword}
                    onIconPress={() =>
                      updateProp("showPassword", !state.showPassword)
                    }
                    iconName={state.showPassword ? "eye" : "eye-slash"}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Additional Personal Information */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
                  Additional Personal Information
                </h3>
                <div className="space-y-4">
                  <label className="block text-gray-700">
                    National ID <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    term={state.nationalID}
                    onChangeText={(e) =>
                      updateProp("nationalID", e.target.value)
                    }
                    placeholder="Enter your national ID"
                  />
                  <label className="block text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <AppSelect
                    selectedValue={state.Gender}
                    onChange={(e) => updateProp("Gender", e.target.value)}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                    ]}
                    placeholder="Select Gender"
                  />
                  <label className="block text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    term={state.doctorDateOfBirth}
                    onChangeText={(e) =>
                      updateProp("doctorDateOfBirth", e.target.value)
                    }
                    placeholder="Select your date of birth"
                    type="date"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Professional Information */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
                  Professional Information
                </h3>
                <div className="space-y-4">
                  <label className="block text-gray-700">
                    Field of Specialization{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    term={state.field}
                    onChangeText={(e) => updateProp("field", e.target.value)}
                    placeholder="Enter your field"
                  />
                  <label className="block text-gray-700">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    term={state.yearsOfExprience}
                    onChangeText={(e) =>
                      updateProp("yearsOfExprience", e.target.value)
                    }
                    placeholder="Enter years of experience"
                    type="number"
                  />
                  <label className="block text-gray-700">
                    Syndicate ID <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    term={state.syndicateID}
                    onChangeText={(e) =>
                      updateProp("syndicateID", e.target.value)
                    }
                    placeholder="Enter syndicate ID"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Certificates and Basic Clinic Information */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
                  Clinic Information
                </h3>
                <div className="space-y-4">
                  {/* Render clinics dynamically */}
                  {state.clinic.map((clinic, index) => (
                    <div
                      key={index}
                      className="space-y-4 border p-4 rounded-lg"
                    >
                      <h4 className="text-lg font-semibold">
                        Clinic {index + 1}
                      </h4>
                      <label className="block text-gray-700">
                        Clinic City <span className="text-red-500">*</span>
                      </label>
                      <AppInput
                        term={clinic.clinicCity}
                        onChangeText={(e) =>
                          updateClinic(index, "clinicCity", e.target.value)
                        }
                        placeholder="Enter clinic city"
                      />
                      <label className="block text-gray-700">
                        Clinic Area <span className="text-red-500">*</span>
                      </label>
                      <AppInput
                        term={clinic.clinicArea}
                        onChangeText={(e) =>
                          updateClinic(index, "clinicArea", e.target.value)
                        }
                        placeholder="Enter clinic area"
                      />
                      <label className="block text-gray-700">
                        Clinic Address
                      </label>
                      <AppInput
                        term={clinic.clinicAddress}
                        onChangeText={(e) =>
                          updateClinic(index, "clinicAddress", e.target.value)
                        }
                        placeholder="Enter clinic address"
                      />
                      <label className="block text-gray-700">
                        Clinic Phone
                      </label>
                      <AppInput
                        term={clinic.clinicPhone[0]}
                        onChangeText={(e) =>
                          updateClinic(index, "clinicPhone", [e.target.value])
                        }
                        placeholder="Enter clinic phone"
                      />
                      <label className="block text-gray-700">
                        Clinic Opening Hours
                      </label>
                      <AppInput
                        term={clinic.clinicOpeningHours[0]}
                        onChangeText={(e) =>
                          updateClinic(index, "clinicOpeningHours", [
                            e.target.value,
                          ])
                        }
                        placeholder="Enter opening hours"
                      />
                      <label className="block text-gray-700">
                        Clinic Work Days
                      </label>
                      <AppInput
                        term={clinic.clinicWorkDays[0]}
                        onChangeText={(e) =>
                          updateClinic(index, "clinicWorkDays", [
                            e.target.value,
                          ])
                        }
                        placeholder="Enter work days"
                      />
                      <label className="block text-gray-700">
                        Clinic Location Links
                      </label>
                      <AppInput
                        term={clinic.clinicLocationLinks}
                        onChangeText={(e) =>
                          updateClinic(
                            index,
                            "clinicLocationLinks",
                            e.target.value
                          )
                        }
                        placeholder="Enter location links"
                      />
                      {/* Button to remove clinic */}
                      {state.clinic.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeClinic(index)}
                          className="bg-red-500 text-white bg-primary px-4 py-2 rounded-lg"
                        >
                          Remove Clinic
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Button to add a new clinic */}
                  <button
                    type="button"
                    onClick={addClinic}
                    className="bg-green-500 text-white bg-primary px-4 py-2 rounded-lg"
                  >
                    Add Clinic
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Clinic Details */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
                  Upload Files
                </h3>
                <div className="space-y-4">
                  {state.clinic.map((clinic, index) => (
                    <div key={index}>
                      <h4 className="text-lg font-semibold">
                        Clinic {index + 1}
                      </h4>
                      <label className="block text-gray-700">
                        Clinic License <span className="text-red-500">*</span>
                      </label>
                      <AppInput
                        type="file"
                        onChangeText={(e) => {
                          console.log(e.target);
                          updateClinic(
                            index,
                            "clinicLicense",
                            e.target.files[index]
                          );
                        }}
                        accept="image/*"
                      />
                    </div>
                  ))}
                  <label className="block text-gray-700">
                    Doctor Image <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    type="file"
                    onChangeText={(e) => {
                      updateProp("doctorImage", e.target.files[0]);
                    }}
                    accept="image/*"
                  />

                  <label className="block text-gray-700">
                    Syndicate Card <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    type="file"
                    onChangeText={(e) =>
                      updateProp("syndicateCard", e.target.files[0])
                    }
                    accept="image/*"
                  />
                  <label className="block text-gray-700">
                    Certificates <span className="text-red-500">*</span>
                  </label>
                  <AppInput
                    type="file"
                    multiple
                    onChangeText={(e) =>
                      updateProp("certificates", [...e.target.files])
                    }
                    accept="image/*"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <AppButton
                title="Previous"
                onPress={handlePreviousStep}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              />
            )}
            {currentStep < 5 ? (
              <AppButton
                title="Next"
                onPress={handleNextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              />
            ) : (
              <AppButton
                title="Register"
                onPress={handleRegister}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
