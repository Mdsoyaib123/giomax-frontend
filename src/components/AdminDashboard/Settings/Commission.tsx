import React, { useState } from "react";

interface CommissionRates {
  doctorCommission: number;
  clinicCommission: number;
}

interface NotificationPreferences {
  notifyDoctorsRateChanges: boolean;
  notifyClinicsRateChanges: boolean;
}

const Commission: React.FC = () => {
  const [commissionRates, setCommissionRates] = useState<CommissionRates>({
    doctorCommission: 15,
    clinicCommission: 20,
  });

  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPreferences>({
      notifyDoctorsRateChanges: true,
      notifyClinicsRateChanges: false,
    });

  const handleSaveCommission = () => {
    console.log("Saving commission rates:", commissionRates);
    alert("Commission rates saved successfully!");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold font-sans text-gray-900 mb-2">
        Platform Commission
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Configure commission rates for transactions
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doctor Commission (%)
          </label>
          <input
            type="number"
            value={commissionRates.doctorCommission}
            onChange={(e) =>
              setCommissionRates({
                ...commissionRates,
                doctorCommission: Number(e.target.value),
              })
            }
            className="w-full px-4 py-2.5  bg-[#F8F9FA] border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic Commission (%)
          </label>
          <input
            type="number"
            value={commissionRates.clinicCommission}
            onChange={(e) =>
              setCommissionRates({
                ...commissionRates,
                clinicCommission: Number(e.target.value),
              })
            }
            className="w-full px-4 py-2.5  bg-[#F8F9FA] border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="pt-4 mb-6 border-[#D1D5DC]">
        <h3 className="font-semibold text-gray-900 mb-4">
          Notification Settings
        </h3>
        <div className="flex justify-between items-center p-4    w-full  mx-auto">
          {/* Notify solo doctors */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationPrefs.notifyDoctorsRateChanges}
              onChange={(e) =>
                setNotificationPrefs({
                  ...notificationPrefs,
                  notifyDoctorsRateChanges: e.target.checked,
                })
              }
              className="w-5 h-5 accent-[#2E6FF3] cursor-pointer border-[#788087] "
            />
            <span className="text-gray-700 text-sm font-medium">
              Notify solo doctors
            </span>
          </label>

          {/* Notify clinics */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationPrefs.notifyClinicsRateChanges}
              onChange={(e) =>
                setNotificationPrefs({
                  ...notificationPrefs,
                  notifyClinicsRateChanges: e.target.checked,
                })
              }
              className="w-5 h-5 accent-[#2E6FF3] cursor-pointer border-[#788087]"
            />
            <span className="text-gray-700 text-sm font-medium">
              Notify clinics about rate changes
            </span>
          </label>
        </div>
      </div>

      <button
        onClick={handleSaveCommission}
        className="w-full py-3 border-2 cursor-pointer border-blue-600 text-blue-600 rounded-lg bg-[#EFF4FF] hover:bg-[#155DFC] hover:text-black font-medium transition-colors"
      >
        Save Commission Rates
      </button>
    </div>
  );
};

export default Commission;
