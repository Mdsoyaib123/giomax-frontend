import React from "react";

interface TableRowSkeletonProps {
  columns?: number;
  columnWidths?: string[];
  rows?: number;
}

const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({
  columns = 6,
  columnWidths,
  rows = 1,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
              <div
                className={`h-4 bg-gray-300 rounded ${
                  columnWidths?.[colIndex] || "w-full"
                }`}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableRowSkeleton;
