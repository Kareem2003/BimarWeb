export const INITIAL_STATE = {
  doctorName: "",
  doctorEmail: "",
  doctorPhone: "",
  doctorPassword: "",
  doctorDateOfBirth: "",
  nationalID: "",
  Gender: "",
  syndicateID: "",
  syndicateCard: "",
  yearsOfExprience: "",
  doctorImage: "",
  field: "",
  certificates: [],
  clinic: [
    {
      clinicLicense: "",
      clinicCity: "",
      clinicArea: "",
      clinicAddress: "",
      clinicPhone: [],
      clinicEmail: "",
      clinicWorkDays: [
        {
          day: "",
          workingHours: [{ start: "", end: "" }],
          examinationDuration: 0,
          NoBookings: 0,
        },
      ],
      clinicLocationLinks: "",
      price: 0,
      clinicWebsite: "",
    },
  ],
};
