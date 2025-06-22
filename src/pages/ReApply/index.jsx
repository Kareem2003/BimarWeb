import React from "react";
import { ReApplyLogic } from "./logic";
import { Link } from "react-router-dom";

const ReApply = () => {
  const { loading, doctorData, setDoctorData, handleSubmit, isSubmitted } =
    ReApplyLogic();

  // File handlers
  const handleFileChange = (field, file) => {
    setDoctorData({ ...doctorData, [field]: file });
  };
  const handleCertificatesChange = (e) => {
    setDoctorData({ ...doctorData, certificates: Array.from(e.target.files) });
  };

  // Clinic helpers (unchanged)
  const updateClinicField = (index, field, value) => {
    const clinics = [...(doctorData.clinic || [])];
    clinics[index][field] = value;
    setDoctorData({ ...doctorData, clinic: clinics });
  };
  const addClinic = () => {
    setDoctorData({
      ...doctorData,
      clinic: [
        ...(doctorData.clinic || []),
        {
          clinicName: "",
          clinicCity: "",
          clinicArea: "",
          clinicAddress: "",
          clinicPhone: [""],
          clinicEmail: "",
          clinicWebsite: "",
          clinicLicense: "",
        },
      ],
    });
  };
  const removeClinic = (index) => {
    const clinics = [...(doctorData.clinic || [])];
    clinics.splice(index, 1);
    setDoctorData({ ...doctorData, clinic: clinics });
  };

  // Add these handlers inside your component:
  const handleDeleteFile = (field) => {
    setDoctorData({ ...doctorData, [field]: null });
  };
  const handleDeleteCertificate = (idx) => {
    const newCertificates = [...doctorData.certificates];
    newCertificates.splice(idx, 1);
    setDoctorData({ ...doctorData, certificates: newCertificates });
  };
  const handleDeleteClinicLicense = (idx) => {
    const clinics = [...doctorData.clinic];
    clinics[idx].clinicLicense = null;
    setDoctorData({ ...doctorData, clinic: clinics });
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-br from-primary/10 to-tertiary/10 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl p-8 text-center bg-white rounded-xl shadow-2xl border border-primary/20">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Application Submitted
          </h1>
          <p className="text-gray-700 mb-8">
            Thank you. Your application has been submitted and will be reviewed
            shortly.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block px-6 py-2 text-white bg-primary rounded-md hover:bg-tertiary transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-tertiary/10 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl p-10 space-y-8 bg-white/95 rounded-2xl shadow-2xl border border-primary/20">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Update Your Application
          </h1>
          <p className="text-lg text-gray-600">
            Please review and update your details below before resubmitting.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-primary font-semibold">
            Loading doctor details...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Doctor Info */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">
                Doctor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    Doctor Name
                  </span>
                  <input
                    type="text"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    value={doctorData.doctorName || ""}
                    onChange={(e) =>
                      setDoctorData({
                        ...doctorData,
                        doctorName: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    Doctor Email
                  </span>
                  <input
                    type="email"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    value={doctorData.doctorEmail || ""}
                    onChange={(e) =>
                      setDoctorData({
                        ...doctorData,
                        doctorEmail: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    value={doctorData.doctorPhone || ""}
                    onChange={(e) =>
                      setDoctorData({
                        ...doctorData,
                        doctorPhone: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    Date of Birth
                  </span>
                  <input
                    type="date"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    value={doctorData.doctorDateOfBirth || ""}
                    onChange={(e) =>
                      setDoctorData({
                        ...doctorData,
                        doctorDateOfBirth: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    National ID
                  </span>
                  <input
                    type="text"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    value={doctorData.nationalID || ""}
                    onChange={(e) =>
                      setDoctorData({
                        ...doctorData,
                        nationalID: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">Gender</span>
                  <input
                    type="text"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    value={doctorData.Gender || ""}
                    onChange={(e) =>
                      setDoctorData({ ...doctorData, Gender: e.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    Syndicate ID
                  </span>
                  <input
                    type="text"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    value={doctorData.syndicateID || ""}
                    onChange={(e) =>
                      setDoctorData({
                        ...doctorData,
                        syndicateID: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    Years of Experience
                  </span>
                  <input
                    type="number"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    value={doctorData.yearsOfExprience || ""}
                    onChange={(e) =>
                      setDoctorData({
                        ...doctorData,
                        yearsOfExprience: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    Specialization
                  </span>
                  <input
                    type="text"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    value={doctorData.field || ""}
                    onChange={(e) =>
                      setDoctorData({ ...doctorData, field: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    Syndicate Card
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2"
                    onChange={(e) =>
                      handleFileChange("syndicateCard", e.target.files[0])
                    }
                    disabled={typeof doctorData.syndicateCard === "string"}
                  />
                  {doctorData.syndicateCard && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {doctorData.syndicateCard.name ||
                          doctorData.syndicateCard}
                      </span>
                      {typeof doctorData.syndicateCard === "string" && (
                        <button
                          type="button"
                          className="text-red-500 text-xs underline"
                          onClick={() => handleDeleteFile("syndicateCard")}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                  {/* Preview */}
                  {doctorData.syndicateCard && (
                    <div className="mt-2">
                      {typeof doctorData.syndicateCard === "string" ? (
                        doctorData.syndicateCard.endsWith(".pdf") ? (
                          <a
                            href={`http://localhost:3000/${doctorData.syndicateCard.replace(
                              /\\/g,
                              "/"
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            View PDF
                          </a>
                        ) : (
                          <img
                            src={`http://localhost:3000/${doctorData.syndicateCard.replace(
                              /\\/g,
                              "/"
                            )}`}
                            alt="Syndicate Card"
                            className="h-24 rounded border mt-1"
                          />
                        )
                      ) : doctorData.syndicateCard.type ===
                        "application/pdf" ? (
                        <span className="text-primary">PDF Selected</span>
                      ) : (
                        <img
                          src={URL.createObjectURL(doctorData.syndicateCard)}
                          alt="Syndicate Card"
                          className="h-24 rounded border mt-1"
                        />
                      )}
                    </div>
                  )}
                </label>

                {/* Doctor Image */}
                <label className="flex flex-col">
                  <span className="mb-1 font-medium text-primary">
                    Doctor Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2"
                    onChange={(e) =>
                      handleFileChange("doctorImage", e.target.files[0])
                    }
                    disabled={
                      typeof doctorData.doctorImage === "string" &&
                      doctorData.doctorImage.trim() !== ""
                    }
                  />
                  {doctorData.doctorImage && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {doctorData.doctorImage.name || doctorData.doctorImage}
                      </span>
                      {typeof doctorData.doctorImage === "string" && (
                        <button
                          type="button"
                          className="text-red-500 text-xs underline"
                          onClick={() => handleDeleteFile("doctorImage")}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                  {/* Preview */}
                  {doctorData.doctorImage && (
                    <div className="mt-2">
                      {typeof doctorData.doctorImage === "string" &&
                      doctorData.doctorImage.trim() !== "" ? (
                        <img
                          src={`http://localhost:3000/${doctorData.doctorImage.replace(
                            /\\/g,
                            "/"
                          )}`}
                          alt="Doctor"
                          className="h-24 rounded border mt-1"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        doctorData.doctorImage instanceof File && (
                          <img
                            src={URL.createObjectURL(doctorData.doctorImage)}
                            alt="Doctor"
                            className="h-24 rounded border mt-1"
                          />
                        )
                      )}
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <h3 className="text-lg font-bold text-primary mb-2">
                Certificates
              </h3>
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="rounded-lg border border-primary/30 bg-white px-4 py-2"
                onChange={handleCertificatesChange}
                disabled={
                  doctorData.certificates &&
                  doctorData.certificates.some((f) => typeof f === "string")
                }
              />
              {doctorData.certificates &&
                doctorData.certificates.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-gray-700">
                    {doctorData.certificates.map((file, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        {typeof file === "string" ? (
                          file.endsWith(".pdf") ? (
                            <a
                              href={`http://localhost:3000/${file.replace(
                                /\\/g,
                                "/"
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline"
                            >
                              View PDF {idx + 1}
                            </a>
                          ) : (
                            <img
                              src={`http://localhost:3000/${file.replace(
                                /\\/g,
                                "/"
                              )}`}
                              alt={`Certificate ${idx + 1}`}
                              className="h-16 inline-block rounded border mr-2"
                            />
                          )
                        ) : file.type === "application/pdf" ? (
                          <span className="text-primary">PDF Selected</span>
                        ) : (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Certificate ${idx + 1}`}
                            className="h-16 inline-block rounded border mr-2"
                          />
                        )}
                        {typeof file === "string" && (
                          <button
                            type="button"
                            className="text-red-500 text-xs underline"
                            onClick={() => handleDeleteCertificate(idx)}
                          >
                            Delete
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            {/* Clinics */}
            <div className="bg-tertiary/5 rounded-lg p-4 border border-tertiary/10">
              <h3 className="text-lg font-bold text-tertiary mb-2">Clinics</h3>
              {doctorData.clinic?.map((clinic, idx) => (
                <div
                  key={idx}
                  className="border rounded p-3 mb-3 space-y-2 bg-white/80 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-primary">
                      Clinic {idx + 1}
                    </span>
                    <button
                      type="button"
                      className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                      onClick={() => removeClinic(idx)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col">
                      <span className="mb-1 font-medium text-tertiary">
                        Clinic Name
                      </span>
                      <input
                        type="text"
                        className="rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary text-gray-900"
                        value={clinic.clinicName || ""}
                        onChange={(e) =>
                          updateClinicField(idx, "clinicName", e.target.value)
                        }
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="mb-1 font-medium text-tertiary">
                        Clinic City
                      </span>
                      <input
                        type="text"
                        className="rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary text-gray-900"
                        value={clinic.clinicCity || ""}
                        onChange={(e) =>
                          updateClinicField(idx, "clinicCity", e.target.value)
                        }
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="mb-1 font-medium text-tertiary">
                        Clinic Area
                      </span>
                      <input
                        type="text"
                        className="rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary text-gray-900"
                        value={clinic.clinicArea || ""}
                        onChange={(e) =>
                          updateClinicField(idx, "clinicArea", e.target.value)
                        }
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="mb-1 font-medium text-tertiary">
                        Clinic Address
                      </span>
                      <input
                        type="text"
                        className="rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary text-gray-900"
                        value={clinic.clinicAddress || ""}
                        onChange={(e) =>
                          updateClinicField(
                            idx,
                            "clinicAddress",
                            e.target.value
                          )
                        }
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="mb-1 font-medium text-tertiary">
                        Clinic Phone
                      </span>
                      <input
                        type="text"
                        className="rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary text-gray-900"
                        value={
                          Array.isArray(clinic.clinicPhone)
                            ? String(clinic.clinicPhone[0]).replace(
                                /[[\]"]/g,
                                ""
                              )
                            : String(clinic.clinicPhone).replace(/[[\]"]/g, "")
                        }
                        onChange={(e) =>
                          updateClinicField(idx, "clinicPhone", [
                            e.target.value,
                          ])
                        }
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="mb-1 font-medium text-tertiary">
                        Clinic Email
                      </span>
                      <input
                        type="email"
                        className="rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary text-gray-900"
                        value={clinic.clinicEmail || ""}
                        onChange={(e) =>
                          updateClinicField(idx, "clinicEmail", e.target.value)
                        }
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="mb-1 font-medium text-tertiary">
                        Clinic Website
                      </span>
                      <input
                        type="text"
                        className="rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary text-gray-900"
                        value={clinic.clinicWebsite || ""}
                        onChange={(e) =>
                          updateClinicField(
                            idx,
                            "clinicWebsite",
                            e.target.value
                          )
                        }
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="mb-1 font-medium text-tertiary">
                        Clinic License
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-2"
                        onChange={(e) =>
                          updateClinicField(
                            idx,
                            "clinicLicense",
                            e.target.files[0]
                          )
                        }
                        disabled={typeof clinic.clinicLicense === "string"}
                      />
                      {clinic.clinicLicense && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {clinic.clinicLicense.name || clinic.clinicLicense}
                          </span>
                          {typeof clinic.clinicLicense === "string" && (
                            <button
                              type="button"
                              className="text-red-500 text-xs underline"
                              onClick={() => handleDeleteClinicLicense(idx)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                      {/* Preview */}
                      {clinic.clinicLicense && (
                        <div className="mt-2">
                          {typeof clinic.clinicLicense === "string" ? (
                            clinic.clinicLicense.endsWith(".pdf") ? (
                              <a
                                href={`http://localhost:3000/${clinic.clinicLicense.replace(
                                  /\\/g,
                                  "/"
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline"
                              >
                                View PDF
                              </a>
                            ) : (
                              <img
                                src={`http://localhost:3000/${clinic.clinicLicense.replace(
                                  /\\/g,
                                  "/"
                                )}`}
                                alt="Clinic License"
                                className="h-20 rounded border mt-1"
                              />
                            )
                          ) : clinic.clinicLicense.type ===
                            "application/pdf" ? (
                            <span className="text-primary">PDF Selected</span>
                          ) : (
                            <img
                              src={URL.createObjectURL(clinic.clinicLicense)}
                              alt="Clinic License"
                              className="h-20 rounded border mt-1"
                            />
                          )}
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="bg-tertiary text-white px-4 py-1 rounded hover:bg-tertiary/80 mt-2"
                onClick={addClinic}
              >
                Add Clinic
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-tertiary text-white font-bold py-3 rounded-xl transition text-lg shadow-lg"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Resubmit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReApply;
