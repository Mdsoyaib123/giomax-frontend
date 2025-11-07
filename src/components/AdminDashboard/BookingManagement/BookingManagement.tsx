import SectionTitle from "@/common/SectionTitle";
import BookingManagementTable from "./BookingManagementTable";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BookingManagement = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
        {/* Section Title */}
        <div className="w-full md:w-auto">
          <SectionTitle
            title="Booking Management"
            description="Monitor and manage all appointments"
          />
        </div>

        {/* Filter */}
        <div className="w-full sm:w-[250px] md:w-[220px]">
          <Select defaultValue="all">
            <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
              <SelectValue placeholder="Solo Doctor/Nurse" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
              <SelectGroup>
                <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                  Booking Type
                </SelectLabel>
                <SelectItem
                  value="all"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                >
                  Solo Doctor/Nurse
                </SelectItem>
                <SelectItem
                  value="clinic"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                >
                  Clinic
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <BookingManagementTable />
      </div>
    </div>
  );
};

export default BookingManagement;
