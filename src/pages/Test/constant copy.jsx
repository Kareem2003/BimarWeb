export const INITIAL_STATE = {
  followup: true,
  date: new Date(),
  doctorName: "",
  doctorPhone: "",
  diagnosis: [],
  treatmentPlan: "",
  Xray: [String], // Image
  labResults: [String], // Image
  prescription: {
    prescriptionDate: new Date(),
    prescriptionInstruction: [
      {
        medication: "",
        dosage: "",
        frequency: 0,
        duration: 0,
        notes: "",
      },
    ],
    prescriptionStatus: "Pending",
  },

  consultations: [
    {
      consultationDate: new Date(),
      consultationDescription: "",
      consultationStatus: "Pending",
    },
  ],
};
