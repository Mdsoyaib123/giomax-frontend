import React, { useState } from "react";
import { X, ArrowLeft, UploadCloud, Edit, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useAddNewDoctorMutation } from "@/redux/features/doctors/doctorsApi";
import { useSingleClinicId } from "@/hooks/userClinicId";

interface DoctorData {
  doctorName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  serviceType: string;
  startTime: string;
  endTime: string;
  availabilityScheduleDays: string;
  appointmentType: string;
  uploadCertificates?: File;
  onlineConsultationFee: string;
  clinicVisitFee: string;
}

const appointmentTypeOptions = ["online", "onClinic"];

const AddDoctorForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<DoctorData>({
    doctorName: "",
    email: "",
    phoneNumber: "",
    licenseNumber: "",
    serviceType: "",
    startTime: "",
    endTime: "",
    availabilityScheduleDays: "",
    appointmentType: appointmentTypeOptions[0],
    onlineConsultationFee: "",
    clinicVisitFee: "",
  });

  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [addNewDoctor] = useAddNewDoctorMutation();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const { clinicId, isLoading: isClinicIdLoading } = useSingleClinicId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        uploadCertificates: file,
      }));
      setFileName(file.name);
      setFileUploaded(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClinicIdLoading) return;

    // Validate required fields
    if (!formData.uploadCertificates) {
      toast.error("Please upload the doctor's certificate!");
      return;
    }

    if (!formData.serviceType.trim()) {
      toast.error("Please enter a service type!");
      return;
    }

    if (
      formData.appointmentType === "" ||
      !appointmentTypeOptions.includes(formData.appointmentType)
    ) {
      toast.error("Please select a valid appointment type!");
      return;
    }

    setLoading(true);
    console.log("Adding new doctor:", formData);
    const payload = { ...formData, clinicId: clinicId };
    try {
      await addNewDoctor(payload).unwrap();
      toast.success("New doctor added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding new doctor:", error);
      toast.error("Failed to add new doctor. Please try again.");
      setLoading(false);
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("New doctor added successfully!");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter">
      <div className="bg-white rounded-xl max-w-4xl w-[1100px] relative shadow-2xl border border-gray-200 transform transition-all max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 mr-2 rounded-full hover:bg-gray-50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Add New Doctor
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the doctor's information to add them to your clinic
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-1 rounded-full hover:bg-gray-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grow overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctor Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Doctor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  placeholder="Dr. David Giorgadze"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="david.g@gmail.com"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+995 595 123456"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                />
              </div>

              {/* License Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="MED-001-2024"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            {/* Service & Appointment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Type - Now a text input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  placeholder="e.g., General Medicine, Cardiology, Pediatrics"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                />
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Appointment Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer capitalize"
                  >
                    {appointmentTypeOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        disabled={option.includes("Select")}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Availability Schedule */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Availability Days <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="availabilityScheduleDays"
                value={formData.availabilityScheduleDays}
                onChange={handleChange}
                placeholder="Monday, Tuesday, Wednesday, Friday"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate days with commas (e.g., Monday, Wednesday, Friday)
              </p>
            </div>

            {/* Fees Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Online Consultation Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Online Consultation Fee ($){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="onlineConsultationFee"
                    value={formData.onlineConsultationFee}
                    onChange={handleChange}
                    placeholder="Enter consultation fee"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                  />
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Clinic Visit Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Clinic Visit Fee ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="clinicVisitFee"
                    value={formData.clinicVisitFee}
                    onChange={handleChange}
                    placeholder="Enter clinic visit fee"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                  />
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Upload Certificate <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                id="doctorCertificate"
                className="hidden"
                onChange={handleFileChange}
              />

              <label
                htmlFor="doctorCertificate"
                className={`flex items-center justify-center w-full px-4 py-3 text-sm font-semibold rounded-lg transition-colors cursor-pointer border-2 ${
                  fileUploaded
                    ? "text-green-600 bg-green-50 border-green-300"
                    : "text-blue-600 bg-white border-dashed border-blue-300 hover:bg-blue-50"
                }`}
              >
                <UploadCloud className="w-5 h-5 mr-2" />
                {fileUploaded ? fileName : "Upload your doctor certificate"}
              </label>

              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold w-full sm:w-[493px] h-[50px] rounded-2xl cursor-pointer text-gray-700 bg-[#EFF4FF] hover:bg-gray-200 transition-colors"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 cursor-pointer text-sm font-semibold w-full sm:w-[493px] h-[50px] rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit className="w-4 h-4" />
              {loading ? "Adding..." : "Add Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorForm;
