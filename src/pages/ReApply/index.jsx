import React from "react";
import { ReApplyLogic } from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { Link } from "react-router-dom";

const ReApply = () => {
  const { loading, doctorData, setDoctorData, handleSubmit, isSubmitted } =
    ReApplyLogic();

  if (isSubmitted) {
    return (
      <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl p-8 text-center bg-white rounded-lg shadow-md">
          <AuthTitles
            title="Application Submitted"
            subTitle="Thank you. Your application has been submitted and will be reviewed shortly."
          />
          <Link
            to="/login"
            className="mt-6 inline-block px-6 py-2 text-white bg-primary rounded-md hover:bg-tertiary"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <AuthTitles
          title="Update Your Application"
          subTitle="Please review and update your details below before resubmitting."
        />

        {loading ? (
          <p>Loading doctor details...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <AppInput
              label="Doctor Name"
              type="text"
              value={doctorData.doctorName || ""}
              onChange={(e) =>
                setDoctorData({ ...doctorData, doctorName: e.target.value })
              }
            />
            <AppInput
              label="Doctor Email"
              type="email"
              value={doctorData.doctorEmail || ""}
              onChange={(e) =>
                setDoctorData({ ...doctorData, doctorEmail: e.target.value })
              }
            />
            {/* Add other fields from the doctor model here as needed */}
            {/* Example for a text field */}
            <AppInput
              label="Specialization"
              type="text"
              value={doctorData.field || ""}
              onChange={(e) =>
                setDoctorData({
                  ...doctorData,
                  field: e.target.value,
                })
              }
            />

            <AppButton
              type="submit"
              label="Resubmit Application"
              loading={loading}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default ReApply; 