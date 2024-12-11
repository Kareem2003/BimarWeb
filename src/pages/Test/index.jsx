import { addDiagnosis } from "../../api/services/TestServices";
import Logic from "./logic";

const TestScreen = () => {
  const { state, updateProp } = Logic();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProp("doctorName", e.target.doctorName.value);
    updateProp("doctorPhone", e.target.doctorPhone.value);
    updateProp("diagnosis", e.target.diagnosis.value.split(","));
    updateProp("treatmentPlan", e.target.treatmentPlan.value);

    // Prescription fields
    updateProp(
      "prescription.prescriptionDate",
      e.target.prescriptionDate.value
    );
    updateProp(
      "prescription.prescriptionStatus",
      e.target.prescriptionStatus.value
    );

    const prescriptionInstructions = {
      medication: e.target.medication.value,
      dosage: e.target.dosage.value,
      frequency: e.target.frequency.value,
      duration: e.target.duration.value,
      notes: e.target.notes.value,
    };
    updateProp("prescription.prescriptionInstruction", [
      ...state.prescription.prescriptionInstruction,
      prescriptionInstructions,
    ]);

    // Consultation fields
    const consultation = {
      consultationDate: e.target.consultationDate.value,
      consultationDescription: e.target.consultationDescription.value,
      consultationStatus: e.target.consultationStatus.value,
    };
    updateProp("consultations", [...state.consultations, consultation]);

    updateProp("followup", e.target.followup.checked);

    console.log("Xray: ", state.Xray);

    addDiagnosis(
      {
        doctorName: state.doctorName,
        doctorPhone: state.doctorPhone,
        diagnosis: state.diagnosis,
        treatmentPlan: state.treatmentPlan,
        Xray: state.Xray,
        labResults: state.labResults,
        prescription: {
          prescriptionDate: state.prescription.prescriptionDate,
          prescriptionInstruction: state.prescription.prescriptionInstruction,
          prescriptionStatus: state.prescription.prescriptionStatus,
        },
        consultations: state.consultations,
        followup: state.followup,
      },
      () => {
        console.log("Diagnosis added successfully");
      },
      (error) => {
        console.error("Failed to add diagnosis", error);
      },
      () => {
        console.log("Diagnosis addition process completed");
      }
    );
  };

  return (
    <div className="flex justify-center items-center min-h-fit bg-gray-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl space-y-6"
      >
        <h2 className="text-2xl font-semibold text-black-700 text-center">
          Medical Record Form
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="doctorName"
                className="block text-sm font-medium text-black-600"
              >
                Doctor Name
              </label>
              <input
                id="doctorName"
                name="doctorName"
                placeholder="Doctor Name"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="doctorPhone"
                className="block text-sm font-medium text-black-600"
              >
                Doctor Phone
              </label>
              <input
                id="doctorPhone"
                name="doctorPhone"
                placeholder="Doctor Phone"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="diagnosis"
                className="block text-sm font-medium text-black-600"
              >
                Diagnosis
              </label>
              <input
                id="diagnosis"
                name="diagnosis"
                placeholder="Diagnosis (comma separated)"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="treatmentPlan"
                className="block text-sm font-medium text-black-600"
              >
                Treatment Plan
              </label>
              <input
                id="treatmentPlan"
                name="treatmentPlan"
                placeholder="Treatment Plan"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="consultationDate"
                className="block text-sm font-medium text-black-600"
              >
                Consultation Date
              </label>
              <input
                id="consultationDate"
                name="consultationDate"
                type="date"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="consultationDescription"
                className="block text-sm font-medium text-black"
              >
                Consultation Description
              </label>
              <input
                id="consultationDescription"
                name="consultationDescription"
                placeholder="Consultation Description"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="Xray"
                className="block text-sm font-medium text-black-600"
              >
                Xray
              </label>
              <input
                id="Xray"
                name="Xray"
                type="file"
                accept="image/*"
                className="w-full p-2 border border-black-300 rounded"
                multiple
              />
            </div>
            <div>
              <label
                htmlFor="labResults"
                className="block text-sm font-medium text-black-600"
              >
                Lab Results
              </label>
              <input
                id="labResults"
                name="labResults"
                type="file"
                accept="image/*"
                className="w-full p-2 border border-black-300 rounded"
                multiple
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="prescriptionDate"
                className="block text-sm font-medium text-black-600"
              >
                Prescription Date
              </label>
              <input
                id="prescriptionDate"
                name="prescriptionDate"
                type="date"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="prescriptionStatus"
                className="block text-sm font-medium text-black-600"
              >
                Prescription Status
              </label>
              <select
                id="prescriptionStatus"
                name="prescriptionStatus"
                className="w-full p-2 border border-black-300 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Issued">Issued</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="medication"
                className="block text-sm font-medium text-black-600"
              >
                Medication
              </label>
              <input
                id="medication"
                name="medication"
                placeholder="Medication"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="dosage"
                className="block text-sm font-medium text-black-600"
              >
                Dosage
              </label>
              <input
                id="dosage"
                name="dosage"
                placeholder="Dosage"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="frequency"
                className="block text-sm font-medium text-black-600"
              >
                Frequency
              </label>
              <input
                id="frequency"
                name="frequency"
                type="number"
                placeholder="Frequency (times per day)"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-black-600"
              >
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                placeholder="Duration (weeks)"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-black-600"
              >
                Notes
              </label>
              <input
                id="notes"
                name="notes"
                placeholder="Notes"
                className="w-full p-2 border border-black-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="consultationStatus"
                className="block text-sm font-medium text-black-600"
              >
                Consultation Status
              </label>
              <select
                id="consultationStatus"
                name="consultationStatus"
                className="w-full p-2 border border-black-300 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="followup"
                name="followup"
                type="checkbox"
                className="mr-2"
              />
              <label
                htmlFor="followup"
                className="block text-sm font-medium text-black-600"
              >
                Follow Up
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TestScreen;
