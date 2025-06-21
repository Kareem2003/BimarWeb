import React, { useState } from 'react';
import { useFetchDoctorRequests } from '../logic';
import { approveDoctorRequest, rejectDoctorRequest } from '../../../api/services/AdminServices';
import Toast from '../../../components/Toast';
import { FaUserMd, FaEnvelope, FaPhone, FaBriefcase, FaCalendar, FaIdCard, FaHospital, FaMapMarkerAlt, FaFileAlt, FaLink, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export const DoctorRequests = () => {
  const { requests, loading, error, refetch } = useFetchDoctorRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [expandedRows, setExpandedRows] = useState({});

  const handleApprove = async (doctorId) => {
    setActionLoading(true);
    approveDoctorRequest(
      doctorId,
      (response) => {
        setToast({
          show: true,
          message: 'Doctor request approved successfully',
          type: 'success'
        });
        refetch();
      },
      (error) => {
        setToast({
          show: true,
          message: error || 'Failed to approve doctor request',
          type: 'error'
        });
      },
      () => setActionLoading(false)
    );
  };

  const handleReject = async (doctorId) => {
    setActionLoading(true);
    rejectDoctorRequest(
      doctorId,
      (response) => {
        setToast({
          show: true,
          message: 'Doctor request rejected successfully',
          type: 'success'
        });
        refetch(); // Refresh the list
      },
      (error) => {
        setToast({
          show: true,
          message: error || 'Failed to reject doctor request',
          type: 'error'
        });
      },
      () => setActionLoading(false)
    );
  };

  const toggleRow = (doctorId) => {
    setExpandedRows(prev => ({
      ...prev,
      [doctorId]: !prev[doctorId]
    }));
  };

  const filteredRequests = requests.filter((request) =>
    request.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.field?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Doctor Requests ({filteredRequests.length})</h2>
        <input
          type="text"
          placeholder="Search by name or specialty..."
          className="px-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <React.Fragment key={request._id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4" onClick={() => toggleRow(request._id)}>
                    {expandedRows[request._id] ? <FaChevronUp /> : <FaChevronDown />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        {request.doctorImage ? (
                          <img 
                            src={`http://localhost:3000/${request.doctorImage?.replace(/\\/g, '/')}`} 
                            alt={request.doctorName} 
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
                        <div className="text-sm font-medium text-gray-900">{request.doctorName}</div>
                        <div className="text-sm text-gray-500">{request.Gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.doctorPhone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.doctorEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.field}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={actionLoading}
                        className="bg-[#16423C] text-white px-3 py-1 rounded-md hover:bg-[#16423C]/90 disabled:opacity-50"
                      >
                        {actionLoading ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        disabled={actionLoading}
                        className="bg-[#8B0000] text-white px-3 py-1 rounded-md hover:bg-[#8B0000]/90 disabled:opacity-50"
                      >
                        {actionLoading ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedRows[request._id] && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Personal Information */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Personal Information</h4>
                          <DetailItem icon={FaCalendar} label="Date of Birth" value={request.doctorDateOfBirth} />
                          <DetailItem icon={FaIdCard} label="National ID" value={request.nationalID} />
                          <DetailItem icon={FaIdCard} label="Syndicate ID" value={request.syndicateID} />
                          <DetailItem icon={FaBriefcase} label="Experience" value={`${request.yearsOfExprience} years`} />
                        </div>

                        {/* Documents */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Documents</h4>
                          <div className="space-y-2">
                            <DocumentLink icon={FaFileAlt} label="Syndicate Card" href={request.syndicateCard} />
                            <DocumentLink icon={FaFileAlt} label="Doctor Image" href={request.doctorImage} />
                            {request.certificates?.map((cert, index) => (
                              <DocumentLink key={index} icon={FaFileAlt} label={`Certificate ${index + 1}`} href={cert} />
                            ))}
                          </div>
                        </div>

                        {/* Clinic Information */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Clinic Information</h4>
                          {request.clinic?.map((clinic, index) => (
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

      {filteredRequests.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-500">
            {searchTerm ? 'No requests match your search' : 'No pending doctor requests'}
          </p>
        </div>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

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

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <Icon className="text-primary w-5 h-5" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-800">{value || 'N/A'}</p>
    </div>
  </div>
);

export default DoctorRequests;