/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetAClinicQuery,
  useUpdateAvailabilityMutation,
} from "@/redux/features/admin/clinic/clinicBasicApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// --- Type Definitions ---
interface AvailabilityState {
  startTime: string;
  endTime: string;
  workingDays: string; // Keep as string for UI, convert from array for API
  inClinicEnabled: boolean;
  onlineConsultEnabled: boolean;
}

// --- Reusable Toggle Component ---
interface ToggleItemProps {
  title: string;
  description: string;
  name: keyof AvailabilityState;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  borderBottom: boolean;
}

const ToggleItem: React.FC<ToggleItemProps> = ({
  title,
  description,
  name,
  checked,
  onChange,
  borderBottom,
}) => {
  return (
    <div
      className={`flex justify-between items-center py-4 ${
        borderBottom ? "border-b border-gray-100" : ""
      }`}
    >
      <div>
        <p className="font-medium text-gray-700">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};

// --- Main Availability Settings Component ---
const AvailabilitySettings: React.FC = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const { data: clinicResponse, isLoading } = useGetAClinicQuery(userId!, {
    skip: !userId,
  });
  const [updateAvailability, { isLoading: isUpdating }] =
    useUpdateAvailabilityMutation();
  const [settings, setSettings] = useState<AvailabilityState>({
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    workingDays: "Monday, Tuesday, Wednesday, Friday",
    inClinicEnabled: true,
    onlineConsultEnabled: true,
  });

  // Load data from API when available
  useEffect(() => {
    if (clinicResponse?.data?.availability) {
      const availability = clinicResponse.data.availability;

      // Convert workingDays array to comma-separated string
      const workingDaysString = availability.workingDays?.join(", ") || "";

      // Determine appointment types based on appointmentType
      const inClinicEnabled =
        availability.appointmentType === "in-clinic" ||
        availability.appointmentType === "both";
      const onlineConsultEnabled =
        availability.appointmentType === "online" ||
        availability.appointmentType === "both";

      setSettings({
        startTime: availability.startTime || "09:00 AM",
        endTime: availability.endTime || "05:00 PM",
        workingDays: workingDaysString,
        inClinicEnabled,
        onlineConsultEnabled,
      });
    }
  }, [clinicResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    // Prepare data for update in API format
    const updateData = {
      startTime: settings.startTime,
      endTime: settings.endTime,
      workingDays: settings.workingDays
        .split(",")
        .map((day) => day.trim())
        .filter((day) => day.length > 0),
      appointmentType:
        settings.inClinicEnabled && settings.onlineConsultEnabled
          ? "both"
          : settings.inClinicEnabled
          ? "in-clinic"
          : "online",
    };

    console.log("Saving changes:", updateData);

    try {
      // Call the update mutation with the userId and updateData
      const response = await updateAvailability({
        id: userId!, // Assuming your mutation expects clinic ID/user ID
        data: updateData, // This should match your API endpoint's expected payload
      }).unwrap(); // .unwrap() throws an error if the request fails

      // Show success message
      toast.success("Availability updated successfully!");
      console.log("Update response:", response);
    } catch (error: any) {
      console.error("Failed to update availability:", error);

      // Show error message
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to update availability. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full mx-auto mt-5">
      <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center sm:text-left">
        Availability Settings
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Column */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            Working Hours
          </h4>

          <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="startTime"
              >
                Start Time *
              </label>
              <div className="relative">
                <input
                  id="startTime"
                  name="startTime"
                  type="text"
                  value={settings.startTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2.5 pl-3 pr-10 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="12:00 AM"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  ⏱
                </span>
              </div>
            </div>

            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="endTime"
              >
                End Time *
              </label>
              <div className="relative">
                <input
                  id="endTime"
                  name="endTime"
                  type="text"
                  value={settings.endTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2.5 pl-3 pr-10 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="4:15 PM"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  ⏱
                </span>
              </div>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="workingDays"
            >
              Working Days *
            </label>
            <input
              id="workingDays"
              name="workingDays"
              type="text"
              value={settings.workingDays}
              onChange={handleChange}
              placeholder="Monday, Tuesday, Wednesday, Thursday, Friday"
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate days with commas
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            Appointment Type
          </h4>

          <ToggleItem
            title="In-Clinic Visits"
            description="Accept in-clinic visits"
            name="inClinicEnabled"
            checked={settings.inClinicEnabled}
            onChange={handleChange}
            borderBottom={true}
          />

          <ToggleItem
            title="Online Consultations"
            description="Accept video consultations"
            name="onlineConsultEnabled"
            checked={settings.onlineConsultEnabled}
            onChange={handleChange}
            borderBottom={false}
          />

          {/* Show current appointment type status */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Current setting:{" "}
              <span className="font-medium">
                {settings.inClinicEnabled && settings.onlineConsultEnabled
                  ? "Both In-Clinic and Online"
                  : settings.inClinicEnabled
                  ? "In-Clinic Only"
                  : "Online Only"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-10 pt-6">
        <button
          type="button"
          className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer"
        >
          {isUpdating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
