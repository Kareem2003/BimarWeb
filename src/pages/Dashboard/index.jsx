import React, { useState, useMemo, useEffect } from "react";
import { useTable } from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUserInjured,
  FaGripVertical,
  FaSearch,
  FaRegEdit,
  FaRegTrashAlt,
  FaTimes
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import AppInput from "../../components/AppInput1.jsx";
import { DASHBOARD_SECTIONS } from "../../helpers/constants/StaticKeys";
import Logic from "./logic";
import { useNavigate } from "react-router-dom";

const getIconComponent = (id) => {
  switch (id) {
    case "income":
      return <FaMoneyBillWave className="text-purple-500 text-2xl" />;
    case "subscription":
      return <FaCalendarAlt className="text-blue-500 text-2xl" />;
    case "patients":
      return <FaUserInjured className="text-green-500 text-2xl" />;
    default:
      return null;
  }
};

const DashboardScreen = () => {
  const { 
    state, 
    error, 
    loading,
    setError, 
    updateProp, 
    handleCancelAppointment, 
    handleDeleteAppointment 
  } = Logic();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(5);
  const navigate = useNavigate();
  
  const [mainSections, setMainSections] = useState(() => {
    // Try to get saved order from localStorage
    const savedSections = localStorage.getItem(DASHBOARD_SECTIONS);
    if (savedSections) {
      const parsed = JSON.parse(savedSections);
      // Reconstruct the icons after loading from localStorage
      return parsed.map((section) => {
        if (section.id === "stats") {
          section.subsections = section.subsections.map((subsection) => ({
            ...subsection,
            icon: getIconComponent(subsection.id),
          }));
        }
        return section;
      });
    }

    // Return default sections if nothing is saved
    return [
      {
        id: "stats",
        subsections: [
          {
            id: "income",
            title: "Today's Income",
            value: "$300",
            icon: <FaMoneyBillWave className="text-purple-500 text-2xl" />,
          },
          {
            id: "subscription",
            title: "Subscription Time Left",
            value: "20 Days",
            icon: <FaCalendarAlt className="text-blue-500 text-2xl" />,
          },
          {
            id: "patients",
            title: "Total Patients Last Month",
            value: "10",
            icon: <FaUserInjured className="text-green-500 text-2xl" />,
          },
        ],
      },
      {
        id: "charts",
        subsections: [
          {
            id: "monthly-income",
            type: "chart",
            title: "Monthly Income",
            data: [
              { month: "Jan", income: 4000 },
              { month: "Feb", income: 3000 },
              { month: "Mar", income: 5000 },
            ],
          },
          {
            id: "notifications",
            type: "list",
            title: "Notifications",
            items: [
              "You have 3 pending appointments.",
              "You have 3 pending appointments.",
              "Your subscription ends in 5 days.",
            ],
          },
        ],
      },
      {
        id: "patients-table",
        content: {
          type: "table",
          title: "Recent Patients"
        },
      },
    ];
  });

  useEffect(() => {
    const sectionsToSave = mainSections.map((section) => {
      if (section.id === "stats") {
        return {
          ...section,
          subsections: section.subsections.map((subsection) => ({
            ...subsection,
            icon: undefined, // Remove icon before saving
          })),
        };
      }
      return section;
    });

    localStorage.setItem(DASHBOARD_SECTIONS, JSON.stringify(sectionsToSave));
  }, [mainSections]);

  const columns = useMemo(
    () => [
      {
        Header: "Profile",
        accessor: "patientId.profileImage",
        Cell: ({ row }) => (
          <div className="flex items-center">
            {row.original.patientId.profileImage ? (
              <img
                src={row.original.patientId.profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUserInjured className="text-gray-500" />
              </div>
            )}
          </div>
        ),
      },
      {
        Header: "Name",
        accessor: "patientId.userName",
        Cell: ({ value }) => (
          <span className="font-medium text-gray-900">{value}</span>
        ),
      },
      {
        Header: "Phone",
        accessor: "patientId.userPhone",
        Cell: ({ value }) => <span className="text-gray-600">{value}</span>,
      },
      {
        Header: "Date",
        accessor: "appointmentDate",
        Cell: ({ value }) => (
          <span className="text-gray-600">
            {new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        ),
      },
      {
        Header: "Booking Number",
        accessor: "bookingNumber",
        Cell: ({ value }) => (
          <div className="flex justify-center">
            <span className="text-gray-600">#{value}</span>
          </div>
        ),
      },
      {
        Header: "Booking Type",
        accessor: "bookingType",
        Cell: ({ value }) => (
          <div className="flex justify-center">
            <span className="text-gray-600 capitalize">{value.replace('-', ' ')}</span>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          console.log("Status value:", value, "Type:", typeof value);
          
          // Case-insensitive comparison
          const statusLower = value?.toLowerCase();
          
          // Create the appropriate status element based on value
          let statusElement;
          
          // For Completed - keep existing green
          if (statusLower === "completed") {
            statusElement = (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-background inline-block">
                {value}
              </span>
            );
          }
          // For Cancelled - change to red
          else if (statusLower === "cancelled") {
            statusElement = (
              <span style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                display: 'inline-block',
                backgroundColor: '#EF4444',  // bg-red-500
                color: 'white'
              }}>
                {value}
              </span>
            );
          }
          // For Pending or any other status - keep existing amber/yellow
          else {
            statusElement = (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-tertiary text-amber-800 inline-block">
                {value}
              </span>
            );
          }
          
          // Return the status element wrapped in a centered container
          return (
            <div className="flex justify-center">
              {statusElement}
            </div>
          );
        },
      },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
        Cell: ({ value }) => (
          <div className="flex justify-center">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                value === "Paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {value}
            </span>
          </div>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => {
          // State to track if the tooltip is visible
          const [tooltipVisible, setTooltipVisible] = useState(false);

          return (
            <div className="flex justify-center relative">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
              ) : (
                <div 
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setTooltipVisible(true)}
                  onMouseLeave={() => setTooltipVisible(false)}
                >
                  <button 
                    className="hover:text-red-500 transition-colors duration-200 text-gray-600"
                    onClick={() => {
                      if (row.original.status === "Pending") {
                        handleCancelAppointment(row.original._id);
                      } else {
                        handleDeleteAppointment(row.original._id);
                      }
                    }}
                    disabled={loading}
                    style={{ transition: 'color 0.2s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#EF4444'} 
                    onMouseOut={(e) => e.currentTarget.style.color = '#4B5563'} 
                  >
                    {row.original.status === "Pending" ? (
                      <FaTimes className="w-5 h-5" />
                    ) : (
                      <FaRegTrashAlt className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Tooltip that appears on hover */}
                  {tooltipVisible && (
                    <div 
                      className="absolute top-full -translate-x-1/2 left-1/2 mt-1 bg-white shadow-lg rounded px-2 py-1 text-xs font-medium text-black whitespace-nowrap z-10"
                      style={{ 
                        transform: 'translateX(-50%)',
                        maxWidth: 'fit-content',
                        pointerEvents: 'none'  // Prevents the tooltip from capturing mouse events
                      }}
                    >
                      {row.original.status === "Pending" ? "Cancel" : "Delete"}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const filteredPatients = useMemo(() => {
    const filtered = state.appointments?.filter(
      (patient) => {
        if (!patient || !patient.patientId) return false;
        
        return patient.patientId.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase());
      }
    ) || [];
    
    // Sort by appointment date (oldest first)
    return filtered.sort((a, b) => {
      return new Date(a.appointmentDate) - new Date(b.appointmentDate);
    });
  }, [state.appointments, searchQuery, statusFilter]);

  const paginatedPatients = useMemo(() => {
    return filteredPatients.slice(0, displayCount);
  }, [filteredPatients, displayCount]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: paginatedPatients
    });

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    let updatedSections = [...mainSections];

    if (type === "MAIN_SECTIONS") {
      const [reorderedItem] = updatedSections.splice(source.index, 1);
      updatedSections.splice(destination.index, 0, reorderedItem);
    }

    if (type === "SUB_SECTIONS") {
      const sectionIndex = updatedSections.findIndex(
        (section) => section.id === source.droppableId
      );
      const items = [...updatedSections[sectionIndex].subsections];
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      updatedSections[sectionIndex].subsections = items;
    }

    setMainSections(updatedSections);
  };

  const handleRemoveNotification = (index) => {
    const updatedSections = [...mainSections];
    const chartsSection = updatedSections.find((s) => s.id === "charts");
    const notificationsSubsection = chartsSection.subsections.find(
      (s) => s.id === "notifications"
    );

    if (notificationsSubsection) {
      notificationsSubsection.items = notificationsSubsection.items.filter(
        (_, i) => i !== index
      );
      setMainSections(updatedSections);
      localStorage.setItem(DASHBOARD_SECTIONS, JSON.stringify(updatedSections));
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  const handleRowClick = (patientData) => {
    if (patientData && patientData.patientId && patientData.patientId.userEmail) {
      navigate('/medicalRecords', { 
        state: { patientEmail: patientData.patientId.userEmail }
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-700">Loading...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
          <button 
            className="float-right"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <h2 className="text-xl text-gray-600 mb-6">Welcome, Kareem</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="main-sections"
          direction="vertical"
          type="MAIN_SECTIONS"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {mainSections.map((section, sectionIndex) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={sectionIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="flex justify-end mb-4"
                      >
                        <FaGripVertical className="text-textColor hover:text-tertiary text-xl cursor-grab" />
                      </div>

                      {section.subsections ? (
                        <Droppable
                          droppableId={section.id}
                          type="SUB_SECTIONS"
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="flex flex-col sm:flex-row justify-start items-start overflow-x-auto pb-4 w-full"
                            >
                              {section.subsections.map((subsection, index) => (
                                <Draggable
                                  key={subsection.id}
                                  draggableId={subsection.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`bg-background rounded-xl p-6 w-full sm:w-[300px] md:w-[400px] lg:w-[500px] shadow-md flex-grow ${
                                        subsection.id === "notifications"
                                          ? "min-h-[340px]"
                                          : "max-h-full"
                                      } mx-2 mb-4`}
                                    >
                                      <div className="text-sm sm:text-base">
                                        {subsection.type === "chart" ? (
                                          <div className="w-[650px]">
                                            <div
                                              {...provided.dragHandleProps}
                                              className="flex justify-between mb-2"
                                            >
                                              <FaGripVertical className="text-textColor hover:text-tertiary text-lg cursor-grab" />
                                              <h3 className="text-xl font-semibold text-textColor mb-4">
                                                {subsection.title}
                                              </h3>
                                            </div>

                                            <LineChart
                                              width={650}
                                              height={240}
                                              data={subsection.data}
                                            >
                                              <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#f0f0f0"
                                              />
                                              <XAxis
                                                dataKey="month"
                                                tick={{ fill: "#6b7280" }}
                                              />
                                              <YAxis
                                                tick={{ fill: "#6b7280" }}
                                              />
                                              <Tooltip
                                                contentStyle={{
                                                  background: "#fff",
                                                  border: "none",
                                                  borderRadius: "8px",
                                                  boxShadow:
                                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                }}
                                              />
                                              <Line
                                                type="monotone"
                                                dataKey="income"
                                                stroke="#6366f1"
                                                strokeWidth={2}
                                                dot={{ fill: "#6366f1" }}
                                              />
                                            </LineChart>
                                          </div>
                                        ) : subsection.type === "list" ? (
                                          <div>
                                            <div
                                              {...provided.dragHandleProps}
                                              className="flex justify-between mb-2"
                                            >
                                              <FaGripVertical className="text-textColor hover:text-tertiary text-lg cursor-grab" />
                                              <h3 className="text-xl font-semibold text-textColor mb-4">
                                                {subsection.title}
                                              </h3>
                                            </div>
                                            <ul className="space-y-3 max-h-60 overflow-y-auto">
                                              {subsection.items.map(
                                                (item, i) => (
                                                  <li
                                                    key={i}
                                                    className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                                  >
                                                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
                                                    <span className="text-textColor flex-grow">
                                                      {item}
                                                    </span>
                                                    <button
                                                      className="text-red-500 hover:text-red-700"
                                                      onClick={() =>
                                                        handleRemoveNotification(
                                                          i
                                                        )
                                                      }
                                                    >
                                                      <FaRegTrashAlt className="w-4 h-4 text-textColor hover:text-red" />
                                                    </button>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        ) : (
                                          <div>
                                            <div
                                              {...provided.dragHandleProps}
                                              className="flex justify-between mb-2"
                                            >
                                              <FaGripVertical className="text-textColor hover:text-tertiary text-lg cursor-grab" />
                                              <h3 className="text-xl font-semibold text-textColor mb-4">
                                                {subsection.title}
                                              </h3>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <span className="text-3xl font-bold text-gray-900">
                                                {subsection.value}
                                              </span>
                                              <div className="p-3 bg-white rounded-full shadow-lg">
                                                {subsection.icon}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ) : (
                        <div>
                          <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <AppInput
                              term={searchQuery}
                              onChangeText={(e) =>
                                setSearchQuery(e.target.value)
                              }
                              placeholder="Search patients..."
                              inputWrapperStyle="relative flex-1"
                              iconName="search"
                              iconSize={20}
                              type="text"
                            />
                            <select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="all">All Statuses</option>
                              <option value="Completed">Completed</option>
                              <option value="Pending">Pending</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="overflow-x-auto" style={{ overflowY: 'hidden' }}>
                              <table
                                {...getTableProps()}
                                className="w-full divide-y divide-gray-200"
                              >
                                <thead className="bg-gray-50">
                                  {headerGroups.map((headerGroup, index) => (
                                    <tr
                                      {...headerGroup.getHeaderGroupProps()}
                                      key={index}
                                    >
                                      {headerGroup.headers.map(
                                        (column, columnIndex) => (
                                          <th
                                            {...column.getHeaderProps()}
                                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            key={columnIndex}
                                          >
                                            {column.render("Header")}
                                          </th>
                                        )
                                      )}
                                    </tr>
                                  ))}
                                </thead>
                                <tbody
                                  {...getTableBodyProps()}
                                  className="bg-white divide-y divide-gray-200"
                                >
                                  {rows.map((row, rowIndex) => {
                                    prepareRow(row);
                                    return (
                                      <tr
                                        {...row.getRowProps()}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        key={rowIndex}
                                        onClick={() => handleRowClick(row.original)}
                                      >
                                        {row.cells.map((cell, cellIndex) => (
                                          <td
                                            {...cell.getCellProps()}
                                            className="px-6 py-4 whitespace-nowrap"
                                            key={cellIndex}
                                          >
                                            {cell.render("Cell")}
                                          </td>
                                        ))}
                                      </tr>
                                    );
                                  })}
                                  
                                  {filteredPatients.length > displayCount && (
                                    <tr>
                                      <td colSpan={columns.length} className="px-6 py-4">
                                        <button 
                                          onClick={handleLoadMore}
                                          className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors flex items-center justify-center"
                                        >
                                          Load More
                                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </button>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {filteredPatients.length === 0 && (
                              <div className="text-center py-6 bg-white">
                                <p className="text-gray-500">
                                  {loading ? (
                                    <div className="flex items-center justify-center">
                                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-2"></div>
                                      Loading appointments...
                                    </div>
                                  ) : state.appointments?.length === 0 ? (
                                    "No appointments found"
                                  ) : (
                                    "No matching patients found"
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DashboardScreen;
