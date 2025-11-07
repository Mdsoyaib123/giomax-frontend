import React, { useState } from 'react';

interface NotificationPreferences {
  bookingConfirmationPush: boolean;
  newDoctorApplications: boolean;
}

const Toggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-blue-600' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const Notification: React.FC = () => {
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    bookingConfirmationPush: true,
    newDoctorApplications: true
  });

  const handleUpdateNotifications = () => {
    console.log('Updating notification settings:', notificationPrefs);
    alert('Notification settings updated successfully!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Notification Settings</h2>
      <p className="text-sm text-gray-600 mb-6">Configure message and SMS notification settings.</p>

      <div className="space-y-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Booking Confirmation Notification</p>
            <p className="text-sm text-gray-600">Send Push Notifications</p>
          </div>
          <Toggle
            enabled={notificationPrefs.bookingConfirmationPush}
            onChange={(enabled) => setNotificationPrefs({
              ...notificationPrefs,
              bookingConfirmationPush: enabled
            })}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-semibold text-gray-900">New Doctor Applications</p>
            <p className="text-sm text-gray-600">Notify admins of new doctor applications</p>
          </div>
          <Toggle
            enabled={notificationPrefs.newDoctorApplications}
            onChange={(enabled) => setNotificationPrefs({
              ...notificationPrefs,
              newDoctorApplications: enabled
            })}
          />
        </div>
      </div>

      <button
        onClick={handleUpdateNotifications}
        className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg bg-[#EFF4FF] hover:bg-blue-50 font-medium transition-colors"
      >
        Update Notifications Settings
      </button>
    </div>
  );
};

export default Notification;

