import React, { useState, useMemo } from "react";
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
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DashboardScreen = () => {
  const [mainSections, setMainSections] = useState([
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
        title: "Recent Patients",
        data: [
          { id: 1, name: "John Doe", date: "2023-10-01", status: "Completed" },
          { id: 2, name: "Jane Smith", date: "2023-10-02", status: "Pending" },
          {
            id: 3,
            name: "Alice Johnson",
            date: "2023-10-03",
            status: "Completed",
          },
        ],
      },
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => (
          <span className="font-medium text-gray-900">{value}</span>
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => <span className="text-gray-600">{value}</span>,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              value === "Completed"
                ? "bg-primary text-background"
                : "bg-tertiary text-amber-800"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Actions",
        Cell: () => (
          <div className="flex gap-2">
            <button className="text-primary hover:text-indigo-900 transition-colors">
              <FaRegEdit className="w-4 h-4" />
            </button>
            <button className="text-red transition-colors">
              <FaRegTrashAlt className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const filteredPatients =
    mainSections
      .find((s) => s.id === "patients-table")
      ?.content?.data?.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (statusFilter === "all" || patient.status === statusFilter)
      ) || [];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: filteredPatients,
    });

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "MAIN_SECTIONS") {
      const items = [...mainSections];
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setMainSections(items);
    }

    if (type === "SUB_SECTIONS") {
      const sectionIndex = mainSections.findIndex(
        (section) => section.id === source.droppableId
      );
      const items = [...mainSections[sectionIndex].subsections];
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      const updatedSections = [...mainSections];
      updatedSections[sectionIndex].subsections = items;
      setMainSections(updatedSections);
    }
  };

  const handleRemoveNotification = (index) => {
    const updatedSections = [...mainSections];
    const notificationsSection = updatedSections.find(
      (s) => s.id === "notifications"
    );
    if (notificationsSection) {
      notificationsSection.items.splice(index, 1);
      setMainSections(updatedSections);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
                            <div className="relative flex-1">
                              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="all">All Statuses</option>
                              <option value="Completed">Completed</option>
                              <option value="Pending">Pending</option>
                            </select>
                          </div>

                          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
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
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                                        className="hover:bg-gray-50 transition-colors"
                                        key={rowIndex}
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
                                </tbody>
                              </table>
                            </div>

                            {filteredPatients.length === 0 && (
                              <div className="text-center py-6 bg-white">
                                <p className="text-gray-500">
                                  No patients found
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
