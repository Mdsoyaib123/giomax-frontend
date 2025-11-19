import React, { useState } from "react";

interface NotificationPreferences {
  appointmentsEmail: boolean;
  appointmentsPush: boolean;
  paymentsEmail: boolean;
  paymentsPush: boolean;
  messagesEmail: boolean;
  messagesPush: boolean;
}

const Toggle: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-5 cursor-pointer w-10 items-center rounded-full transition-colors ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

const Notification: React.FC = () => {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    appointmentsEmail: false,
    appointmentsPush: true,
    paymentsEmail: true,
    paymentsPush: true,
    messagesEmail: false,
    messagesPush: true,
  });

  const handleSave = () => {
    console.log("Saved preferences:", prefs);
    alert("Notification settings saved!");
  };

  const handleCancel = () => {
    alert("Changes canceled!");
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-xl border border-gray-100 p-6 sm:p-8">
      {/* Header */}
      <h2 className="text-xl font-semibold font-sans text-gray-900 mb-2">
        Notification Preferences
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {/* Appointments */}
        <div className="bg-gray-50 rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Appointments</h3>
          <p className="text-sm text-gray-600 mb-6">
            New appointments and cancellations
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email</span>
              <Toggle
                enabled={prefs.appointmentsEmail}
                onChange={(val) =>
                  setPrefs({ ...prefs, appointmentsEmail: val })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Push Notification</span>
              <Toggle
                enabled={prefs.appointmentsPush}
                onChange={(val) =>
                  setPrefs({ ...prefs, appointmentsPush: val })
                }
              />
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-gray-50 rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Payments</h3>
          <p className="text-sm text-gray-600 mb-6">
            Payment received and withdrawal updates
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email</span>
              <Toggle
                enabled={prefs.paymentsEmail}
                onChange={(val) => setPrefs({ ...prefs, paymentsEmail: val })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Push Notification</span>
              <Toggle
                enabled={prefs.paymentsPush}
                onChange={(val) => setPrefs({ ...prefs, paymentsPush: val })}
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-gray-50 rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Messages</h3>
          <p className="text-sm text-gray-600 mb-6">
            New messages from patients
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email</span>
              <Toggle
                enabled={prefs.messagesEmail}
                onChange={(val) => setPrefs({ ...prefs, messagesEmail: val })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Push Notification</span>
              <Toggle
                enabled={prefs.messagesPush}
                onChange={(val) => setPrefs({ ...prefs, messagesPush: val })}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4  border-gray-200">
        <button
          onClick={handleCancel}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-blue-600 border border-blue-100 hover:bg-blue-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow-md font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Notification;
