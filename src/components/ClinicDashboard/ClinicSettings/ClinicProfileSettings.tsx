import { Dispatch, SetStateAction } from "react";

interface ClinicProfileSettingsProps {
    clinicName: string;
    setClinicName: Dispatch<SetStateAction<string>>;
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    phone: string;
    setPhone: Dispatch<SetStateAction<string>>;
    address: string;
    setAddress: Dispatch<SetStateAction<string>>;
    servicesOffered: string;
    setServicesOffered: Dispatch<SetStateAction<string>>;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
}

const ClinicProfileSettings = ({
    clinicName,
    setClinicName,
    email,
    setEmail,
    phone,
    setPhone,
    address,
    setAddress,
    servicesOffered,
    setServicesOffered,
    description,
    setDescription,
}: ClinicProfileSettingsProps) => (
    <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 mt-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Clinic Information</h2>

        {/* Clinic Picture */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Clinic Picture
            </label>
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center overflow-hidden">
                    <div className="text-white text-center">
                        <div className="text-red-500 text-2xl">❤️</div>
                        <div className="text-xs font-semibold">Wellness</div>
                    </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload New Image
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Clinic Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>

            {/* Email Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>

            {/* Phone Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>

            {/* Service Offered */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Offered <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={servicesOffered}
                    onChange={(e) => setServicesOffered(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>

            {/* Clinic Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
            </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 justify-start sm:justify-end">
            <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                Cancel
            </button>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer">
                Save Changes
            </button>
        </div>
    </div>
);

export default ClinicProfileSettings;