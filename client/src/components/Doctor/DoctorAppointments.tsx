import React, { FunctionComponent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

const DoctorAppointments: FunctionComponent<{}> = () => {
  const appointments = [
    {
      name: "Shruthi",
      email: "shruthi@gmail.com",
      date: "03/26/2023",
      time: "9.00 AM",
      status: "Pending",
      id: "1",
    },
    {
      name: "Hasini",
      email: "hasini@gmail.com",
      date: "03/27/2023",
      time: "10.00 AM",
      status: "Confirmed",
      id: "1",
    },
  ];
  const getStatusColor = (status: String) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200";
      case "Confirmed":
        return "bg-green-200";
      case "Cancelled":
        return "bg-red-200";
      default:
        return "";
    }
  };
  return (
    <div className="flex flex-col  px-4 lg:px-8 ">
      <div className="bg-gray-100 py-4 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex items-center">
          <label htmlFor="date" className="mr-2 text-sm font-medium">
            Filter by date:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <button className="bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2">
            Filter
          </button>
        </div>
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.date}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
