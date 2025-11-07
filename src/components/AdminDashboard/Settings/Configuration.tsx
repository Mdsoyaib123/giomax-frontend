import React, { useState } from 'react';

interface PayoutConfig {
  schedule: string;
  minimumAmount: number;
}

const Configuration: React.FC = () => {
  const [payoutConfig, setPayoutConfig] = useState<PayoutConfig>({
    schedule: 'Weekly ( Every Monday)',
    minimumAmount: 300.00
  });

  const handleUpdatePayout = () => {
    console.log('Updating payout config:', payoutConfig);
    alert('Payout settings updated successfully!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Payout Configuration</h2>
      <p className="text-sm text-gray-600 mb-6">Configure automatic payout schedules</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payout Schedule
          </label>
          <select
            value={payoutConfig.schedule}
            onChange={(e) => setPayoutConfig({
              ...payoutConfig,
              schedule: e.target.value
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Weekly ( Every Monday)</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Payout Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={payoutConfig.minimumAmount}
            onChange={(e) => setPayoutConfig({
              ...payoutConfig,
              minimumAmount: Number(e.target.value)
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="$300.00"
          />
        </div>
      </div>

      <button
        onClick={handleUpdatePayout}
        className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg bg-[#EFF4FF] hover:bg-blue-50 font-medium transition-colors"
      >
        Update Payout Settings
      </button>
    </div>
  );
};

export default Configuration;

