import { $axios } from "../axios";

export const addDiagnosis = (payload, onSuccess, onError, onFinally) => {
  $axios
    .post(`http://localhost:3000/Diagnosis?followup=${payload.followup}`, {
      date: payload.date,
      doctorName: payload.doctorName,
      doctorPhone: payload.doctorPhone,
      diagnosis: payload.diagnosis,
      treatmentPlan: payload.treatmentPlan,
      Xray: payload.Xray,
      labResults: payload.labResults,
      prescription: {
        prescriptionDate: payload.prescription.prescriptionDate,
        prescriptionInstruction: [
          {
            medication: payload.prescription.prescriptionInstruction.medication,
            dosage: payload.prescription.prescriptionInstruction.dosage,
            frequency: payload.prescription.prescriptionInstruction.frequency,
            duration: payload.prescription.prescriptionInstruction.duration,
            notes: payload.prescription.prescriptionInstruction.notes,
          },
        ],
        prescriptionStatus: payload.prescription.prescriptionStatus,
      },
      consultations: [
        {
          consultationDate: payload.consultations.consultationDate,
          consultationDescription:
            payload.consultations.consultationDescription,
          consultationStatus: payload.consultations.consultationStatus,
        },
      ],
    })
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};
