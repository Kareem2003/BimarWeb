import React, { useState, useEffect } from "react";
import { fetchAdminBookings } from "../../../api/services/AdminServices";

export const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const getBookings = () => {
      setLoading(true);
      fetchAdminBookings(
        (data) => {
          console.log("Bookings received:", data);
          const formattedBookings = Array.isArray(data)
            ? data.map((booking) => ({
                _id: booking._id,
                patientName: booking.patientId?.userName,
                doctorName: booking.doctorId?.doctorName,
                appointmentDate: booking.appointmentDate,
                // bookingNumber: booking.bookingNumber,
                bookingType: booking.bookingType,
                price: booking.Price,
                status: booking.status,
                // paymentStatus: booking.paymentStatus,
                patientEmail: booking.patientId?.userEmail,
                patientPhone: booking.patientId?.userPhone,
              }))
            : [];
          setBookings(formattedBookings);
        },
        (errorMessage) => {
          console.error("Booking fetch error:", errorMessage);
          setError(`Failed to load bookings: ${errorMessage}`);
        },
        () => setLoading(false)
      );
    };

    getBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking?.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking?.doctorName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      booking?.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading bookings</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Bookings ({bookings.length})</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-lg font-bold">
                        {booking.patientName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.patientName}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
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

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.doctorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.patientPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.patientEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Appointment Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(booking.appointmentDate).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {booking.bookingType.replace("-", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${booking.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {searchQuery
              ? "No bookings found matching your search"
              : "No bookings available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingsList;
