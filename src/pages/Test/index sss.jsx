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
      Kareem
    </div>
  );
};

export default TestScreen;
