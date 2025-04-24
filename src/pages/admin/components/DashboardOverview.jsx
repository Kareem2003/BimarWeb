import React from "react";
import {
  MdPeople,
  MdLocalHospital,
  MdEventNote,
  MdAssignment,
} from "react-icons/md";
import {
  useFetchDoctors,
  useFetchPatients,
  useFetchBookings,
  useFetchDoctorRequests,
} from "../logic";

const StatCard = ({ icon: Icon, title, value, loading, className }) => (
  <div className={`p-6 rounded-lg shadow-md ${className}`}>
    <div className="flex items-center">
      <Icon className="w-8 h-8 mr-3" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold mt-1">{loading ? "..." : value}</p>
      </div>
    </div>
  </div>
);

export const DashboardOverview = () => {
  const { doctors, loading: loadingDoctors } = useFetchDoctors();
  const { patients, loading: loadingPatients } = useFetchPatients();
  const { bookings, loading: loadingBookings } = useFetchBookings();
  const { requests, loading: loadingRequests } = useFetchDoctorRequests();

  const recentBookings = Array.isArray(bookings)
    ? bookings
        .sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        )
        .slice(0, 3)
    : [];
  const recentRequests = Array.isArray(requests) ? requests.slice(0, 5) : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={MdLocalHospital}
          title="Total Doctors"
          value={doctors?.length || 0}
          loading={loadingDoctors}
          className="bg-white text-primary"
        />
        <StatCard
          icon={MdPeople}
          title="Total Patients"
          value={patients?.length || 0}
          loading={loadingPatients}
          className="bg-white text-primary"
        />
        <StatCard
          icon={MdEventNote}
          title="Total Bookings"
          value={bookings?.length || 0}
          loading={loadingBookings}
          className="bg-white text-primary"
        />
        <StatCard
          icon={MdAssignment}
          title="Pending Requests"
          value={requests?.length || 0}
          loading={loadingRequests}
          className="bg-white text-primary"
        />
      </div>

      {/* Recent Bookings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          {loadingBookings ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentBookings.map((booking) => (
                <li
                  key={booking._id}
                  className="flex flex-col gap-1 p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {booking.patientId?.userName || "Unknown Patient"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      Dr. {booking.doctorId?.doctorName || "Unknown Doctor"}
                    </span>
                    <span>
                      {new Date(booking.appointmentDate).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </li>
              ))}
              {recentBookings.length === 0 && (
                <li className="text-center py-4 text-gray-500">
                  No recent bookings
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Recent Requests Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Doctor Requests</h3>
          {loadingRequests ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-2">
              {recentRequests.map((request) => (
                <li
                  key={request._id}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  <span>{request.doctorName}</span>
                  <span className="text-sm text-gray-500">
                    {request.status}
                  </span>
                </li>
              ))}
              {recentRequests.length === 0 && <li>No recent requests</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
