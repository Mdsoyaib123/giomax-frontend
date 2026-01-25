import React, { useState } from "react";
import { X, ArrowLeft, UploadCloud, Plus, Trash2 } from "lucide-react";
import { DoctorData, DoctorAvailabilitySlot } from "@/redux/types/doctorType";
import { useUpdateDoctorMutation } from "@/redux/features/doctors/doctorsApi";
import { toast } from "sonner";

interface EditDoctorDetailsProps {
  doctor: DoctorData;
  onClose: () => void;
}

interface DoctorFormData {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  serviceType: string;
  availability: DoctorAvailabilitySlot[];
  dateOfBirth: string;
  gender: string;
  appointmentType: string;
  onlineConsultationFee: number;
  clinicVisitFee: number;
  experienceYears: number;
  qualifications: string;
  about: string;
  blockedDatesUpdates: { date: string; action: "add" | "remove" }[];
}

// --- Main Component: EditDoctorDetails ---
const EditDoctorDetails: React.FC<EditDoctorDetailsProps> = ({
  doctor,
  onClose,
}) => {
  console.log("Doctor data received:", doctor);
  const [updateDoctor, { isLoading }] = useUpdateDoctorMutation();

  const initialAvailability: DoctorAvailabilitySlot[] = [
    { day: "Saturday", startTime: "09:00", endTime: "17:00", isEnabled: false },
    { day: "Sunday", startTime: "09:00", endTime: "17:00", isEnabled: false },
    { day: "Monday", startTime: "09:00", endTime: "17:00", isEnabled: false },
    { day: "Tuesday", startTime: "09:00", endTime: "17:00", isEnabled: false },
    { day: "Wednesday", startTime: "09:00", endTime: "17:00", isEnabled: false },
    { day: "Thursday", startTime: "09:00", endTime: "17:00", isEnabled: false },
    { day: "Friday", startTime: "09:00", endTime: "17:00", isEnabled: false },
  ];

  // Map the API data to form fields
  const getDefaultFormData = (): DoctorFormData => {
    // Merge existing availability with the initial full list
    const mergedAvailability = initialAvailability.map((slot) => {
      const existing = doctor?.availability?.find((s) => s.day === slot.day);
      return existing ? { ...existing } : slot;
    });

    return {
      name: doctor?.userId?.fullName || "",
      email: doctor?.userId?.email || "",
      phone: doctor?.phoneNumber || "",
      specialty: doctor?.professionalInformation?.speciality || "",
      licenseNumber: doctor?.licenseNumber || "",
      serviceType: doctor?.serviceType || "",
      availability: mergedAvailability,
      dateOfBirth: doctor?.dateOfBirth?.split("T")[0] || "1980-05-15",
      gender: doctor?.gender || "male",
      appointmentType: doctor?.appointmentType || "online",
      onlineConsultationFee: doctor?.onlineConsultationFee || 50,
      clinicVisitFee: doctor?.clinicVisitFee || 100,
      experienceYears: doctor?.professionalInformation?.experienceYears || 10,
      qualifications:
        doctor?.professionalInformation?.qualifications || "MBBS, MD",
      about: doctor?.professionalInformation?.about || "Experienced doctor.",
      blockedDatesUpdates: [],
    };
  };

  const [formData, setFormData] = useState<DoctorFormData>(
    getDefaultFormData()
  );
  const [loading, setLoading] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    
    // Check if it's already in the updates list (as add)
    if (formData.blockedDatesUpdates.some(u => u.date === newBlockedDate && u.action === 'add')) {
        toast.error("This date is already being added.");
        return;
    }

    // If it was being removed, cancel the removal
    const existingRemove = formData.blockedDatesUpdates.find(u => u.date === newBlockedDate && u.action === 'remove');
    if (existingRemove) {
        setFormData(prev => ({
            ...prev,
            blockedDatesUpdates: prev.blockedDatesUpdates.filter(u => u !== existingRemove)
        }));
        setNewBlockedDate("");
        return;
    }

    // Check if it's already blocked (and not being removed)
    if (doctor?.blockedDates?.some(d => d.date.split('T')[0] === newBlockedDate)) {
        toast.error("This date is already blocked.");
        return;
    }

    setFormData(prev => ({
        ...prev,
        blockedDatesUpdates: [...prev.blockedDatesUpdates, { date: newBlockedDate, action: 'add' }]
    }));
    setNewBlockedDate("");
  };

  const handleRemoveBlockedDate = (date: string, isExisting: boolean) => {
    if (isExisting) {
        // If it was already added in this session, just remove it from updates
        const addUpdate = formData.blockedDatesUpdates.find(u => u.date === date && u.action === 'add');
        if (addUpdate) {
            setFormData(prev => ({
                ...prev,
                blockedDatesUpdates: prev.blockedDatesUpdates.filter(u => u !== addUpdate)
            }));
            return;
        }

        // Otherwise, mark for removal
        setFormData(prev => ({
            ...prev,
            blockedDatesUpdates: [...prev.blockedDatesUpdates, { date, action: 'remove' }]
        }));
    } else {
        // Removing a newly added date
        setFormData(prev => ({
            ...prev,
            blockedDatesUpdates: prev.blockedDatesUpdates.filter(u => u.date !== date)
        }));
    }
  };

  const handleToggleDay = (index: number) => {
    setFormData((prev) => {
      const newAvailability = [...prev.availability];
      newAvailability[index] = {
        ...newAvailability[index],
        isEnabled: !newAvailability[index].isEnabled,
      };
      return { ...prev, availability: newAvailability };
    });
  };

  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setFormData((prev) => {
      const newAvailability = [...prev.availability];
      newAvailability[index] = {
        ...newAvailability[index],
        [field]: value,
      };
      return { ...prev, availability: newAvailability };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const enabledDays = formData.availability.filter((day) => day.isEnabled);

    if (enabledDays.length === 0) {
      toast.error("Please select at least one availability day!");
      setLoading(false);
      return;
    }

    try {
      // Prepare the API payload
      const updatedData = {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        availability: enabledDays,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        serviceType: formData.serviceType,
        appointmentType: formData.appointmentType,
        onlineConsultationFee: formData.onlineConsultationFee,
        clinicVisitFee: formData.clinicVisitFee,
        blockedDates: formData.blockedDatesUpdates,
        professionalInformation: {
          speciality: formData.specialty,
          experienceYears: formData.experienceYears,
          medicalLicenseNumber: formData.licenseNumber,
          qualifications: formData.qualifications,
          about: formData.about,
        },
        licenseNumber: formData.licenseNumber,
      };

      console.log("Payload for API:", updatedData);

      // Call the update mutation
      const response = await updateDoctor({
        id: doctor._id,
        data: updatedData,
      }).unwrap();

      if ("error" in response) {
        throw new Error("Failed to update doctor");
      }
      toast.success("Doctor details saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error("Failed to save doctor details. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const serviceTypeOptions = [
    "General Physician",
    "Specialist",
    "Surgeon",
    "Consultant",
    doctor?.serviceType || "General Physician",
  ].filter((value, index, self) => self.indexOf(value) === index);

  const genderOptions = ["male", "female", "other"];
  const appointmentTypeOptions = ["online", "clinic", "both"];

  // --- Helper Functions ---
  const renderInput = (
    label: string,
    name: keyof DoctorFormData,
    type: string = "text",
    required: boolean = true,
    placeholder?: string
  ) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name as string}
        placeholder={placeholder}
        value={formData[name] as string}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );

  const renderNumberInput = (
    label: string,
    name: keyof DoctorFormData,
    min?: number,
    max?: number,
    required: boolean = true
  ) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="number"
        name={name as string}
        value={formData[name] as string}
        onChange={handleChange}
        required={required}
        min={min}
        max={max}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );

  const renderSelect = (
    label: string,
    name: keyof DoctorFormData,
    options: string[]
  ) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          name={name as string}
          value={formData[name] as string}
          onChange={handleChange}
          required
          className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
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
  );

  const renderTextArea = (
    label: string,
    name: keyof DoctorFormData,
    rows: number = 3,
    required: boolean = true
  ) => (
    <div className="col-span-2">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name as string}
        value={formData[name] as string}
        onChange={handleChange}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter">
      <div className="bg-white rounded-xl w-[1100px] max-w-4xl relative shadow-2xl border border-gray-200 transform transition-all max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-start">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 mr-2 rounded-full hover:bg-gray-50"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-6 h-6 text-black" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Edit Doctor Information
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update Dr. {doctor?.userId?.fullName}'s details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-1 rounded-full hover:bg-gray-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="grow overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {renderInput(
                  "Doctor Name",
                  "name",
                  "text",
                  true,
                  "Dr. John Doe"
                )}
                {renderInput(
                  "Email Address",
                  "email",
                  "email",
                  true,
                  "doctor@gmail.com"
                )}
                {renderInput(
                  "Phone Number",
                  "phone",
                  "tel",
                  true,
                  "+995 595 123456"
                )}
                {renderInput("Date of Birth", "dateOfBirth", "date", true)}
                {renderSelect("Gender", "gender", genderOptions)}
                {renderInput(
                  "License Number",
                  "licenseNumber",
                  "text",
                  true,
                  "MED-001-2024"
                )}
              </div>
            </div>

            {/* Professional Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-6">
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {renderInput(
                  "Specialty",
                  "specialty",
                  "text",
                  true,
                  "e.g., General Medicine, Cardiology"
                )}
                {renderNumberInput(
                  "Years of Experience",
                  "experienceYears",
                  0,
                  50
                )}
                {renderInput(
                  "Qualifications",
                  "qualifications",
                  "text",
                  true,
                  "MBBS, MD"
                )}
                {renderTextArea("About", "about", 3, false)}

                {/* Show existing certificates if available */}
                {doctor?.certificates && doctor.certificates.length > 0 && (
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Existing Certificates
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {doctor.certificates.map(
                        (cert, index) =>
                          cert.uploadCertificates && (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                            >
                              <span className="text-sm text-gray-600 truncate">
                                Certificate {index + 1}
                              </span>
                              <a
                                href={cert.uploadCertificates}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 text-sm"
                              >
                                View
                              </a>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Certificate Upload */}
              <div className="mt-6 flex justify-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  id="doctorCertificate"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setCertificateFile(e.target.files[0]);
                      console.log("Selected certificate:", e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="doctorCertificate"
                  className="flex items-center justify-center w-full max-w-sm px-6 py-3 text-sm font-semibold text-blue-600 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-5 h-5 mr-2" />
                  {certificateFile
                    ? certificateFile.name
                    : "Upload New Certificate"}
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>

            {/* Service Configuration */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-6">
                Service Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {renderSelect(
                  "Service Type",
                  "serviceType",
                  serviceTypeOptions
                )}
                {renderSelect(
                  "Appointment Type",
                  "appointmentType",
                  appointmentTypeOptions
                )}
                {renderNumberInput(
                  "Online Consultation Fee ($)",
                  "onlineConsultationFee",
                  0,
                  1000
                )}
                {renderNumberInput(
                  "Clinic Visit Fee ($)",
                  "clinicVisitFee",
                  0,
                  1000
                )}
              </div>
            </div>

            {/* Availability Settings */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-6">
                Availability Settings
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Set the doctor's working hours for each day. Toggle to enable/disable days.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.availability.map((item, index) => (
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
                        <input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={item.endTime}
                          onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blocked Dates Management */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-6">
                Manage Blocked Dates
              </h3>
              
              <div className="space-y-4">
                {/* Existing and To-Be-Removed Dates */}
                <div className="flex flex-wrap gap-2">
                  {doctor?.blockedDates?.map((d) => {
                    const dateStr = d.date.split('T')[0];
                    const isRemoved = formData.blockedDatesUpdates.some(u => u.date === dateStr && u.action === 'remove');
                    return (
                      <div 
                        key={d._id || d.date} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          isRemoved ? "bg-red-50 border-red-200 opacity-50 grayscale" : "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                        }`}
                      >
                        <span className={isRemoved ? "line-through text-red-600" : ""}>{dateStr}</span>
                        {!isRemoved && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveBlockedDate(dateStr, true)}
                            className="hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isRemoved && (
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              blockedDatesUpdates: prev.blockedDatesUpdates.filter(u => u.date !== dateStr)
                            }))}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Plus className="w-3.5 h-3.5 rotate-45" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* Newly Added Dates */}
                  {formData.blockedDatesUpdates.filter(u => u.action === 'add').map((u) => (
                    <div 
                      key={u.date} 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-green-50 border border-green-200 text-green-700 font-medium shadow-sm"
                    >
                      <span>{u.date}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveBlockedDate(u.date, false)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] bg-green-200 px-1 rounded uppercase">New</span>
                    </div>
                  ))}
                </div>

                {/* Add New Blocked Date */}
                <div className="flex items-end gap-3 max-w-sm">
                  <div className="grow">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Add New Blocked Date</label>
                    <input
                      type="date"
                      value={newBlockedDate}
                      onChange={(e) => setNewBlockedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBlockedDate}
                    className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Clinic Info (Read only) */}
            {doctor?.clinicId && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-6">
                  Clinic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Clinic Phone
                    </label>
                    <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-900 text-sm">
                      {doctor.clinicId.phoneNumber || "Not available"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Medical License
                    </label>
                    <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-900 text-sm">
                      {doctor.clinicId.medicalLicenseNumber || "Not available"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold w-[493px] h-14 rounded-md text-gray-700 bg-[#EFF4FF] hover:bg-gray-200 transition-colors border border-transparent"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading || isLoading}
              className="px-6 py-2.5 text-sm font-semibold w-[493px] h-14 rounded-md bg-[#2E6FF3] text-white hover:bg-blue-700 transition-colors border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorDetails;
