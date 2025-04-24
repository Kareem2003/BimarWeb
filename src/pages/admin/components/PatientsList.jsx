import React, { useState, useEffect } from "react";
import { fetchPatients } from "../../../api/services/AdminServices";
import { FaWeight, FaRulerVertical, FaChevronDown, FaChevronUp } from "react-icons/fa";

export const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const getPatients = () => {
      setLoading(true);
      fetchPatients(
        (data) => {
          console.log("Patients received:", data);
          const formattedPatients = Array.isArray(data)
            ? data.map((patient) => ({
                _id: patient._id,
                userName: patient.userName,
                userEmail: patient.userEmail,
                userPhone: patient.userPhone,
                gender: patient.Gender,
                dateOfBirth: patient.DateofBirth,
                city: patient.City,
                area: patient.Area,
                weight: patient.userWeight,
                height: patient.userHeight,
                bloodType: patient.BooldType,
                medicalRecord: patient.medicalRecord,
                profileImage: patient.profileImage,
              }))
            : [];
          setPatients(formattedPatients);
        },
        (errorMessage) => {
          console.error("Patient fetch error:", errorMessage);
          setError(`Failed to load patients: ${errorMessage}`);
        },
        () => setLoading(false)
      );
    };

    getPatients();
  }, []);

  const toggleRow = (patientId) => {
    setExpandedRows(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }));
  };

  const filteredPatients = patients.filter((patient) =>
    patient?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Loading patients...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading patients</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Patients ({patients.length})</h2>
        <input
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <React.Fragment key={patient._id}>
                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRow(patient._id)}>
                  <td className="px-6 py-4">
                    {expandedRows[patient._id] ? <FaChevronUp /> : <FaChevronDown />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        {patient.profileImage ? (
                          <img
                            src={patient.profileImage}
                            alt={patient.userName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary text-sm font-bold">
                            {patient.userName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.userName}
                        </div>
                        <div className="text-sm text-gray-500">{patient.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.userPhone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.userEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.area}, {patient.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.bloodType || "N/A"}
                  </td>
                </tr>
                {expandedRows[patient._id] && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Physical Details</h4>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <FaWeight className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {patient.weight}kg
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaRulerVertical className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {patient.height}cm
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Birth Date</h4>
                          <p className="mt-2 text-sm text-gray-600">{patient.dateOfBirth}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Medical Record</h4>
                          <p className="mt-2 text-sm text-gray-600">
                            {patient.medicalRecord?.chronicDiseases?.length > 0
                              ? `${patient.medicalRecord.chronicDiseases.length} conditions`
                              : "No conditions"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-500">
            {searchQuery
              ? "No patients found matching your search"
              : "No patients available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientsList;