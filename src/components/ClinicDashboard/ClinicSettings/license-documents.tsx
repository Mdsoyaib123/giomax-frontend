import { useState } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// Certificate image - replace with your actual image path
const certificateImage =
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop";

// ========== Component 1: Upload Certificate Modal ==========
interface CertificateFormData {
  certificateName: string;
  certificateType: string;
  file: File | null;
}

const initialFormData: CertificateFormData = {
  certificateName: "",
  certificateType: "",
  file: null,
};

interface UploadCertificateModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const UploadCertificateModal: React.FC<UploadCertificateModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] =
    useState<CertificateFormData>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof CertificateFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB");
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      setError("Invalid file type. Only PDF, JPG, or PNG allowed.");
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, file }));
    setError(null);
  };

  const handleSubmit = () => {
    if (
      !formData.certificateName ||
      !formData.certificateType ||
      !formData.file
    ) {
      setError("Please fill all fields and upload a certificate.");
      return;
    }

    setIsUploading(true);
    setError(null);

    setTimeout(() => {
      setIsUploading(false);
      onSuccess();
    }, 2000);
  };

  const fileInputClass = `flex items-center p-3 rounded-md transition-all ${
    formData.file
      ? "border-2 border-green-500 bg-green-50"
      : "border border-gray-300 hover:border-blue-500"
  } relative cursor-pointer overflow-hidden`;

  return (
    <div className="fixed inset-0 bg-[#2D3C5266] bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl transform transition-all">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Upload Certificate
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="mb-6 text-sm text-gray-500">
            Upload relevant licenses and certifications
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.certificateName}
                onChange={(e) =>
                  handleInputChange("certificateName", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="State Clinic License"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.certificateType}
                onChange={(e) =>
                  handleInputChange("certificateType", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Medical License"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Certificate <span className="text-red-500">*</span>
            </label>
            <div className={fileInputClass}>
              <span className="flex-grow text-gray-700 truncate">
                {formData.file ? formData.file.name : "Upload your certificate"}
              </span>
              {formData.file && (
                <svg
                  className="w-6 h-6 text-green-500 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              PDF, JPG, PNG only. Max file size 5MB.
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 p-2 bg-red-100 border border-red-300 rounded-md mb-4">
              🚨 {error}
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading}
              className={`px-6 py-2 text-sm cursor-pointer font-medium text-white rounded-lg transition-colors shadow-md ${
                isUploading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== Component 2: License Successfully Modal ==========
interface LicenseSuccessfullyProps {
  onBack: () => void;
}

const LicenseSuccessfully: React.FC<LicenseSuccessfullyProps> = ({
  onBack,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3C5266] bg-opacity-40 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={48} className="text-blue-600" />
        </div>
        <h1 className="text-xl font-semibold mb-2">Uploaded Successfully</h1>
        <p className="text-gray-600 mb-6">
          Your License has been Submitted for validation. You will be notified
          once it gets approved.
        </p>
        <button
          onClick={onBack}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Back to License & Documents
        </button>
      </div>
    </div>
  );
};

// ========== Component 3: Remove Document Modal ==========
interface RemoveDocumentModalProps {
  onClose: () => void;
  onConfirm: () => void;
  documentName?: string;
}

const RemoveDocumentModal: React.FC<RemoveDocumentModalProps> = ({
  onClose,
  onConfirm,
  documentName = "Medical License",
}) => {
  return (
    <div className="fixed inset-0 bg-[#2D3C5266] bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={28} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
          Remove Documents
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Are you sure you want to Delete{" "}
          <span className="font-semibold text-gray-800">"{documentName}"</span>?
          Once deleted it cannot be retrieved.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== Component 4: Document Viewer Modal ==========
interface DocumentViewerProps {
  onClose: () => void;
  documentType?: string;
  fileFormat?: string;
  uploadDate?: string;
  verificationStatus?: string;
  imageUrl?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  onClose,
  documentType = "Medical License",
  fileFormat = "PDF Document",
  uploadDate = "October 15, 2025",
  verificationStatus = "Verified",
  imageUrl = certificateImage,
}) => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    if (zoom < 200) setZoom((prev) => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom((prev) => prev - 10);
  };

  return (
    <div className="fixed inset-0 bg-[#2D3C5266] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {documentType}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Document Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b border-gray-200">
          <div>
            <label className="text-xs text-gray-500 font-medium">
              Document Type
            </label>
            <div className="mt-1 text-sm text-gray-800 bg-white px-3 py-2 rounded border border-gray-200">
              {documentType}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">
              File Format
            </label>
            <div className="mt-1 text-sm text-gray-800 bg-white px-3 py-2 rounded border border-gray-200">
              {fileFormat}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">
              Upload Date
            </label>
            <div className="mt-1 text-sm text-gray-800 bg-white px-3 py-2 rounded border border-gray-200">
              {uploadDate}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">
              Verification Status
            </label>
            <div
              className={`mt-1 text-sm font-medium bg-white px-3 py-2 rounded border border-gray-200 ${
                verificationStatus === "Verified"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {verificationStatus}
            </div>
          </div>
        </div>

        {/* Document Viewer Header */}
        <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FileText size={18} />
            <span className="font-medium">Document Viewer</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[45px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Download"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Document Preview */}
        <div className="flex-1 overflow-auto bg-gray-200 p-4">
          <div
            className="mx-auto bg-white shadow-lg transition-all duration-200"
            style={{
              width: `${zoom}%`,
              maxWidth: "800px",
            }}
          >
            <img
              src={imageUrl}
              alt="Certificate Document"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== Main Component: License ==========
const License = () => {
  const [licenseNumber, setLicenseNumber] = useState("MD-123456");

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");

  const documents = [
    { id: 1, name: "Medical License", status: "verified" },
    { id: 2, name: "ID Verification", status: "verified" },
    { id: 3, name: "Board Certification", status: "verified" },
  ];

  // Handler functions
  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setShowSuccessModal(true);
  };

  const handleBackFromSuccess = () => {
    setShowSuccessModal(false);
    setShowUploadModal(true);
  };

  const handleViewDocument = (docName: string) => {
    setSelectedDocument(docName);
    setShowViewerModal(true);
  };

  const handleRemoveDocument = (docName: string) => {
    setSelectedDocument(docName);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    console.log("Document removed:", selectedDocument);
    setShowRemoveModal(false);
  };

  return (
    <div className=" ">
      <div className="">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8 ">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            License & Documents
          </h2>

          {/* Verification Status */}
          <div className="mt-6 mb-8 p-3 bg-[#F3F4F5]  rounded-xl">
            <div>
              <button className="px-3 mb-2 py-1 text-sm rounded bg-[#2E6FF3] text-white hover:bg-blue-600 transition">
                Verified Clinic
              </button>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="text-xs">Verification Status</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              Your clinic has been verified and approved by Med Connect. All
              documents are up to date.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-4/12">
            {/* Medical License Number */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 w-[736px]">
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
                    className="flex w-[400px] items-center justify-between p-4  bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-400 transition"
                  >
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="font-medium text-gray-800 whitespace-nowrap">
                        {doc.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDocument(doc.name)}
                        className="text-blue-600 whitespace-nowrap hover:text-blue-700 text-sm font-medium cursor-pointer"
                      >
                        View Document
                      </button>
                      <button
                        onClick={() => handleRemoveDocument(doc.name)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className=" mt-4 w-[400px] border-2 border-dashed border-gray-300 rounded-3xl 
             text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition 
             font-medium cursor-pointer flex flex-col items-center justify-center gap-2 text-center "
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Upload New Certificate
              </button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>
          </div>

          {/* Consultation Fees */}
          {/* <div className="mt-8 pt-8 border-t border-gray-200">
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
          </div> */}

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
      </div>

      {/* Modals */}
      {showUploadModal && (
        <UploadCertificateModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showSuccessModal && (
        <LicenseSuccessfully onBack={handleBackFromSuccess} />
      )}

      {showRemoveModal && (
        <RemoveDocumentModal
          onClose={() => setShowRemoveModal(false)}
          onConfirm={handleConfirmRemove}
          documentName={selectedDocument}
        />
      )}

      {showViewerModal && (
        <DocumentViewer
          onClose={() => setShowViewerModal(false)}
          documentType={selectedDocument}
        />
      )}
    </div>
  );
};

export default License;
