import { $axios, $axiosFormData , $securedAxios} from "../axios";
// fetch the area dropdowns

export const ProfileScreen = (payload, onSuccess, onError, onFinally) => {
    console.log("payload: ", payload);
  $axios
    .put(`/doctor/updateDoctor`, {
      email: payload.email,
      doctorName: payload.newData.doctorName,
      doctorDateOfBirth: payload.newData.doctorDateOfBirth,
      doctorPhone: payload.newData.doctorPhone,
      doctorEmail: payload.newData.doctorEmail
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

export const deleteClinic = (payload, onSuccess, onError, onFinally) => {
  console.log("payload: ", payload);
  $axios
    .delete(`/doctor/deleteClinic`, {
      data: {
        doctorEmail: payload.doctorEmail,
        clinicId: payload.clinicId
      }
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

export const addClinic = (payload, onSuccess, onError, onFinally) => {
  console.log("payload: ", payload);
  
  // Prepare the clinic data
  const clinicData = {
    clinicName: payload.clinicData.clinicName || '',
    clinicCity: payload.clinicData.clinicCity,
    clinicArea: payload.clinicData.clinicArea,
    clinicAddress: payload.clinicData.clinicAddress,
    clinicPhone: payload.clinicData.clinicPhone,
    clinicEmail: payload.clinicData.clinicEmail,
    clinicWebsite: payload.clinicData.clinicWebsite || '',
    clinicLocationLinks: payload.clinicData.clinicLocationLinks,
    Price: payload.clinicData.Price,
    clinicWorkDays: payload.clinicData.clinicWorkDays
  };

  console.log("Sending clinic data:", clinicData);

  $axios
    .post(`/doctor/addClinic`, clinicData)
    .then((response) => {
      console.log("Add clinic response:", response);
      onSuccess(response);
    })
    .catch((error) => {
      console.error("Add clinic error:", error);
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};