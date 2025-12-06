export default function AppointmentCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border border-[#DBE0E5] rounded-lg animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-full" />

      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-300 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}
