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
  FaTimes,
  FaExclamationTriangle,
  FaCheck,
  FaPlus,
  FaCheckCircle,
  FaRegCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
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
import { DOCTOR_INFO } from "../../helpers/constants/StaticKeys";
import {
  getTodos,
  createTodos,
  updateTodos,
  deleteTodos,
} from "../../api/services/TodoServices";
import Cookies from "js-cookie";

const getIconComponent = (id) => {
  switch (id) {
    case "income":
      return <FaMoneyBillWave className="text-purple-500 text-2xl" />;
    case "todayPatients":
      return <FaCalendarAlt className="text-blue-500 text-2xl" />;
    case "patients":
      return <FaUserInjured className="text-green-500 text-2xl" />;
    default:
      return null;
  }
};

const DashboardScreen = () => {
  const doctorData = localStorage.getItem(DOCTOR_INFO);
  const doctor = JSON.parse(doctorData);
  const {
    state,
    error,
    loading,
    setError,
    updateProp,
    handleCancelAppointment,
    handleDeleteAppointment,
  } = Logic();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clinicFilter, setClinicFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "appointmentDate",
    direction: "asc"
  });
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
          section.subsections = section.subsections.map((subsection) => {
            if (subsection.id === "subscription") {
              return {
                id: "todayPatients",
                title: "Today's Patients",
                value: state.todayPatients?.toString() || "0",
                icon: getIconComponent("todayPatients"),
              };
            }
            return {
              ...subsection,
              icon: getIconComponent(subsection.id),
            };
          });
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
            id: "todayPatients",
            title: "Today's Patients",
            value: state.totalPatientsToday?.toString() || "0",
            icon: <FaCalendarAlt className="text-blue-500 text-2xl" />,
          },
          {
            id: "patients",
            title: "Total Patients This Month",
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
            data: [],
          },
          {
            id: "notifications",
            type: "list",
            title: "To-Do List",
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
          title: "Recent Patients",
        },
      },
    ];
  });

  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    if (doctor && doctor._id) {
      fetchTodos();
    }
  }, []);

  const fetchTodos = () => {
    if (!doctor || !doctor._id) return;

    setIsLoadingTodos(true);
    getTodos(
      { doctorId: doctor._id },
      (response) => {
        setTodos(response || []);
        setIsLoadingTodos(false);
      },
      (error) => {
        console.error("Error fetching todos:", error);
        setIsLoadingTodos(false);
      },
      () => setIsLoadingTodos(false)
    );
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    createTodos(
      {
        doctorId: doctor._id,
        title: newTodoText,
        description: newTodoDescription,
      },
      (response) => {
        setTodos([...todos, response]);
        setNewTodoText("");
        setNewTodoDescription("");
      },
      (error) => {
        console.error("Error creating todo:", error);
      },
      () => {}
    );
  };

  const handleToggleTodo = (todo) => {
    updateTodos(
      {
        doctorId: doctor._id,
        todoId: todo._id,
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      },
      (response) => {
        setTodos(
          todos.map((t) =>
            t._id === todo._id ? { ...t, completed: !t.completed } : t
          )
        );
      },
      (error) => {
        console.error("Error updating todo:", error);
      },
      () => {}
    );
  };

  const handleDeleteTodo = (todoId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    deleteTodos(
      {
        doctorId: doctor._id,
        todoId,
      },
      (response) => {
        setTodos(todos.filter((t) => t._id !== todoId));
      },
      (error) => {
        console.error("Error deleting todo:", error);
      },
      () => {}
    );
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setNewTodoText(todo.title);
    setNewTodoDescription(todo.description || "");
  };

  const handleUpdateTodo = () => {
    if (!editingTodo || !newTodoText.trim()) return;

    updateTodos(
      {
        doctorId: doctor._id,
        todoId: editingTodo._id,
        title: newTodoText,
        description: newTodoDescription,
        completed: editingTodo.completed,
      },
      (response) => {
        setTodos(todos.map((t) => (t._id === editingTodo._id ? response : t)));
        setEditingTodo(null);
        setNewTodoText("");
        setNewTodoDescription("");
      },
      (error) => {
        console.error("Error updating todo:", error);
      },
      () => {}
    );
  };

  const handleDeleteClick = (todo) => {
    setTodoToDelete(todo);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (!todoToDelete) return;

    deleteTodos(
      {
        doctorId: doctor._id,
        todoId: todoToDelete._id,
      },
      (response) => {
        setTodos(todos.filter((t) => t._id !== todoToDelete._id));
        setShowDeleteAlert(false);
        setTodoToDelete(null);
      },
      (error) => {
        console.error("Error deleting todo:", error);
      },
      () => {}
    );
  };

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

  useEffect(() => {
    // Update the income value in mainSections when todayIncome changes
    if (mainSections.length > 0) {
      const updatedSections = [...mainSections];
      const statsSection = updatedSections.find(
        (section) => section.id === "stats"
      );

      if (statsSection && statsSection.subsections) {
        const incomeSubsection = statsSection.subsections.find(
          (sub) => sub.id === "income"
        );

        if (incomeSubsection) {
          // Format the income value with $ sign
          incomeSubsection.value = `$${state.todayIncome || 0}`;
          setMainSections(updatedSections);
        }
      }
    }
  }, [state.todayIncome, state.totalPatientsToday]);

  useEffect(() => {
    // Update the total patients value in mainSections when totalPatientsThisMonth changes
    if (mainSections.length > 0) {
      const updatedSections = [...mainSections];
      const statsSection = updatedSections.find(
        (section) => section.id === "stats"
      );

      if (statsSection && statsSection.subsections) {
        const patientsSubsection = statsSection.subsections.find(
          (sub) => sub.id === "patients"
        );

        if (patientsSubsection) {
          // Set the value directly from the state
          patientsSubsection.value =
            state.totalPatientsThisMonth?.toString() || "0";
          setMainSections(updatedSections);
        }
      }
    }
  }, [state.totalPatientsThisMonth]);

  useEffect(() => {
    if (mainSections.length > 0) {
      const updatedSections = [...mainSections];
      const chartsSection = updatedSections.find(
        (section) => section.id === "charts"
      );

      if (chartsSection && chartsSection.subsections) {
        const monthlyIncomeSubsection = chartsSection.subsections.find(
          (sub) => sub.id === "monthly-income"
        );

        if (monthlyIncomeSubsection && state.yearlyStats) {
          monthlyIncomeSubsection.data = state.yearlyStats;
          setMainSections(updatedSections);
        }
      }
    }
  }, [state.yearlyStats]);

  const columns = useMemo(
    () => [
      {
        Header: "Profile",
        accessor: "patientId.profileImage",
        Cell: ({ row }) => (
          <div className="flex items-center">
            {row.original.patientId.profileImage ? (
              <img
                src={`http://localhost:3000/${row.original.patientId.profileImage}`}
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
        Header: () => (
          <div 
            className="cursor-pointer hover:text-gray-700 flex items-center justify-center gap-1"
            onClick={() => handleSort("appointmentDate")}
          >
            Date
            {sortConfig.key === "appointmentDate" ? (
              sortConfig.direction === "asc" ? (
                <FaSortUp className="w-3 h-3" />
              ) : (
                <FaSortDown className="w-3 h-3" />
              )
            ) : (
              <FaSort className="w-3 h-3 text-gray-400" />
            )}
          </div>
        ),
        accessor: "appointmentDate",
        Cell: ({ value }) => (
          <span className="text-gray-600">
            {new Date(value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      },
      {
        Header: () => (
          <div 
            className="cursor-pointer hover:text-gray-700 flex items-center justify-center gap-1"
            onClick={() => handleSort("bookingNumber")}
          >
            Booking Number
            {sortConfig.key === "bookingNumber" ? (
              sortConfig.direction === "asc" ? (
                <FaSortUp className="w-3 h-3" />
              ) : (
                <FaSortDown className="w-3 h-3" />
              )
            ) : (
              <FaSort className="w-3 h-3 text-gray-400" />
            )}
          </div>
        ),
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
            <span className="text-gray-600 capitalize">
              {value.replace("-", " ")}
            </span>
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
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  display: "inline-block",
                  backgroundColor: "#EF4444", // bg-red-500
                  color: "white",
                }}
              >
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
          return <div className="flex justify-center">{statusElement}</div>;
        },
      },
      {
        Header: "Clinic Name",
        accessor: "clinicId",
        Cell: ({ value }) => {
          // Find the clinic name from doctor's clinic data
          const clinic = doctor?.clinic?.find(clinic => clinic._id === value);
          const clinicName = clinic?.clinicName || "Unknown Clinic";
          
          return (
            <div className="flex justify-center">
              <span className="text-gray-600 font-medium">{clinicName}</span>
            </div>
          );
        },
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
                    style={{ transition: "color 0.2s ease" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#EF4444")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "#4B5563")
                    }
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
                        transform: "translateX(-50%)",
                        maxWidth: "fit-content",
                        pointerEvents: "none", // Prevents the tooltip from capturing mouse events
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
    [sortConfig]
  );

  const filteredPatients = useMemo(() => {
    const filtered =
      state.appointments?.filter((patient) => {
        if (!patient || !patient.patientId) return false;

        return (
          patient.patientId.userName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) &&
          (statusFilter === "all" ||
            patient.status.toLowerCase() === statusFilter.toLowerCase()) &&
          (clinicFilter === "all" ||
            patient.clinicId === clinicFilter)
        );
      }) || [];

    // Sort based on sortConfig
    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === "appointmentDate") {
        aValue = new Date(a.appointmentDate);
        bValue = new Date(b.appointmentDate);
      } else if (sortConfig.key === "bookingNumber") {
        aValue = a.bookingNumber;
        bValue = b.bookingNumber;
      } else {
        return 0;
      }

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [state.appointments, searchQuery, statusFilter, clinicFilter, sortConfig]);

  const paginatedPatients = useMemo(() => {
    return filteredPatients.slice(0, displayCount);
  }, [filteredPatients, displayCount]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: paginatedPatients,
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
    setDisplayCount((prev) => prev + 5);
  };

  const handleRowClick = (patientData) => {
    if (
      patientData &&
      patientData.patientId &&
      patientData.patientId.userEmail
    ) {
      // Save to cookies for persistence
      Cookies.set("APPOINTMENT_ID", patientData._id);
      Cookies.set("PATIENT_EMAIL", patientData.patientId.userEmail);
      navigate("/medicalRecords", {
        state: {
          patientEmail: patientData.patientId.userEmail,
          appointmentId: patientData._id,
        },
      });
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc"
    }));
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
          <button className="float-right" onClick={() => setError(null)}>
            &times;
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <h2 className="text-xl text-gray-600 mb-6">
        Welcome, {"DR. " + doctor.doctorName}
      </h2>

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
                                      className={`bg-background rounded-xl p-6 shadow-md flex-grow ${
                                        subsection.id === "notifications"
                                          ? "min-h-[340px]"
                                          : "max-h-full"
                                      } mx-2 mb-4`}
                                    >
                                      <div className="text-sm sm:text-base">
                                        {subsection.type === "chart" ? (
                                          <div className="w-[350px] pr-3">
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
                                              width={450}
                                              height={289}
                                              data={subsection.data}
                                              margin={{
                                                top: 0,
                                                right: 0,
                                                left: 0,
                                                bottom: 20,
                                              }}
                                            >
                                              <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#f0f0f0"
                                              />
                                              <XAxis
                                                dataKey="month"
                                                tick={{
                                                  fill: "#6b7280",
                                                  angle: -45, // Rotate text to vertical
                                                  textAnchor: "end",
                                                  dy: 10, // Adjust vertical position
                                                }}
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

                                            {/* Updated Flex Layout */}
                                            <div className="flex flex-col md:flex-row gap-6 bg-[#E9EFEC] rounded-lg p-4 h-72">
                                              {/* Input Card - Left Side */}
                                              <div className="md:w-1/2 w-full bg-white rounded-md border border-[#C4DAD2] p-4 pt-6 space-y-3 shadow-sm">
                                                <input
                                                  type="text"
                                                  value={newTodoText}
                                                  onChange={(e) =>
                                                    setNewTodoText(
                                                      e.target.value
                                                    )
                                                  }
                                                  onKeyDown={(e) =>
                                                    e.key === "Enter" &&
                                                    (editingTodo
                                                      ? handleUpdateTodo()
                                                      : handleAddTodo())
                                                  }
                                                  placeholder="Add a new task..."
                                                  className="w-full px-4 py-2 rounded-md border border-[#C4DAD2] bg-white text-[#2E354C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A9C89]"
                                                />
                                                <textarea
                                                  value={newTodoDescription}
                                                  onChange={(e) =>
                                                    setNewTodoDescription(
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="Add a description (optional)"
                                                  className="w-full px-4 py-2 rounded-md border border-[#C4DAD2] bg-white text-[#2E354C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A9C89] resize-none"
                                                  rows={3}
                                                />
                                                <div className="flex justify-end">
                                                  <button
                                                    onClick={
                                                      editingTodo
                                                        ? handleUpdateTodo
                                                        : handleAddTodo
                                                    }
                                                    className="flex items-center gap-2 bg-[#16423C] text-white px-5 py-2 rounded-md hover:bg-[#6A9C89] transition"
                                                  >
                                                    {editingTodo ? (
                                                      <>
                                                        <FaCheck className="w-4 h-4" />
                                                        Update Task
                                                      </>
                                                    ) : (
                                                      <>
                                                        <FaPlus className="w-4 h-4" />
                                                        Add Task
                                                      </>
                                                    )}
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Task List - Right Side */}
                                              <div className="md:w-1/2 w-full max-h-80 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-[#C4DAD2] scrollbar-track-transparent">
                                                {isLoadingTodos ? (
                                                  <div className="flex justify-center py-4">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#16423C]"></div>
                                                  </div>
                                                ) : (
                                                  <ul className="space-y-2">
                                                    {todos.map((todo) => (
                                                      <li
                                                        key={todo._id}
                                                        className="flex justify-between items-start p-4 bg-white rounded-lg border border-[#C4DAD2] shadow-sm"
                                                      >
                                                        <div className="flex items-start gap-3">
                                                          <input
                                                            type="checkbox"
                                                            checked={
                                                              todo.completed
                                                            }
                                                            onChange={() =>
                                                              handleToggleTodo(
                                                                todo
                                                              )
                                                            }
                                                            className="h-5 w-5 mt-1 accent-[#16423C] rounded-full"
                                                          />
                                                          <div>
                                                            <p
                                                              className={`font-semibold ${
                                                                todo.completed
                                                                  ? "line-through text-gray-400"
                                                                  : "text-[#2E354C]"
                                                              }`}
                                                            >
                                                              {todo.title}
                                                            </p>
                                                            {todo.description && (
                                                              <p className="text-sm text-gray-500">
                                                                {
                                                                  todo.description
                                                                }
                                                              </p>
                                                            )}
                                                          </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                          <button
                                                            onClick={() =>
                                                              handleEditTodo(
                                                                todo
                                                              )
                                                            }
                                                            className="text-[#16423C] hover:text-[#6A9C89]"
                                                            title="Edit task"
                                                          >
                                                            <FaRegEdit className="w-4 h-4" />
                                                          </button>
                                                          <button
                                                            onClick={() =>
                                                              handleDeleteClick(
                                                                todo
                                                              )
                                                            }
                                                            className="text-[#FD9B63] hover:text-red-600"
                                                            title="Delete task"
                                                          >
                                                            <FaRegTrashAlt className="w-4 h-4" />
                                                          </button>
                                                        </div>
                                                      </li>
                                                    ))}
                                                    {todos.length === 0 && (
                                                      <li className="text-center py-4 text-gray-500 bg-white rounded-lg border border-[#C4DAD2]">
                                                        No tasks yet. Add one
                                                        above!
                                                      </li>
                                                    )}
                                                  </ul>
                                                )}
                                              </div>
                                            </div>
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
                            <select
                              value={clinicFilter}
                              onChange={(e) => setClinicFilter(e.target.value)}
                              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="all">All Clinics</option>
                              {doctor?.clinic?.map((clinic) => (
                                <option key={clinic._id} value={clinic._id}>
                                  {clinic.clinicName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div
                              className="overflow-x-auto"
                              style={{ overflowY: "hidden" }}
                            >
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
                                    const isCompletedOrCancelled = row.original.status === "Completed" || row.original.status === "Cancelled";
                                    return (
                                      <tr
                                        {...row.getRowProps()}
                                        className={`transition-colors ${
                                          !isCompletedOrCancelled ? "hover:bg-gray-50" : ""
                                        }`}
                                        key={rowIndex}
                                      >
                                        {row.cells.map((cell, cellIndex) => {
                                          const isActionsColumn =
                                            cellIndex === row.cells.length - 1;

                                          return (
                                            <td
                                              {...cell.getCellProps()}
                                              className={`px-6 py-4 whitespace-nowrap ${
                                                !isActionsColumn && !isCompletedOrCancelled
                                                  ? "cursor-pointer"
                                                  : ""
                                              } ${
                                                isCompletedOrCancelled && !isActionsColumn
                                                  ? "opacity-60"
                                                  : ""
                                              }`}
                                              key={cellIndex}
                                              onClick={(e) => {
                                                e.stopPropagation();

                                                // Only navigate if this is NOT the actions column AND status is not Completed/Cancelled
                                                if (!isActionsColumn && !isCompletedOrCancelled) {
                                                  handleRowClick(row.original);
                                                }
                                              }}
                                            >
                                              {cell.render("Cell")}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })}

                                  {filteredPatients.length > displayCount && (
                                    <tr>
                                      <td
                                        colSpan={columns.length}
                                        className="px-6 py-4"
                                      >
                                        <button
                                          onClick={handleLoadMore}
                                          className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors flex items-center justify-center"
                                        >
                                          Load More
                                          <svg
                                            className="ml-2 w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 9l-7 7-7-7"
                                            />
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
                                {loading ? (
                                  <div className="flex items-center justify-center text-gray-500">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-2"></div>
                                    Loading appointments...
                                  </div>
                                ) : state.appointments?.length === 0 ? (
                                  <p className="text-gray-500">
                                    No appointments found
                                  </p>
                                ) : (
                                  <p className="text-gray-500">
                                    No matching patients found
                                  </p>
                                )}
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
      {/* Custom Delete Alert */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-80 mx-4 shadow-2xl ">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-tertiary-100 rounded-full">
                <FaExclamationTriangle className="w-5 h-5 text-tertiary" />
              </div>
              <h3 className="text-lg font-bold text-textColor">Delete Task</h3>
              <button
                onClick={() => {
                  setShowDeleteAlert(false);
                  setTodoToDelete(null);
                }}
                className="ml-auto text-red-500 hover:text-red-600 transition-colors duration-200"
                aria-label="Close delete alert"
              ></button>
            </div>
            <p className="text-textColor mb-6 text-base font-medium leading-relaxed">
              Are you sure you want to{" "}
              <span className="text-red-600 font-semibold">delete</span>{" "}
              <span className="font-semibold">{todoToDelete?.title}</span>?
              <br />
              <span className="text-gray-500 text-sm">
                This action cannot be undone.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteAlert(false);
                  setTodoToDelete(null);
                }}
                className="px-4 py-2 bg-secondary text-black rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-semibold"
              >
                <FaRegTrashAlt className="w-4 h-4 text-tertiary" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
