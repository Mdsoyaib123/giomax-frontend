import React, { useState } from "react";

// --- Type Definitions ---
interface NotificationState {
  appointmentsEmail: boolean;
  appointmentsPush: boolean;
  paymentsEmail: boolean;
  paymentsPush: boolean;
  messagesEmail: boolean;
  messagesPush: boolean;
}

// --- Reusable Toggle Component ---
interface NotificationToggleProps {
  label: string;
  name: keyof NotificationState;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  label,
  name,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between text-sm w-full">
      <span className="text-gray-700">{label}</span>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div
          className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-0.5 
          after:bg-white after:border after:border-gray-300 after:rounded-full 
          after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"
        />
      </label>
    </div>
  );
};

// --- Main Component ---
const NotificationPreferences: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationState>({
    appointmentsEmail: false,
    appointmentsPush: true,
    paymentsEmail: false,
    paymentsPush: true,
    messagesEmail: false,
    messagesPush: true,
  });

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSave = () => {
    console.log("Saving notification preferences:", notifications);
  };

  const handleCancel = () => {
    console.log("Cancelled");
  };

  return (
    <div className="bg-white w-full mx-auto mt-5">
      <h3 className="text-xl font-semibold text-gray-700 mb-6">
        Notification Preferences
      </h3>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* --- Appointments --- */}
        <div className="border border-gray-100 p-5 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-1">Appointments</h4>
          <p className="text-sm text-gray-500 mb-4">
            New appointments and cancellations
          </p>

          <div className="flex flex-col gap-4">
            <NotificationToggle
              label="Email"
              name="appointmentsEmail"
              checked={notifications.appointmentsEmail}
              onChange={handleNotificationChange}
            />
            <NotificationToggle
              label="Push Notification"
              name="appointmentsPush"
              checked={notifications.appointmentsPush}
              onChange={handleNotificationChange}
            />
          </div>
        </div>

        {/* --- Payments --- */}
        <div className="border border-gray-100 p-5 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-1">Payments</h4>
          <p className="text-sm text-gray-500 mb-4">
            Payment received and withdrawal updates
          </p>

          <div className="flex flex-col gap-4">
            <NotificationToggle
              label="Email"
              name="paymentsEmail"
              checked={notifications.paymentsEmail}
              onChange={handleNotificationChange}
            />
            <NotificationToggle
              label="Push Notification"
              name="paymentsPush"
              checked={notifications.paymentsPush}
              onChange={handleNotificationChange}
            />
          </div>
        </div>

        {/* --- Messages --- */}
        <div className="border border-gray-100 p-5 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-1">Messages</h4>
          <p className="text-sm text-gray-500 mb-4">
            New messages from patients
          </p>

          <div className="flex flex-col gap-4">
            <NotificationToggle
              label="Email"
              name="messagesEmail"
              checked={notifications.messagesEmail}
              onChange={handleNotificationChange}
            />
            <NotificationToggle
              label="Push Notification"
              name="messagesPush"
              checked={notifications.messagesPush}
              onChange={handleNotificationChange}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-10 border-t pt-6 border-[#E5E7EB]">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-lg text-gray-700 
    hover:bg-gray-50 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg 
    hover:bg-blue-700 transition font-medium cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
