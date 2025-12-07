import React from "react";

const DialogueSkeleton: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl relative shadow-2xl border border-[#DBE0E5] max-h-[94vh] overflow-y-auto animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#DBE0E5]">
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-64"></div>
          </div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-10 bg-gray-300 rounded w-full"></div>
            ))}
          </div>

          {/* Appointment History */}
          <div>
            <div className="h-5 w-40 bg-gray-300 rounded mb-2"></div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-300"
                      >
                        &nbsp;
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx}>
                      {Array.from({ length: 4 }).map((__, jdx) => (
                        <td
                          key={jdx}
                          className="px-4 py-3 h-6 bg-gray-200 rounded my-1"
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctors List */}
          <div>
            <div className="h-5 w-48 bg-gray-300 rounded mb-2"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueSkeleton;
