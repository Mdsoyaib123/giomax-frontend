import { useState } from "react";

const License = () => {
  const [licenseNumber, setLicenseNumber] = useState("MD-123456");
  const [clinicVisitFee, setClinicVisitFee] = useState("100");
  const [onlineConsultationFee, setOnlineConsultationFee] = useState("80");

  const documents = [
    { id: 1, name: "Medical License", status: "verified" },
    { id: 2, name: "ID Verification", status: "verified" },
    { id: 3, name: "Board Certification", status: "verified" }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8 mt-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">License & Documents</h2>
      
      {/* Verification Status */}
      <div className="mt-6 mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
          <span className="text-xs">Verified Clinic</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Your clinic has been verified and approved by Med Connect. All documents are up to date.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical License Number */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical License Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Enter license number"
          />
        </div>

        {/* Certificates & Documents */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Certificates & Documents
          </label>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-400 transition"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium text-gray-800">{doc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
                    View Document
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition font-medium cursor-pointer flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload New Certificate
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Supported formats: PDF, JPG, PNG (Max 5MB)
          </p>
        </div>
      </div>

      {/* Consultation Fees */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Consultation Fees</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Visit <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
              <input
                type="number"
                value={clinicVisitFee}
                onChange={(e) => setClinicVisitFee(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Online Consultation <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
              <input
                type="number"
                value={onlineConsultationFee}
                onChange={(e) => setOnlineConsultationFee(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
<div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 justify-start sm:justify-end">
  <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer">
    Save Changes
  </button>
  <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium cursor-pointer">
    Cancel
  </button>
</div>

    </div>
  );
};

export default License;