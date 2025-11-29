import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PayoutConfig {
  schedule: string;
  minimumAmount: number;
}

const Configuration: React.FC = () => {
  const [payoutConfig, setPayoutConfig] = useState<PayoutConfig>({
    schedule: "Weekly ( Every Monday)",
    minimumAmount: 300.0,
  });

  const handleUpdatePayout = () => {
    console.log("Updating payout config:", payoutConfig);
    alert("Payout settings updated successfully!");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold font-sans text-gray-900 mb-2">
        Payout Configuration
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Configure automatic payout schedules
      </p>

      <div className="space-y-4 mb-6">
        {/* Filter */}
        <div className="w-full ">
          <Select defaultValue="weekly">
            <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-lg px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
              <SelectValue placeholder="Weekly ( Every Monday)" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
              <SelectGroup>
                <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                  Select
                </SelectLabel>
                <SelectItem
                  value="weekly"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                >
                  Weekly ( Every Monday)
                </SelectItem>
                <SelectItem
                  value="bi-weekly"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                >
                  Bi-weekly
                </SelectItem>
                <SelectItem
                  value="monthly"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                >
                  Monthly
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Payout Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={payoutConfig.minimumAmount}
            onChange={(e) =>
              setPayoutConfig({
                ...payoutConfig,
                minimumAmount: Number(e.target.value),
              })
            }
            className="w-full px-4 py-2 bg-[#F8F9FA] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="$300.00"
          />
        </div>
      </div>

      {/* Updated Button with white hover text */}
      <button
        onClick={handleUpdatePayout}
        className="w-full py-3 border-2 cursor-pointer border-blue-600 text-blue-600 rounded-lg bg-[#EFF4FF]
        hover:bg-[#155DFC] hover:text-white font-medium transition-colors"
      >
        Update Payout Settings
      </button>
    </div>
  );
};

export default Configuration;
