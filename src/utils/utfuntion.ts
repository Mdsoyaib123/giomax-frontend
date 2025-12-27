export const getStatusColor = (status: string) => {
    switch (status) {
        case "pending":
            return "bg-[#F9AA00] text-black";
        case "rejected":
            return "bg-[#E9575A] text-white"
        case "approved":
            return "bg-[#1B9268] text-white";
        case "completed":
            return "bg-[#1D4ED8] text-white";
        case "cancelled":
            return "bg-[#E9575A] text-white";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export const getVisitTypeColor = (type: string) => {
    return type === "Online Consultation"
        ? "text-green-600 bg-green-50"
        : "text-blue-600 bg-blue-50";
};