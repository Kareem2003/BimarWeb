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
  useFetchRatingsOverview,
} from "../logic";
import { FaStar, FaRegStar } from "react-icons/fa";

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
  const { ratingsOverview, loading: loadingRatings } =
    useFetchRatingsOverview();

  // Debug log
  console.log("ratingsOverview:", ratingsOverview);

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

      {/* Ratings Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ratings Overview Block */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-primary flex items-center gap-2">
            <FaStar className="text-yellow-400" /> Ratings Overview
          </h3>
          {loadingRatings ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : ratingsOverview ? (
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                <div className="flex flex-col items-center justify-center bg-yellow-50 rounded-xl p-4 min-w-[120px]">
                  <span className="text-4xl font-bold text-yellow-500 flex items-center gap-1">
                    {ratingsOverview.overview.averageRating}
                    <FaStar className="text-yellow-400 text-2xl" />
                  </span>
                  <span className="text-gray-500 text-sm mt-1">
                    Average Rating
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-4 min-w-[120px]">
                  <span className="text-3xl font-bold text-blue-600">
                    {ratingsOverview.overview.totalRatings}
                  </span>
                  <span className="text-gray-500 text-sm mt-1">
                    Total Ratings
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-700">
                  Distribution
                </h4>
                <div className="space-y-2">
                  {Object.entries(ratingsOverview.overview.distribution)
                    .sort((a, b) => b[0] - a[0])
                    .map(([star, count]) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-8 flex items-center">
                          {Array.from({ length: star }, (_, i) => (
                            <FaStar
                              key={i}
                              className="text-yellow-400 text-xs"
                            />
                          ))}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${ratingsOverview.overview.percentages[star]}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-600 min-w-[40px]">
                          {count} ({ratingsOverview.overview.percentages[star]}
                          %)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-gray-700">
                  User Type Stats
                </h4>
                <div className="flex gap-6">
                  <div className="bg-green-50 rounded-lg px-4 py-2 flex flex-col items-center">
                    <span className="font-bold text-green-600 text-lg">
                      {ratingsOverview.userTypeStats.doctors.count}
                    </span>
                    <span className="text-xs text-gray-500">Doctors</span>
                    <span className="text-xs text-gray-400">
                      Avg: {ratingsOverview.userTypeStats.doctors.average}
                    </span>
                  </div>
                  <div className="bg-purple-50 rounded-lg px-4 py-2 flex flex-col items-center">
                    <span className="font-bold text-purple-600 text-lg">
                      {ratingsOverview.userTypeStats.patients.count}
                    </span>
                    <span className="text-xs text-gray-500">Patients</span>
                    <span className="text-xs text-gray-400">
                      Avg: {ratingsOverview.userTypeStats.patients.average}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No ratings data available</div>
          )}
        </div>
        {/* Ratings Comments Block */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-primary flex items-center gap-2">
            <FaStar className="text-yellow-400" /> Ratings Comments
          </h3>
          {loadingRatings ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : ratingsOverview ? (
            <ul className="space-y-6 max-h-96 overflow-y-auto pr-2">
              {ratingsOverview.ratings.map((rating) => (
                <li
                  key={rating.id}
                  className="flex gap-4 items-start border-b pb-4 last:border-b-0 last:pb-0"
                >
                  {rating.user?.image ? (
                    <img
                      src={`http://localhost:3000/${rating.user.image.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={rating.user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold border-2 border-gray-300">
                      {rating.user?.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {rating.user?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">
                        {rating.userType}
                      </span>
                      <span className="ml-2 flex items-center gap-0.5">
                        {Array.from({ length: rating.rating }, (_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-sm" />
                        ))}
                        {Array.from({ length: 5 - rating.rating }, (_, i) => (
                          <FaRegStar
                            key={i}
                            className="text-gray-300 text-sm"
                          />
                        ))}
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(rating.createdAt).toLocaleDateString()}{" "}
                        {new Date(rating.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-gray-700 text-sm italic">
                      &quot;{rating.comment}&quot;
                    </div>
                  </div>
                </li>
              ))}
              {ratingsOverview.ratings.length === 0 && (
                <li className="text-gray-500">No ratings available</li>
              )}
            </ul>
          ) : (
            <div className="text-gray-500">No ratings data available</div>
          )}
        </div>
      </div>
    </div>
  );
};
