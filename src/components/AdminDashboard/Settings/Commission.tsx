import React, { useState } from 'react';

interface CommissionRates {
  doctorCommission: number;
  clinicCommission: number;
}

interface NotificationPreferences {
  notifyDoctorsRateChanges: boolean;
  notifyClinicsRateChanges: boolean;
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

const Commission: React.FC = () => {
  const [commissionRates, setCommissionRates] = useState<CommissionRates>({
    doctorCommission: 15,
    clinicCommission: 20
  });

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    notifyDoctorsRateChanges: true,
    notifyClinicsRateChanges: false
  });

  const handleSaveCommission = () => {
    console.log('Saving commission rates:', commissionRates);
    alert('Commission rates saved successfully!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Platform Commission</h2>
      <p className="text-sm text-gray-600 mb-6">Configure commission rates for transactions</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doctor Commission (%)
          </label>
          <input
            type="number"
            value={commissionRates.doctorCommission}
            onChange={(e) => setCommissionRates({
              ...commissionRates,
              doctorCommission: Number(e.target.value)
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic Commission (%)
          </label>
          <input
            type="number"
            value={commissionRates.clinicCommission}
            onChange={(e) => setCommissionRates({
              ...commissionRates,
              clinicCommission: Number(e.target.value)
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="border-t pt-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-700">Notify solo doctors about rate changes</span>
            <Toggle
              enabled={notificationPrefs.notifyDoctorsRateChanges}
              onChange={(enabled) => setNotificationPrefs({
                ...notificationPrefs,
                notifyDoctorsRateChanges: enabled
              })}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-700">Notify clinics about rate changes</span>
            <Toggle
              enabled={notificationPrefs.notifyClinicsRateChanges}
              onChange={(enabled) => setNotificationPrefs({
                ...notificationPrefs,
                notifyClinicsRateChanges: enabled
              })}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSaveCommission}
        className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg bg-[#EFF4FF] hover:bg-blue-50 font-medium transition-colors"
      >
        Save Commission Rates
      </button>
    </div>
  );
};

export default Commission;


