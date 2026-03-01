/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface NurseWithdraw {
  name: string;
  IBAN_number: string;
  totalAmount: number;
  completedAppointments: number;
  soloNurseId: string;
}
const baseURL = import.meta.env.VITE_API_ENDPOINT;

const NurseWithdrawRequest = () => {
  const [data, setData] = useState<NurseWithdraw[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWithdrawData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseURL}/solo-nurse-appointment/getAllSoloNurseCompletedAppoinmentAndAmount`,
        );

        const result = await response.json();
        console.log("result", result);

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch data");
        }

        setData(result.data); // adjust if your response structure differs
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawData();
  }, []);

  const handleExport = () => {
    if (data.length === 0) return;

    // Format data for Excel
    const formattedData = data.map((nurse) => ({
      "Nurse Name": nurse.name,
      "IBAN Number": nurse.IBAN_number,
      "Completed Appointments": nurse.completedAppointments,
      "Total Amount (₾)": nurse.totalAmount,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Withdraw Report");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "Nurse_Withdraw_Report.xlsx");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Nurse Withdraw Overview
            </h2>
            <p className="text-gray-500 mt-1">
              Manage completed appointments and payout requests
            </p>
          </div>
          <div>
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Export Data to Excel 
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Nurses</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {data.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">
              Total Completed Appointments
            </p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {data.reduce((sum, n) => sum + n.completedAppointments, 0)}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Pending Amount</p>
            <h3 className="text-2xl font-bold text-green-600 mt-2">
              ₾ {data.reduce((sum, n) => sum + n.totalAmount, 0).toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Nurse
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    IBAN
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Completed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data.map((nurse) => (
                  <tr
                    key={nurse.soloNurseId}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* Nurse Name with Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                          {nurse.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {nurse.name}
                        </span>
                      </div>
                    </td>

                    {/* IBAN */}
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {nurse.IBAN_number}
                    </td>

                    {/* Completed */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600 font-medium">
                        {nurse.completedAppointments} appointments
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₾ {nurse.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-gray-500">
                        No withdraw requests available
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseWithdrawRequest;
