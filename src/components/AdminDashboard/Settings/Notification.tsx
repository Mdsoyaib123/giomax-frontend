import React, { useState } from "react";

const Toggle: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 cursor-pointer w-11 items-center rounded-full transition-colors ${
      enabled ? "bg-blue-500" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-0.5"
      }`}
    />
  </button>
);

const Notification: React.FC = () => {
  const [bookingConfirmation, setBookingConfirmation] = useState(true);
  const [bookingReminder, setBookingReminder] = useState(true);

  const handleUpdate = () => {
    alert("Notification settings updated successfully!");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[320px] flex flex-col">
      
      {/* Header */}
      <h2 className="text-xl font-semibold font-sans text-gray-900 mb-2">
        Notification Settings
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Configure message and SMS notification settings
      </p>

      {/* Content */}
      <div className="space-y-4 mb-6 flex-1">
        {/* Booking Confirmation */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Booking Confirmation Notification
            </h3>
            <p className="text-xs text-gray-500">Send Push Notifications</p>
          </div>
          <Toggle
            enabled={bookingConfirmation}
            onChange={setBookingConfirmation}
          />
        </div>

        {/* Booking Reminder */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Booking Reminder Notification
            </h3>
            <p className="text-xs text-gray-500">
              Notify admin of new doctor applications
            </p>
          </div>
          <Toggle
            enabled={bookingReminder}
            onChange={setBookingReminder}
          />
        </div>
      </div>

      {/* Updated Button (hover → white text) */}
      <button
        onClick={handleUpdate}
        className="w-full py-3 border-2 cursor-pointer border-blue-600 text-blue-600 rounded-lg bg-[#EFF4FF]
        hover:bg-[#155DFC] hover:text-white font-medium transition-colors"
      >
        Update Notification Settings
      </button>
    </div>
  );
};

export default Notification;
