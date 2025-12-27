import SectionTitle from "@/common/SectionTitle";
import DoctorAppointmentTable from "./DoctorAppointmentTable";
import NurseAppointmentTable from "./NurseAppointmentTable";

const AllAppointment = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
        {/* Section Title */}
        <div className="w-full md:w-auto">
          <SectionTitle
            title="All Appointment Management"
            description="Monitor and manage all appointments"
          />
        </div>
      </div>

      <div>
        <DoctorAppointmentTable />
      </div>
      <div>
        <h1 className="text-3xl  font-semibold">Nurse Appointment</h1>
      </div>
      <div>
        <NurseAppointmentTable />
      </div>
    </div>
  );
};

export default AllAppointment;
