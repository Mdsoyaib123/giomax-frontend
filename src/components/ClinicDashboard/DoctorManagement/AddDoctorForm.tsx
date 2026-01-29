import React, { useState } from "react";
import { X, ArrowLeft, UploadCloud, Edit } from "lucide-react";
import { toast } from "sonner";
import { useAddNewDoctorMutation } from "@/redux/features/doctors/doctorsApi";
import { useSingleClinicId } from "@/hooks/userClinicId";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
  isEnabled: boolean;
}

interface DoctorData {
  doctorName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  serviceType: string;
  availabilitySchedule: AvailabilitySlot[];
  appointmentType: string;
  uploadCertificates?: File;
  onlineConsultationFee: string;
  clinicVisitFee: string;
  speciality: string;
  availabilityDateRange: {
    startDate: Date | null;
    endDate: Date | null;
    isEnabled: boolean;
  };
  slotTimeDuration: string;
}

const appointmentTypeOptions = ["inClinic", "online","both"];

const initialAvailability: AvailabilitySlot[] = [
  { day: "Saturday", startTime: "09:00", endTime: "17:00", isEnabled: false },
  { day: "Sunday", startTime: "09:00", endTime: "17:00", isEnabled: false },
  { day: "Monday", startTime: "09:00", endTime: "17:00", isEnabled: false },
  { day: "Tuesday", startTime: "09:00", endTime: "17:00", isEnabled: false },
  { day: "Wednesday", startTime: "09:00", endTime: "17:00", isEnabled: false },
  { day: "Thursday", startTime: "09:00", endTime: "17:00", isEnabled: false },
  { day: "Friday", startTime: "09:00", endTime: "17:00", isEnabled: false },
];

const AddDoctorForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [formData, setFormData] = useState<DoctorData>({
    doctorName: "",
    email: "",
    phoneNumber: "",
    licenseNumber: "",
    serviceType: "",
    availabilitySchedule: initialAvailability,
    appointmentType: appointmentTypeOptions[0],
    onlineConsultationFee: "",
    clinicVisitFee: "",
    speciality: "",
    availabilityDateRange: {
      startDate: null,
      endDate: null,
      isEnabled: true,
    },
    slotTimeDuration: "",
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

  const handleToggleDay = (index: number) => {
    setFormData((prev) => {
      const newSchedule = [...prev.availabilitySchedule];
      newSchedule[index] = {
        ...newSchedule[index],
        isEnabled: !newSchedule[index].isEnabled,
      };
      return { ...prev, availabilitySchedule: newSchedule };
    });
  };

  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setFormData((prev) => {
      const newSchedule = [...prev.availabilitySchedule];
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: value,
      };
      return { ...prev, availabilitySchedule: newSchedule };
    });
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

    const enabledDays = formData.availabilitySchedule.filter((day) => day.isEnabled);
    
    if (enabledDays.length === 0) {
      toast.error("Please select at least one availability day!");
      setLoading(false);
      return;
    }

    if (!formData.availabilityDateRange.startDate || !formData.availabilityDateRange.endDate) {
      toast.error("Please select availability date range!");
      setLoading(false);
      return;
    }

    setLoading(true);

    const formatDate = (date: Date | null) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formDataPayload = new FormData();
    formDataPayload.append("doctorName", formData.doctorName);
    formDataPayload.append("email", formData.email);
    formDataPayload.append("phoneNumber", formData.phoneNumber);
    formDataPayload.append("licenseNumber", formData.licenseNumber);
    formDataPayload.append("serviceType", formData.serviceType);
    formDataPayload.append("appointmentType", formData.appointmentType);
    formDataPayload.append("onlineConsultationFee", formData.onlineConsultationFee);
    formDataPayload.append("clinicVisitFee", formData.clinicVisitFee);
    formDataPayload.append("slotTimeDuration", formData.slotTimeDuration);
    // speciality is currently empty/unused in form but in state
    if (formData.speciality) formDataPayload.append("speciality", formData.speciality);
    
    if (clinicId) formDataPayload.append("clinicId", clinicId);

    // File
    if (formData.uploadCertificates) {
      formDataPayload.append("uploadCertificates", formData.uploadCertificates);
    }

    // Complex objects
    formDataPayload.append("availability", JSON.stringify(formData.availabilitySchedule));

    const formattedDateRange = {
      startDate: formatDate(formData.availabilityDateRange.startDate),
      endDate: formatDate(formData.availabilityDateRange.endDate),
      isEnabled: true,
    };
    formDataPayload.append("availableDateRange", JSON.stringify(formattedDateRange));

    console.log("Sending FormData...");
    
    try {
      await addNewDoctor(formDataPayload).unwrap();
      toast.success("New doctor added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding new doctor:", error);
      toast.error("Failed to add new doctor. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter">
      <div className="bg-white rounded-xl w-full max-w-4xl relative shadow-2xl border border-gray-200 transform transition-all max-h-[95vh] overflow-hidden flex flex-col mx-4 md:mx-0">
        {/* Header */}
        <div className="flex items-start justify-between p-4 md:p-6 border-b border-gray-100 shrink-0">
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
          <div className="p-4 md:p-6 space-y-6">
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
                  placeholder="e.g., General Physician"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                />
              </div>

              {/* Specialty - New text input */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  placeholder="e.g., Cardiology, Pediatrics"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                />
              </div> */}

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

            {/* Availability Date Range */}
            <div className="pb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Availability Date Range <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selectsRange={true}
                  startDate={formData.availabilityDateRange.startDate}
                  endDate={formData.availabilityDateRange.endDate}
                  onChange={(update: [Date | null, Date | null]) => {
                    const [start, end] = update;
                    setFormData((prev) => ({
                      ...prev,
                      availabilityDateRange: {
                        ...prev.availabilityDateRange,
                        startDate: start,
                        endDate: end,
                      },
                    }));
                  }}
                  isClearable={true}
                  placeholderText="Select start and end date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                  required
                  monthsShown={isMobile ? 1 : 2}
                  popperProps={{ strategy: "fixed" }}
                />
              </div>
            </div>

            {/* Availability Settings */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Availability Settings</h3>
                <p className="text-sm text-gray-500">
                  Set your working hours for each day. Toggle to enable/disable days.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.availabilitySchedule.map((item, index) => (
                  <div
                    key={item.day}
                    className={`p-4 rounded-xl border transition-all ${
                      item.isEnabled
                        ? "border-blue-500 bg-blue-50/30 shadow-sm"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`font-semibold ${item.isEnabled ? "text-blue-700" : "text-gray-700"}`}>
                        {item.day}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isEnabled}
                          onChange={() => handleToggleDay(index)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className={`grid grid-cols-2 gap-3 transition-opacity duration-200 ${item.isEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Start Time
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            value={item.startTime}
                            onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                          End Time
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            value={item.endTime}
                            onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fees Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Online Consultation Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Online Consultation Fee (₾){" "}
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
                
                </div>
              </div>

              {/* Clinic Visit Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Clinic Visit Fee (₾) <span className="text-red-500">*</span>
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
                </div>
              </div>

               {/* Slot Time Duration */}
               <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Slot Time Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="slotTimeDuration"
                    value={formData.slotTimeDuration}
                    onChange={handleChange}
                    placeholder="e.g. 30"
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                  />
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
