import React, { useState, useEffect } from 'react';
import { fetchDoctors } from '../../../api/services/AdminServices';
import { FaChevronDown, FaChevronUp, FaUserMd, FaFileAlt } from 'react-icons/fa';

export const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const getDoctors = () => {
      setLoading(true);
      fetchDoctors(
        (data) => {
          console.log('Received doctors:', data);
          setDoctors(Array.isArray(data) ? data : []);
        },
        (error) => {
          console.error('Error:', error);
          setError(error?.response?.data?.message || error.message || 'Failed to fetch doctors');
        },
        () => setLoading(false)
      );
    };

    getDoctors();
  }, []);

  const toggleRow = (doctorId) => {
    setExpandedRows(prev => ({
      ...prev,
      [doctorId]: !prev[doctorId]
    }));
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor?.doctorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Loading doctors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading doctors</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const DocumentLink = ({ icon: Icon, label, href }) => (
    <a
      href={`http://localhost:3000/${href?.replace(/\\/g, '/')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-2 bg-white rounded hover:bg-gray-100 transition-colors"
    >
      <Icon className="text-primary w-5 h-5 mr-2" />
      <span className="text-primary text-sm hover:underline">{label}</span>
    </a>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Doctors ({doctors.length})</h2>
        <input
          type="text"
          placeholder="Search doctors..."
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
                Specialty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <React.Fragment key={doctor._id}>
                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRow(doctor._id)}>
                  <td className="px-6 py-4">
                    {expandedRows[doctor._id] ? <FaChevronUp /> : <FaChevronDown />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        {doctor.doctorImage ? (
                          <img
                            src={`http://localhost:3000/${doctor.doctorImage?.replace(/\\/g, '/')}`}
                            alt={doctor.doctorName}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.src = ''; // Clear the source
                              // Show the fallback icon by triggering the false condition
                              e.target.parentElement.innerHTML = '<svg class="text-primary text-xl">...</svg>';
                            }}
                          />
                        ) : (
                          <FaUserMd className="text-primary text-xl" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doctor.doctorName}</div>
                        <div className="text-sm text-gray-500">{doctor.Gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.doctorPhone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.doctorEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.field}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.yearsOfExprience} years
                  </td>
                </tr>
                {expandedRows[doctor._id] && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Personal Details</h4>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Birth Date: {doctor.doctorDateOfBirth}</p>
                            <p className="text-sm text-gray-600">National ID: {doctor.nationalID}</p>
                            <p className="text-sm text-gray-600">Syndicate ID: {doctor.syndicateID}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Documents</h4>
                          <div className="space-y-2 mt-2">
                            <DocumentLink icon={FaFileAlt} label="Doctor Image" href={doctor.doctorImage} />
                            <DocumentLink icon={FaFileAlt} label="Syndicate Card" href={doctor.syndicateCard} />
                            {doctor.certificates?.map((cert, index) => (
                              <DocumentLink key={index} icon={FaFileAlt} label={`Certificate ${index + 1}`} href={cert} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Clinic Information</h4>
                          {doctor.clinic?.map((clinic, index) => (
                            <div key={index} className="mt-4 p-3 bg-white rounded border border-gray-200">
                              <p className="text-sm font-medium text-gray-700 mb-2">{clinic.clinicName || `Clinic ${index + 1}`}</p>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">{clinic.clinicCity}, {clinic.clinicArea}</p>
                                <p className="text-sm text-gray-600">{clinic.clinicAddress}</p>
                                <p className="text-sm text-gray-600">Phone: {clinic.clinicPhone?.[0]?.toString().replace(/[[\]"]/g, '')}</p>
                                <DocumentLink icon={FaFileAlt} label={`${clinic.clinicName || `Clinic ${index + 1}`} License`} href={clinic.clinicLicense} />
                              </div>
                            </div>
                          ))}
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

      {filteredDoctors.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-500">
            {searchQuery ? 'No doctors found matching your search' : 'No doctors available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;