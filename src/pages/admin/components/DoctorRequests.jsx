import React, { useState } from 'react';
import { useFetchDoctorRequests } from '../logic';

export const DoctorRequests = () => {
  const { requests, loading, error } = useFetchDoctorRequests();
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (requestId) => {
    console.log('Approving request:', requestId);
  };

  const handleReject = (requestId) => {
    console.log('Rejecting request:', requestId);
  };

  const filteredRequests = requests.filter((request) =>
    request.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search requests..."
          className="px-4 py-2 border rounded-lg w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{request.doctorName}</h3>
                <p className="text-gray-500">{request.specialty}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {request.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Email</p>
                <p>{request.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p>{request.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Experience</p>
                <p>{request.experience} years</p>
              </div>
              <div>
                <p className="text-gray-500">Applied On</p>
                <p>{request.appliedDate}</p>
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 
export default DoctorRequests;