export const AppointmentSkeleton = () => {
  return (
    <div className="bg-white border border-[#DBE0E5] rounded-xl p-5 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-200" />
          <div>
            <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
            <div className="w-24 h-3 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-16 h-6 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Details */}
      <div className="flex mb-4 items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="w-20 h-4 bg-gray-200 rounded" />
        <div className="w-24 h-6 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};
