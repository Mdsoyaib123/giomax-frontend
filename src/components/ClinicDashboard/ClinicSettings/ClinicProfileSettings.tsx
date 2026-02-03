/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetAClinicQuery,
  useUpdateClinicMutation,
} from "@/redux/features/admin/clinic/clinicBasicApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
 

const ClinicProfileSettings =  () => {
  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [description, setDescription] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = useAppSelector((state) => state.auth.user?.id);
  const { data: clinicResponse, isLoading } = useGetAClinicQuery(userId!, {
    skip: !userId,
  });
  const [updateClinic, { isLoading: isUpdating }] = useUpdateClinicMutation();
  // Extract clinic data from response
  const clinic = clinicResponse?.data;

  // Initialize form with API data when available
  useEffect(() => {
    if (clinic) {
      console.log("Clinic data loaded:", clinic);

      // Set form values from API response
      setClinicName(clinic.userId?.fullName);
      setEmail(clinic.userId?.email);
      setPhone(clinic.phoneNumber);
      setAddress(clinic.address);
      setServicesOffered(clinic.servicesOffered?.join(", "));
      setDescription(clinic.clinicDescription);

      // Set profile image
      const userProfileImage = clinic.userId?.profileImage;
      setProfileImage(userProfileImage);
      setPreviewImage(userProfileImage);
    }
  }, [
    clinic,
    setClinicName,
    setEmail,
    setPhone,
    setAddress,
    setServicesOffered,
    setDescription,
    setProfileImage,
    setPreviewImage,
  ]);

  // Handle Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match("image.*")) {
        alert("Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save with image
  const handleSave = async () => {
    try {
      // Prepare the clinic data object
      const clinicData: any = {
        fullName: clinicName,
        email: email,
        phoneNumber: phone,
        address: address,
        servicesOffered: servicesOffered,
        clinicDescription: description,
      };

      // If there's a new image file, use FormData
      if (imageFile) {
        const formData = new FormData();
        formData.append("profileImage", imageFile);

        // Append other fields to FormData
        Object.keys(clinicData).forEach((key) => {
          formData.append(key, clinicData[key]);
        });

        await updateClinic({
          id: userId!,
          data: formData,
        }).unwrap();
      } else {
        // If no new image, send as JSON
        await updateClinic({
          id: userId!,
          data: clinicData,
        }).unwrap();
      }

      toast.success("Profile saved successfully!");
      setImageFile(null); // Reset image file after save
    } catch (error) {
      console.error("Error updating clinic:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  // Handle Cancel / Reset - reset to API data or initial props
  const handleCancel = () => {
    if (clinic) {
      // Reset to original API data
      setClinicName(clinic.userId?.fullName || "");
      setEmail(clinic.userId?.email || "");
      setPhone(clinic.phoneNumber || "");
      setAddress(clinic.address || "");
      setServicesOffered(clinic.servicesOffered?.join(", ") || "");
      setDescription(clinic.clinicDescription || "");
      setProfileImage(clinic.userId?.profileImage || "");
      setPreviewImage(clinic.userId?.profileImage || "");
    } else {
      // Reset to empty values
      setClinicName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setServicesOffered("");
      setDescription("");
      setProfileImage("");
      setPreviewImage("");
    }

    setImageFile(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Remove/Delete image
  const handleRemoveImage = () => {
    setProfileImage("");
    setPreviewImage("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl mt-5 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading clinic data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl mt-5 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Clinic Information
      </h2>

      {/* Clinic Picture */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Clinic Picture
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Image Preview */}
          <div className="relative">
            {previewImage ? (
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={previewImage}
                    alt="Clinic Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 cursor-pointer"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center overflow-hidden">
                <div className="text-white text-center">
                  <div className="text-2xl">🏥</div>
                  <div className="text-xs font-semibold mt-1">Add Photo</div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 cursor-pointer w-fit"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              {previewImage ? "Change Image" : "Upload Image"}
            </button>

            <div className="text-xs text-gray-500">
              {previewImage ? (
                <span>Click "Change Image" to upload a different photo</span>
              ) : (
                <span>JPEG, PNG or GIF (Max 5MB)</span>
              )}
            </div>

            {/* Image Preview Modal Trigger */}
            {previewImage && (
              <button
                type="button"
                onClick={() => window.open(previewImage, "_blank")}
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer text-left w-fit"
              >
                View Full Image
              </button>
            )}
          </div>
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
            placeholder="Enter clinic name"
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
            placeholder="clinic@example.com"
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
            placeholder="+1 (123) 456-7890"
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
            placeholder="123 Medical Street, City, State, ZIP"
          />
        </div>

        {/* Services Offered */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Services Offered <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={servicesOffered}
            onChange={(e) => setServicesOffered(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="General Medicine, Pediatrics, Emergency Care, etc."
          />
          {clinic?.servicesOffered && (
            <p className="text-xs text-gray-500 mt-1">
              Currently: {clinic.servicesOffered.join(", ")}
            </p>
          )}
        </div>

        {/* Clinic Description */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Describe your clinic, mission, and specializations..."
          />
        </div>
      </div>

      {/* Current Image Info */}
      {profileImage && !imageFile && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            Current profile image is saved. Upload a new image to change it.
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 justify-start sm:justify-end">
        <button
          onClick={handleCancel}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!clinicName || !email || !phone || !address || isUpdating}
          className={`px-6 py-2.5 rounded-lg transition font-medium cursor-pointer ${
            !clinicName || !email || !phone || !address
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isUpdating ? "Updating..." : " Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ClinicProfileSettings;
