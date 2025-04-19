import React, { useState, useEffect } from "react";
import Logic from "./logic";
import { FaUser, FaLock } from "react-icons/fa";
import Layout from "../../components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toast from "../../components/Toast";
import { v4 as uuidv4 } from 'uuid';
import { generateLink, createPrescription } from "../../api/services/requestServices";
import Cookies from "js-cookie";
import { DOCTOR_INFO } from "../../helpers/constants/StaticKeys";

const MedicalRecordsScreen = () => {
  const { state, updateProp } = Logic();
  const [showAccessPopup, setShowAccessPopup] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showFollowUpQuestion, setShowFollowUpQuestion] = useState(true);
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get doctor information from local storage
  useEffect(() => {
    const doctorData = localStorage.getItem(DOCTOR_INFO);
    if (doctorData && doctorData.trim().startsWith("{")) {
      try {
        const doctor = JSON.parse(doctorData);
        setDoctorEmail(doctor.doctorEmail);
        setDoctorName(doctor.doctorName);
        setDoctorPhone(doctor.doctorPhone || "123-456-7890"); // Fallback if phone is not available
      } catch (error) {
        console.error("Error parsing doctor data:", error);
        setDoctorEmail("bimar.med24@gmail.com"); // Fallback to default email
        setToast({
          show: true,
          message: "Error setting doctor email. Using default email instead.",
          type: "warning"
        });
      }
    }
  }, []);

  // Handle data loading after successful verification
  useEffect(() => {
    if (location.state && location.state.data) {
      try {
        const medicalData = location.state.data;
        console.log('Medical Data:', medicalData); // Console log to verify data
        updateProp('hasAccess', true);
        updateProp('medicalRecords', medicalData);
        setToast({
          show: true,
          message: "Access granted successfully!",
          type: "success"
        });
      } catch (err) {
        console.error('Error parsing medical data:', err);
      }
    }
    if (location.state && location.state.patientEmail) {
      console.log('Patient Email from Dashboard:', location.state.patientEmail);
      updateProp('patientEmail', location.state.patientEmail);
    }
  }, [location.state]);

  const handleRequestAccess = async () => {
    generateLink(
      {
        patientEmail: state.patientEmail,
        doctorEmail: doctorEmail,
        accessDuration: parseInt(state.accessDuration),
      },
      (res)=>{
        console.log("Res: ", res);
          setToast({
          show: true,
          message: "Access request sent successfully. Please check your email for the verification link.",
          type: "success"
          });
          setShowAccessPopup(false);
          navigate('/access');
          },
      (err)=>{  
          setToast({
          show: true,
          message: err.response?.data?.message || "Failed to request access. Please try again.",
          type: "error"
        });
        console.error('Request access error:', err);
        setShowAccessPopup(false);
  },   () => {})
  };


    const calculateAge = (birthdate) => {
    // Handle date in DD/MM/YYYY format
    let birthDate;
    
    // Check if the date is in DD/MM/YYYY format
    if (typeof birthdate === 'string' && birthdate.includes('/')) {
      const [day, month, year] = birthdate.split('/').map(num => parseInt(num, 10));
      birthDate = new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
    } else {
      // Fallback to regular Date parsing for other formats
      birthDate = new Date(birthdate);
    }
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Sanity check to ensure we don't return an invalid age
    return (age >= 0 && age < 120) ? age : 0;
  };
  


  const handleFollowUpChange = (e) => {
    const value = e.target.value === 'yes';
    setShowFollowUpQuestion(false);
    if (value) {
      updateProp('followUpDate', new Date().toISOString().split('T')[0]); // Set default follow-up date to today
    } else {
      updateProp('followUpDate', null);
    }
  };
  
  const submitData = async () => {
    const prescriptionData = {
      prescriptionId: uuidv4(),
      prescriptionDate: new Date(),
      followUpDate: state.followUpDate,
      notes: state.notes,
      prescriptionInstruction: state.prescriptions.map(prescription => ({
        medication: prescription.medication,
        dosage: prescription.dosage,
        frequency: parseInt(prescription.frequency),
        duration: parseInt(prescription.duration),
        notes: prescription.notes || ''
      })),
      prescriptionStatus: "Pending",
      doctorName: doctorName,
      doctorPhone: doctorPhone,
      diagnosis: state.diagnosis || []
    };
  
    console.log('Prescription Data:', prescriptionData);
    createPrescription(
      {
        patientId: state.medicalRecords.patientId,
        prescriptionData,
      },
      (res)=>{
        console.log("Res: ", res);
          setToast({
            show: true,
            message: "Data submitted successfully!",
            type: "success"
          });
          },
      (err)=>{  
          setToast({
          show: true,
          message: "Failed to submit data. Please try again.",
          type: "error"
        });
        console.error('Request access error:', err);
        setShowAccessPopup(false);
  },   () => {})
  };

  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const addPrescription = () => {
    if (newPrescription.medication.trim() && newPrescription.dosage.trim() && newPrescription.frequency.trim() && newPrescription.duration.trim()) {
      updateProp('prescriptions', [...(state.prescriptions || []), newPrescription]);
      setNewPrescription({ medication: '', dosage: '', frequency: '', duration: '' });
    }
  };

  const removePrescription = (index) => {
    const updatedPrescriptions = state.prescriptions.filter((_, i) => i !== index);
    updateProp('prescriptions', updatedPrescriptions);
  };

  const AccessPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px]">
        <h3 className="text-[18.1px] font-extrabold mb-4">Request Access</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[18.1px] font-medium mb-2 block">Patient Email</label>
            <div className="w-full p-2 border rounded bg-gray-50">
              {state.patientEmail || "No email provided"}
            </div>
          </div>
          <div>
            <label className="text-[18.1px] font-medium mb-2 block">Access Duration (minutes)</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded" 
              placeholder="Enter duration in minutes"
              value={state.accessDuration}
              onChange={(e) => updateProp('accessDuration', e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button 
              className="px-4 py-2 rounded text-gray-600"
              onClick={() => setShowAccessPopup(false)}
            >
              Cancel
            </button>
            <button 
              className="bg-[#16423C] font-bold text-white px-4 py-2 rounded"
              onClick={handleRequestAccess}
            >
              Request Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );



  return (
    <>
      <div className="container mx-auto">
        {/* Main Content */}
        <div className="p-6 bg-white">
          <div className="space-y-4">
            {/* Top Section */}
            <div className="flex gap-4">
              {/* Patient Card */}
              <div className="bg-[#E9EFEC] rounded-xl shadow-lg p-6 w-[500px] h-[211px]">
                <div className="flex items-start space-x-4">
                <div className="w-[114px] h-[130px] rounded-[10px] bg-gray-200 flex items-center justify-center mt-2">
                  {state.medicalRecords?.profileImage ? (
                    <img 
                      src={`http://localhost:3000/${state.medicalRecords.profileImage.replace(/\\/g, '/')}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-[10px]" 
                      onError={(e) => { e.target.onerror = null; e.target.src = ''; }} // Fallback to FaUser if image fails to load
                    />
                  ) : (
                    <FaUser className="text-4xl text-gray-400" />
                  )}
                </div>
                  
                  <div className="flex-1">
                    <h4 className="text-[18.1px] font-extrabold text-gray-800 mb-2">{state.medicalRecords?.userName || "N/A"}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[18.1px] font-medium text-[#00000080]">{state.medicalRecords?.personalRecords?.Gender || "N/A"}</span>
                        <span className="text-[18.1px] font-medium text-[#00000080]">Age: {state.medicalRecords?.personalRecords?.DateOfBirth ? calculateAge(state.medicalRecords.personalRecords.DateOfBirth) : "N/A"}</span>
                      </div>
                      <div className="text-[18.1px] font-normal text-black">
                        Area: <span className="text-[#00000080]">{state.medicalRecords?.personalRecords?.Area || "N/A"}</span>
                      </div>
                      <div className="text-[18.1px] font-normal text-black">
                        City: <span className="text-[#00000080]">{state.medicalRecords?.personalRecords?.City || "N/A"}</span>
                      </div>
                      <div className="text-[18.1px] font-normal text-black">
                        Last Visit: <span className="text-[#00000080]">{state.medicalRecords?.lastVisit || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Section */}
              <div className="bg-[#E9EFEC] rounded-xl shadow-lg p-6 flex-1">
                <h3 className="text-[18.1px] font-extrabold mb-2">Overview</h3>
                <div className="flex justify-between items-center">
                  <p className="text-[18.1px] font-normal text-black">Weight: <span className="text-[#00000080]">{state.medicalRecords?.personalRecords?.userWeight || "N/A"} kg</span></p>
                  <p className="text-[18.1px] font-normal text-black">Height: <span className="text-[#00000080]">{state.medicalRecords?.personalRecords?.userHeight || "N/A"} cm</span></p>
                  <p className="text-[18.1px] font-normal text-black">Blood Type: <span className="text-[#00000080]">{state.medicalRecords?.medicalRecord?.bloodType || "N/A"}</span></p>
                  <p className="text-[18.1px] font-normal text-black">Status: <span className="text-[#00000080]">{state.medicalRecords?.personalRecords?.familyStatus || "N/A"}</span></p>
                  <p className="text-[18.1px] font-normal text-black">Smoking: <span className="text-[#00000080]">{state.medicalRecords?.personalRecords?.smoking || "N/A"}</span></p>
                  <p className="text-[18.1px] font-normal text-black">Alcohol: <span className="text-[#00000080]">{state.medicalRecords?.personalRecords?.alcohol || "N/A"}</span></p>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-[18.1px] font-normal text-black">Known Allergies</p>
                  <div className="flex gap-2">
                    {state.medicalRecords?.medicalRecord?.allgeric?.map((allergy, index) => (
                      <span key={index} className="bg-[#16423C] text-white px-7 py-1 rounded-full text-sm">{allergy}</span>
                    )) || (
                      <span className="text-[#00000080]">No data available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Records Section */}
            <div className="bg-[#E9EFEC] rounded-xl shadow-lg p-6 relative">
              <div className={!state.hasAccess ? "filter blur-sm" : ""}>
                <h3 className="text-[18.1px] font-extrabold mb-2">Medical Records</h3>
                <div className="grid grid-cols-4 divide-x divide-gray-300">
                  {/* Chronic Medications */}
                  <div className="px-6">
                    <h4 className="text-[18.1px] font-medium mb-2">Chronic Medications:</h4>
                    <ul className="space-y-1 text-[18.1px] text-[#0000000]">
                      {state.medicalRecords?.medicalRecord?.chronicMedications?.map((med, index) => (
                        <li key={index}>• {med}</li>
                      )) || (
                        <li>• No data available</li>
                      )}
                    </ul>
                  </div>

                  {/* Surgeries */}
                  <div className="px-6">
                    <h4 className="text-[18.1px] font-medium mb-2">Surgeries:</h4>
                    <ul className="space-y-1 text-[18.1px] text-[#0000000]">
                      {state.medicalRecords?.medicalRecord?.surgeries?.map((surgery, index) => (
                        <li key={index}>• {surgery}</li>
                      )) || (
                        <li>• No data available</li>
                      )}
                    </ul>
                  </div>

                  {/* Chronic Diseases */}
                  <div className="px-6">
                    <h4 className="text-[18.1px] font-medium mb-2">Chronic Diseases:</h4>
                    <ul className="space-y-1 text-[18.1px] text-[#0000000]">
                      {state.medicalRecords?.medicalRecord?.chronicDiseases?.map((disease, index) => (
                        <li key={index}>• {disease}</li>
                      )) || (
                        <li>• No data available</li>
                      )}
                    </ul>
                  </div>

                  {/* Vaccinations */}
                  <div className="px-6">
                    <h4 className="text-[18.1px] font-medium mb-2">Vaccinations:</h4>
                    <ul className="space-y-1 text-[18.1px] text-[#0000000]">
                      {state.medicalRecords?.medicalRecord?.vaccinations?.map((vaccine, index) => (
                        <li key={index}>• {vaccine}</li>
                      )) || (
                        <li>• No data available</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Family History */}
                <div className="mt-6">
                <h4 className="text-[18.1px] font-medium mb-2">Family History:</h4>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[18.1px] font-medium mb-1">Genetic Diseases:</p>
                    <div className="flex gap-4">
                      <ul className="space-y-0.5 text-[18.1px] text-[#0000000]">
                        {state.medicalRecords?.medicalRecord?.familyHistory?.genaticsDiseases?.map((disease, index) => (
                          <li key={index}>• {disease}</li>
                        )) || (
                          <li>• No data available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="text-[18.1px] font-medium mb-1">Genatics:</p>
                    <div className="flex gap-4">
                      <ul className="space-y-0.5 text-[18.1px] text-[#0000000]">
                        {state.medicalRecords?.medicalRecord?.familyHistory?.genatics?.map((genatic, index) => (
                          <li key={index}>• {genatic}</li>
                        )) || (
                          <li>• No data available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              
              {!state.hasAccess && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => setShowAccessPopup(true)}
                    className="bg-[#16423C] text-white px-20 py-4 font-black rounded-lg text-[18.1px] flex items-center gap-2"
                  >
                    <FaLock /> Get Access
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4 ">
            {/* Prescription Section */}
            <div className="bg-[#E9EFEC] rounded-xl shadow-lg p-6 flex-1 ">
              <h3 className="text-[18.1px] font-extrabold mb-2">Prescription</h3>
              <div className="grid grid-cols-4 gap-6">
            <div>
              <h4 className="text-[18.1px] font-medium mb-2">Medication</h4>
              <input type="text" className="w-full p-2 border rounded-lg shadow-sm border-[#D0D5DD] placeholder-gray-500" placeholder="Medication" value={newPrescription.medication} onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })} />
            </div>
            <div>
              <h4 className="text-[18.1px] font-medium mb-2">Dosage</h4>
              <input type="text" className="w-full p-2 border rounded-lg shadow-sm border-[#D0D5DD] placeholder-gray-500" placeholder="Dosage" value={newPrescription.dosage} onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })} />
            </div>
            <div>
              <h4 className="text-[18.1px] font-medium mb-2">Frequency (per day)</h4>
              <input type="number" className="w-full p-2 border rounded-lg shadow-sm border-[#D0D5DD] placeholder-gray-500" placeholder="Frequency" value={newPrescription.frequency} onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })} />
            </div>
            <div className="flex items-end">
              <div className="flex-1">
                <h4 className="text-[18.1px] font-medium mb-2">Duration (weeks)</h4>
                <input type="number" className="w-full p-2 border rounded-lg shadow-sm border-[#D0D5DD] placeholder-gray-500" placeholder="Duration" value={newPrescription.duration} onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })} />
              </div>
              <button 
                className="ml-2 bg-[#16423C] text-white font-black w-11 h-11 flex items-center justify-center rounded-full text-[18px]"
                onClick={addPrescription}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between gap-6 w-full mt-4">
            <div className="flex-1">
              <h4 className="text-[18.1px] font-medium mb-2">Diagnosis</h4>
              <textarea 
                className="w-full h-32 p-4 border rounded-lg shadow-lg border-[#D0D5DD] placeholder-gray-500" 
                placeholder="Diagnosis" 
                value={state.diagnosis} 
                onChange={(e) => updateProp('diagnosis', e.target.value.split(','))} 
              />
            </div>
            <div className="flex-1">
              <h4 className="text-[18.1px] font-medium mb-2">Notes</h4>
              <textarea 
                className="w-full h-32 p-4 border rounded-lg shadow-lg border-[#D0D5DD] placeholder-gray-500" 
                placeholder="Notes" 
                value={state.notes} 
                onChange={(e) => updateProp('notes', e.target.value)}
              ></textarea>
            </div>


              </div>
          {state.prescriptions && state.prescriptions.length > 0 && (
            <ul className="mt-4 space-y-2">
              {state.prescriptions.map((prescription, index) => (
                <li key={index} className="text-[18.1px] text-[#0000000] flex justify-between items-center">
                  <div>
                    <strong>Medication:</strong> {prescription.medication}, <strong>Dosage:</strong> {prescription.dosage}, <strong>Frequency:</strong> {prescription.frequency} times/day, <strong>Duration:</strong> {prescription.duration} weeks
                  </div>
                  <button 
                    className="bg-[#16423C] text-white font-black w-11 h-11 flex items-center justify-center rounded-full text-[18px]"
                    onClick={() => removePrescription(index)}
                  >
                    -
                  </button>
                </li>
              ))}
            </ul>
          )}
              </div>

            {/* Follow Up Section */}
            <div className="flex flex-col items-center">
              {showFollowUpQuestion ? (
                <div className="bg-[#E9EFEC] rounded-xl shadow-lg p-6 w-[300px] self-start">
                  <h3 className="text-[18.1px] font-extrabold mb-2">Is there a follow-up?</h3>
                  <div className="flex gap-4">
                    <label>
                      <input 
                        type="radio" 
                        name="followUp" 
                        value="yes" 
                        onChange={handleFollowUpChange} 
                      /> Yes
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="followUp" 
                        value="no" 
                        onChange={handleFollowUpChange} 
                      /> No
                    </label>
                  </div>
                </div>
              ) : state.followUpDate && (
                <div className="bg-[#E9EFEC] rounded-xl shadow-lg p-6 w-[300px] self-start">
                  <h3 className="text-[18.1px] font-extrabold mb-2">Follow Up Date</h3>
                  <input type="date" className="w-full p-2 border rounded" value={state.followUpDate} onChange={(e) => updateProp('followUpDate', e.target.value)} />
                </div>
              )}
              <div className="mt-4">
                <button 
                  className="bg-[#16423C] text-white font-black px-28 py-3 border rounded-lg text-[18.1px]"
                  onClick={submitData}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>

      
      {showAccessPopup && <AccessPopup />}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </>
  );
};

export default MedicalRecordsScreen;