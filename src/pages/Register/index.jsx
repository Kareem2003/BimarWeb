import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logic from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import AppSelect from "../../components/AppSelect";
import DoctorImage from "../../assets/doctor-standing-with-his-arms-crossed-with-copy-space.jpg";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

const RegisterScreen = () => {
  const { state, updateProp, handleRegister } = Logic();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [isRegistering, setIsRegistering] = useState(false);

  // Add work day to specific clinic
  const addWorkDay = (clinicIndex) => {
    const updatedClinics = [...state.clinic];
    updatedClinics[clinicIndex].clinicWorkDays.push({
      day: "",
      workingHours: [{ start: "", end: "" }],
      examinationDuration: 0,
      NoBookings: 0,
    });
    updateProp("clinic", updatedClinics);
  };

  // Remove work day from clinic
  const removeWorkDay = (clinicIndex, workDayIndex) => {
    const updatedClinics = [...state.clinic];
    updatedClinics[clinicIndex].clinicWorkDays = updatedClinics[
      clinicIndex
    ].clinicWorkDays.filter((_, i) => i !== workDayIndex);
    updateProp("clinic", updatedClinics);
  };

  // Update specific work day field
  const updateWorkDay = (clinicIndex, workDayIndex, field, value) => {
    const updatedClinics = [...state.clinic];
    updatedClinics[clinicIndex].clinicWorkDays[workDayIndex][field] = value; // Ensure value is a scalar
    updateProp("clinic", updatedClinics);
  };

  // Function to update a specific clinic field
  const updateClinicField = (index, field, value) => {
    const updatedClinics = [...state.clinic];
    if (field === "clinicPhone") {
      updatedClinics[index][field] = [value]; // Ensure this is an array
    } else {
      updatedClinics[index][field] = value;
    }
    updateProp("clinic", updatedClinics);
  };

  // Function to validate the current step before proceeding
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          // state.doctorName &&
          // state.doctorPhone &&
          state.doctorEmail && state.doctorPassword
        );
      case 2:
        return;
      case 3:
        return;
      case 4:
        return;
      case 5:
        return;

      default:
        return false;
    }
  };

  // Function to handle the "Next" button click
  const handleNextStep = () => {
    console.log(JSON.stringify(state));
    setCurrentStep(currentStep + 1);
    // if (validateStep(currentStep)) {
    //
    // } else {
    //   alert("Please fill out all fields before proceeding.");
    // }
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
      clinicPhone: [],
      clinicWorkDays: [
        {
          day: [],
          workingHours: [{ start: "", end: "" }],
          examinationDuration: 0,
          NoBookings: 0,
        },
      ],
      clinicLocationLinks: "",
      price: 0,
    };
    updateProp("clinic", [...state.clinic, newClinic]);
  };

  // Function to remove a clinic
  const removeClinic = (index) => {
    const updatedClinics = state.clinic.filter((_, i) => i !== index);
    updateProp("clinic", updatedClinics);
  };

  // Animation variants for Framer Motion
  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  // Function to handle the "Register" button click
  const handleRegisterClick = async () => {
    setIsRegistering(true);
    await handleRegister();
    setIsRegistering(false);
  };

  return (
    <div
      className="flex items-center justify-end min-h-screen p-6"
      style={{
        backgroundImage: `url(${DoctorImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Centered Form Container */}
      <div className="max-w-4xl bg-white/20 shadow-2xl overflow-hidden relative z-10 p-10 h-[120vh] mr-20">
        {/* Header Section with Progress Bar - Keep outside scroll area */}
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

        {/* Form Content - Scrollable Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === 5) {
              handleRegisterClick();
            }
          }}
          className="flex flex-col space-y-8 h-[calc(100%-200px)] overflow-y-auto overflow-x-hidden px-8"
        >
          <div className="flex-1 min-w-0">
            {" "}
            {/* Added min-w-0 to prevent flex items from expanding */}
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
                  <h3 className="text-xl font-semibold border-b-2 border-tertiary text-white pb-2">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <label className="block text-white">
                      Doctor Name <span className="text-red-500">*</span>
                    </label>
                    <AppInput
                      term={state.doctorName}
                      onChangeText={(e) =>
                        updateProp("doctorName", e.target.value)
                      }
                      placeholder="Enter your full name"
                    />
                    <label className="block text-white">
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
                    <label className="block text-white">
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
                    <label className="block text-white">
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
                  <h3 className="text-xl font-semibold text-white border-b-2 border-tertiary pb-2">
                    Additional Personal Information
                  </h3>
                  <div className="space-y-4">
                    <label className="block text-white">
                      National ID <span className="text-red-500">*</span>
                    </label>
                    <AppInput
                      term={state.nationalID}
                      onChangeText={(e) =>
                        updateProp("nationalID", e.target.value)
                      }
                      placeholder="Enter your national ID"
                    />
                    <label className="block text-white">
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
                    <label className="block text-white">
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
                  <h3 className="text-xl font-semibold text-white border-b-2 border-tertiary pb-2">
                    Professional Information
                  </h3>
                  <div className="space-y-4">
                    <label className="block text-white">
                      Field of Specialization{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <AppInput
                      term={state.field}
                      onChangeText={(e) => updateProp("field", e.target.value)}
                      placeholder="Enter your field"
                    />
                    <label className="block text-white">
                      Years of Experience{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <AppInput
                      term={state.yearsOfExprience}
                      onChangeText={(e) =>
                        updateProp("yearsOfExprience", e.target.value)
                      }
                      placeholder="Enter years of experience"
                      type="number"
                    />
                    <label className="block text-white">
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
                  <h3 className="text-xl font-semibold text-white border-b-2 border-tertiary pb-2">
                    Clinic Information
                  </h3>
                  <div className="space-y-4">
                    {state.clinic.map((clinic, clinicIndex) => (
                      <div
                        key={clinicIndex}
                        className="space-y-4 border p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-semibold text-tertiary">
                            Clinic {clinicIndex + 1}
                          </h4>
                          {state.clinic.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeClinic(clinicIndex)}
                              className="bg-primary text-secondary px-4 py-2 rounded-lg"
                            >
                              Remove Clinic
                            </button>
                          )}
                        </div>

                        {/* Clinic Basic Information */}
                        <div className="space-y-4">
                          <label className="block text-white">
                            Clinic City <span className="text-red-500">*</span>
                          </label>
                          <AppInput
                            term={clinic.clinicCity}
                            onChangeText={(e) =>
                              updateClinicField(
                                clinicIndex,
                                "clinicCity",
                                e.target.value
                              )
                            }
                            placeholder="Enter clinic city"
                          />

                          <label className="block text-white">
                            Clinic Area <span className="text-red-500">*</span>
                          </label>
                          <AppInput
                            term={clinic.clinicArea}
                            onChangeText={(e) =>
                              updateClinicField(
                                clinicIndex,
                                "clinicArea",
                                e.target.value
                              )
                            }
                            placeholder="Enter clinic area"
                          />

                          <label className="block text-white">
                            Clinic Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <AppInput
                            term={clinic.clinicAddress}
                            onChangeText={(e) =>
                              updateClinicField(
                                clinicIndex,
                                "clinicAddress",
                                e.target.value
                              )
                            }
                            placeholder="Enter clinic address"
                          />

                          <label className="block text-white">
                            Clinic Phone <span className="text-red-500">*</span>
                          </label>
                          <AppInput
                            term={clinic.clinicPhone[0] || ""}
                            onChangeText={(e) =>
                              updateClinicField(
                                clinicIndex,
                                "clinicPhone",
                                e.target.value
                              )
                            }
                            placeholder="Enter clinic phone"
                          />
                          <label className="block text-white">
                            Clinic Email <span className="text-red-500">*</span>
                          </label>
                          <AppInput
                            term={clinic.clinicEmail}
                            onChangeText={(e) =>
                              updateClinicField(
                                clinicIndex,
                                "clinicEmail",
                                e.target.value
                              )
                            }
                            placeholder="Enter clinic email"
                          />

                          <label className="block text-white">
                            Consultation Price{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <AppInput
                            term={clinic.price}
                            onChangeText={(e) =>
                              updateClinicField(
                                clinicIndex,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="Enter consultation price"
                            type="number"
                          />
        
                          <label className="block text-white">
                            Clinic Website{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <AppInput
                            term={clinic.clinicWebsite}
                            onChangeText={(e) =>
                              updateClinicField(
                                clinicIndex,
                                "clinicWebsite",
                                e.target.value
                              )
                            }
                            placeholder="Enter clinic website URL"
                          />

                          <label className="block text-white">
                            Clinic Location Links{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <AppInput
                            term={clinic.clinicLocationLinks}
                            onChangeText={(e) =>
                              updateClinicField(
                                clinicIndex,
                                "clinicLocationLinks",
                                e.target.value
                              )
                            }
                            placeholder="Enter clinic location link"
                          />
                        </div>

                        {/* Work Days Section */}
                        <div className="space-y-4">
                          <h5 className="font-medium text-tertiary">
                            Working Days
                          </h5>
                          {clinic.clinicWorkDays.map(
                            (workDay, workDayIndex) => (
                              <div
                                key={workDayIndex}
                                className="space-y-4 border p-4 rounded-lg"
                              >
                                <div className="flex justify-between items-center">
                                  <h6 className="font-medium text-tertiary">
                                    Day {workDayIndex + 1}
                                  </h6>
                                  {clinic.clinicWorkDays.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeWorkDay(clinicIndex, workDayIndex)
                                      }
                                      className="text-red-500 text-sm"
                                    >
                                      Remove Day
                                    </button>
                                  )}
                                </div>

                                <label className="block text-white">Day</label>
                                <AppSelect
                                  selectedValue={workDay.day} // Ensure this is a scalar value (e.g., "Monday")
                                  onChange={(e) =>
                                    updateWorkDay(
                                      clinicIndex,
                                      workDayIndex,
                                      "day",
                                      e.target.value // This should be a scalar value
                                    )
                                  }
                                  options={[
                                    { value: "Sunday", label: "Sunday" },
                                    { value: "Monday", label: "Monday" },
                                    { value: "Tuesday", label: "Tuesday" },
                                    { value: "Wednesday", label: "Wednesday" },
                                    { value: "Thursday", label: "Thursday" },
                                    { value: "Friday", label: "Friday" },
                                    { value: "Saturday", label: "Saturday" },
                                  ]}
                                  placeholder="Select day"
                                />

                                <label className="block text-white">
                                  Working Hours
                                </label>
                                <div className="space-y-2">
                                  {workDay.workingHours.map(
                                    (slot, slotIndex) => (
                                      <div
                                        key={slotIndex}
                                        className="flex gap-4 items-center"
                                      >
                                        <TimePicker
                                          className={
                                            "border-2 border-tertiary rounded-lg"
                                          }
                                          value={slot.start || ""}
                                          onChange={(time) => {
                                            const updatedHours = [
                                              ...workDay.workingHours,
                                            ];
                                            updatedHours[slotIndex] = {
                                              ...updatedHours[slotIndex],
                                              start: time,
                                            };
                                            updateWorkDay(
                                              clinicIndex,
                                              workDayIndex,
                                              "workingHours",
                                              updatedHours
                                            );
                                          }}
                                          placeholder="Start Time"
                                        />
                                        <span>to</span>
                                        <TimePicker
                                          className={
                                            "border-2 border-tertiary rounded-lg"
                                          }
                                          value={slot.end || ""}
                                          onChange={(time) => {
                                            const updatedHours = [
                                              ...workDay.workingHours,
                                            ];
                                            updatedHours[slotIndex] = {
                                              ...updatedHours[slotIndex],
                                              end: time,
                                            };
                                            updateWorkDay(
                                              clinicIndex,
                                              workDayIndex,
                                              "workingHours",
                                              updatedHours
                                            );
                                          }}
                                          placeholder="End Time"
                                        />
                                        {workDay.workingHours.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updatedHours =
                                                workDay.workingHours.filter(
                                                  (_, i) => i !== slotIndex
                                                );
                                              updateWorkDay(
                                                clinicIndex,
                                                workDayIndex,
                                                "workingHours",
                                                updatedHours
                                              );
                                            }}
                                            className="text-red-500 text-sm"
                                          >
                                            Remove
                                          </button>
                                        )}
                                      </div>
                                    )
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedHours = [
                                        ...workDay.workingHours,
                                        { start: "", end: "" },
                                      ];
                                      updateWorkDay(
                                        clinicIndex,
                                        workDayIndex,
                                        "workingHours",
                                        updatedHours
                                      );
                                    }}
                                    className="bg-tertiary text-black px-3 py-1 rounded text-sm"
                                  >
                                    Add Time Slot
                                  </button>
                                </div>

                                <label className="block text-white">
                                  Examination Duration (minutes)
                                </label>
                                <AppInput
                                  term={workDay.examinationDuration}
                                  onChangeText={(e) =>
                                    updateWorkDay(
                                      clinicIndex,
                                      workDayIndex,
                                      "examinationDuration",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="30"
                                />
                                {/* <AppInput
                                type="number"
                                value={workDay.examinationDuration}
                                onChange={(e) => {
                                  updateWorkDay(
                                    clinicIndex,
                                    workDayIndex,
                                    "examinationDuration",
                                    e.target.value
                                  );
                                }}
                                placeholder="30"
                              /> */}

                                <label className="block text-white">
                                  Number of Bookings
                                  <span className="text-red-500">*</span>
                                </label>
                                <AppInput
                                  term={workDay.NoBookings || 0}
                                  onChangeText={(e) =>
                                    updateWorkDay(
                                      clinicIndex,
                                      workDayIndex,
                                      "NoBookings",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  placeholder="0"
                                />
                              </div>
                            )
                          )}

                          <button
                            type="button"
                            onClick={() => addWorkDay(clinicIndex)}
                            className="bg-tertiary text-black px-3 py-1 rounded text-sm"
                          >
                            Add Work Day
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Clinic Button */}
                    <button
                      type="button"
                      onClick={addClinic}
                      className="bg-tertiary text-black px-4 py-2 rounded-lg"
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
                  <h3 className="text-xl font-semibold text-white border-b-2 border-tertiary pb-2">
                    Upload Files
                  </h3>
                  <div className="space-y-4">
                    {state.clinic.map((clinic, index) => (
                      <div key={index}>
                        <h4 className="text-lg font-semibold">
                          Clinic {index + 1}
                        </h4>
                        <label className="block text-white">
                          Clinic License <span className="text-red-500">*</span>
                        </label>
                        <AppInput
                          type="file"
                          onChangeText={(e) => {
                            console.log(e.target);
                            updateClinicField(
                              index,
                              "clinicLicense",
                              e.target.files[index]
                            );
                          }}
                          accept="image/*"
                        />
                      </div>
                    ))}
                    <label className="block text-white">
                      Doctor Image <span className="text-red-500">*</span>
                    </label>
                    <AppInput
                      type="file"
                      onChangeText={(e) => {
                        updateProp("doctorImage", e.target.files[0]);
                      }}
                      accept="image/*"
                    />

                    <label className="block text-white">
                      Syndicate Card <span className="text-red-500">*</span>
                    </label>
                    <AppInput
                      type="file"
                      onChangeText={(e) =>
                        updateProp("syndicateCard", e.target.files[0])
                      }
                      accept="image/*"
                    />
                    <label className="block text-white">
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
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center text-center sticky bottom-0 w-full">
            {currentStep > 1 && (
              <AppButton
                title="Previous"
                onPress={handlePreviousStep}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition duration-300"
              />
            )}
            {currentStep < 5 && (
              <AppButton
                title="Next"
                onPress={handleNextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-300"
              />
            )}
            {currentStep === 5 && (
              <AppButton
                title="Register"
                type="submit"
                className={`bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-300 ${
                  isRegistering ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isRegistering}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
