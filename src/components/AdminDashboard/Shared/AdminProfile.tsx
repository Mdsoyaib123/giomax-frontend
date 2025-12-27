// pages/admin/AdminProfile.tsx
import { useState, ChangeEvent, useEffect } from "react";
import {
  useGetAdminProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/features/admin/profile/adminProfileApi";
import { setAdminId } from "@/redux/features/admin/profile/adminProfileSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Loader2, User, Camera, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import ChangePasswordDialog from "./ChangePasswordDialog";
import SectionTitle from "@/common/SectionTitle";

const AdminProfile = () => {
  const { data, isLoading, error, refetch } = useGetAdminProfileQuery();
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setFullName(data.data.fullName);
      dispatch(setAdminId(data.data._id));
    }
  }, [data, dispatch]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {};

      if (fullName !== data?.data?.fullName) {
        updateData.fullName = fullName;
      }

      if (avatar) {
        updateData.avatar = avatar;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        return;
      }

      // Debug: Log the FormData before sending
      const formData = new FormData();
      if (updateData.fullName) {
        formData.append("fullName", updateData.fullName);
      }
      if (updateData.avatar) {
        // Try different field names here
        formData.append("profileImage", updateData.avatar); // Try this first
        // formData.append("image", updateData.avatar); // Or this
        // formData.append("avatar", updateData.avatar); // Or this if backend expects "avatar"
      }

      console.log("Sending FormData with fields:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      await updateMyProfile(updateData).unwrap();
      toast.success("Profile updated successfully");
      refetch();
    } catch (error: any) {
      console.error("Update failed:", error);

      // Provide more specific error messages
      if (error?.code === "LIMIT_UNEXPECTED_FILE") {
        toast.error(
          "Server rejected the file field. Please check the field name."
        );
      } else {
        toast.error(error?.data?.message || "Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFullName(data?.data?.fullName || "");
    setAvatar(null);
    setPreview(null);
    toast.info("Changes reset");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            <p>Failed to load profile</p>
            <p className="text-sm mt-2">
              {(error as any)?.data?.message || "Please try again"}
            </p>
          </div>
          <Button onClick={() => refetch()} className="mt-4" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const adminData = data?.data;

  return (
    <div className=" w-full mx-auto ">
      <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <SectionTitle
              title="Admin Profile"
              description="Manage your account settings"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setChangePasswordOpen(true)}
            className="gap-2 border border-[#AFAFAF] rounded-xl cursor-pointer"
          >
            Change Password
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <Card className="lg:col-span-1 border border-[#AFAFAF] rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Picture
              </CardTitle>
              <CardDescription>Upload a new profile image</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-40 w-40 border-4 border-background shadow-lg">
                  <AvatarImage
                    src={
                      preview ||
                      adminData?.profileImage ||
                      "/default-avatar.png"
                    }
                    alt={adminData?.fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10">
                    <User className="h-24 w-24 text-primary/50" />
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="avatar-upload"
                  className="absolute bottom-4 right-4 cursor-pointer bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                  title="Change photo"
                >
                  <Camera className="h-5 w-5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>

              <div className="text-center w-full border border-[#AFAFAF] rounded-xl">
                <h3 className="text-xl font-semibold truncate">
                  {adminData?.fullName}
                </h3>
                <p className="text-muted-foreground truncate">
                  {adminData?.email}
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {adminData?.role}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Since{" "}
                    {adminData?.createdAt
                      ? new Date(adminData.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {avatar && (
                <div className="w-full p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm font-medium">New image selected:</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {avatar.name} ({(avatar.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column - Profile Form */}
          <Card className="lg:col-span-2 border border-[#AFAFAF] rounded-xl">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="flex items-center gap-2"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-11 border border-[#AFAFAF] rounded-xl"
                    />
                    {fullName !== adminData?.fullName && (
                      <p className="text-xs text-muted-foreground">
                        ✏️ Name has been modified
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={adminData?.email || ""}
                      disabled
                      className="h-11 bg-muted border border-[#AFAFAF] rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={adminData?.role || ""}
                      disabled
                      className="h-11 bg-muted border border-[#AFAFAF] rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberSince">Member Since</Label>
                    <Input
                      id="memberSince"
                      value={
                        adminData?.createdAt
                          ? new Date(adminData.createdAt).toLocaleDateString()
                          : ""
                      }
                      disabled
                      className="h-11 bg-muted border border-[#AFAFAF] rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastUpdated">Last Updated</Label>
                  <Input
                    id="lastUpdated"
                    value={
                      adminData?.updatedAt
                        ? new Date(adminData.updatedAt).toLocaleString()
                        : ""
                    }
                    disabled
                    className="h-11 bg-muted border border-[#AFAFAF] rounded-xl"
                  />
                </div>
              </div>

              {/* {(fullName !== adminData?.fullName || avatar) && (
                <div className="p-4 bg-primary/5 border-primary/20 border border-[#AFAFAF] rounded-xl">
                  <div className="flex items-center gap-2 text-primary">
                    <RefreshCw className="h-4 w-4" />
                    <p className="font-medium">Pending changes:</p>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {fullName !== adminData?.fullName && (
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        Name: {adminData?.fullName} → {fullName}
                      </li>
                    )}
                    {avatar && (
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        Profile picture update
                      </li>
                    )}
                  </ul>
                </div>
              )} */}

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t  border-[#AFAFAF]  ">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={!fullName && !avatar}
                  className="gap-2 border border-[#AFAFAF] rounded-xl"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset Changes
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSaving || (!avatar && fullName === adminData?.fullName)
                  }
                  className="gap-2 border border-[#AFAFAF] rounded-xl bg-[#2E6FF3] text-black"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-black" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </div>
  );
};

export default AdminProfile;

// // pages/admin/AdminProfile.tsx
// import { useState, ChangeEvent, useEffect } from "react";
// import {
//   useGetAdminProfileQuery,
//   useUpdateAdminProfileMutation,
//   useUpdateMyProfileMutation,
// } from "@/redux/features/admin/profile/adminProfileApi";

// import { setAdminId } from "@/redux/features/admin/profile/adminProfileSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Label } from "@/components/ui/label";
// import { Loader2, User, Camera, Save, RefreshCw } from "lucide-react";
// import { toast } from "sonner";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import ChangePasswordDialog from "./ChangePasswordDialog";

// const AdminProfile = () => {
//   const { data, isLoading, error, refetch } = useGetAdminProfileQuery();
//   const [updateProfile] = useUpdateAdminProfileMutation();
//   const [updateMyProfile] = useUpdateMyProfileMutation();
//   const dispatch = useAppDispatch();

//   const [fullName, setFullName] = useState("");
//   const [avatar, setAvatar] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [changePasswordOpen, setChangePasswordOpen] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   // Initialize form with user data and store admin ID
//   useEffect(() => {
//     if (data?.data) {
//       setFullName(data.data.fullName);
//       // Store admin ID in Redux for other components to use
//       dispatch(setAdminId(data.data._id));
//     }
//   }, [data, dispatch]);

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please select an image file");
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size should be less than 5MB");
//         return;
//       }

//       setAvatar(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   // Method 1: Using updateProfile with explicit user ID
//   const handleSubmitWithUserId = async () => {
//     if (!data?.data?._id) {
//       toast.error("Admin ID not found");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const updateData: any = {};

//       if (fullName !== data.data.fullName) {
//         updateData.fullName = fullName;
//       }

//       if (avatar) {
//         updateData.avatar = avatar;
//       }

//       if (Object.keys(updateData).length === 0) {
//         toast.info("No changes to save");
//         return;
//       }

//       await updateProfile({
//         userId: data.data._id,
//         data: updateData,
//       }).unwrap();

//       toast.success("Profile updated successfully");
//       refetch();
//     } catch (error: any) {
//       console.error("Update failed:", error);
//       toast.error(error?.data?.message || "Failed to update profile");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Method 2: Using updateMyProfile (auto-detects admin ID)
//   const handleSubmitAuto = async () => {
//     setIsSaving(true);
//     try {
//       const updateData: any = {};

//       if (fullName !== data?.data?.fullName) {
//         updateData.fullName = fullName;
//       }

//       if (avatar) {
//         updateData.avatar = avatar;
//       }

//       if (Object.keys(updateData).length === 0) {
//         toast.info("No changes to save");
//         return;
//       }

//       await updateMyProfile(updateData).unwrap();
//       toast.success("Profile updated successfully");
//       refetch();
//     } catch (error: any) {
//       console.error("Update failed:", error);
//       toast.error(error?.data?.message || "Failed to update profile");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleReset = () => {
//     setFullName(data?.data?.fullName || "");
//     setAvatar(null);
//     setPreview(null);
//     toast.info("Changes reset");
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
//           <p className="mt-4 text-muted-foreground">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
//             <p>Failed to load profile</p>
//             <p className="text-sm mt-2">
//               {(error as any)?.data?.message || "Please try again"}
//             </p>
//           </div>
//           <Button onClick={() => refetch()} className="mt-4" variant="outline">
//             <RefreshCw className="mr-2 h-4 w-4" />
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const adminData = data?.data;

//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
//             <p className="text-muted-foreground">
//               Manage your account settings
//               {adminData?._id && (
//                 <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
//                   ID: {adminData._id.slice(-8)}...
//                 </span>
//               )}
//             </p>
//           </div>
//           <Button
//             variant="outline"
//             onClick={() => setChangePasswordOpen(true)}
//             className="gap-2"
//           >
//             Change Password
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Profile Card */}
//           <Card className="lg:col-span-1">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Profile Picture
//               </CardTitle>
//               <CardDescription>Upload a new profile image</CardDescription>
//             </CardHeader>
//             <CardContent className="flex flex-col items-center space-y-4">
//               <div className="relative">
//                 <Avatar className="h-48 w-48 border-4 border-background shadow-lg">
//                   <AvatarImage
//                     src={
//                       preview ||
//                       adminData?.profileImage ||
//                       "/default-avatar.png"
//                     }
//                     alt={adminData?.fullName}
//                     className="object-cover"
//                   />
//                   <AvatarFallback className="bg-primary/10">
//                     <User className="h-24 w-24 text-primary/50" />
//                   </AvatarFallback>
//                 </Avatar>
//                 <Label
//                   htmlFor="avatar-upload"
//                   className="absolute bottom-4 right-4 cursor-pointer bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
//                   title="Change photo"
//                 >
//                   <Camera className="h-5 w-5" />
//                   <input
//                     id="avatar-upload"
//                     type="file"
//                     accept="image/*"
//                     className="sr-only"
//                     onChange={handleImageChange}
//                   />
//                 </Label>
//               </div>

//               <div className="text-center w-full">
//                 <h3 className="text-xl font-semibold truncate">
//                   {adminData?.fullName}
//                 </h3>
//                 <p className="text-muted-foreground truncate">
//                   {adminData?.email}
//                 </p>
//                 <div className="mt-3 space-y-2">
//                   <p className="text-sm">
//                     <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full">
//                       {adminData?.role}
//                     </span>
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Since{" "}
//                     {adminData?.createdAt
//                       ? new Date(adminData.createdAt).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                 </div>
//               </div>

//               {/* Image Upload Info */}
//               {avatar && (
//                 <div className="w-full p-3 bg-primary/5 rounded-lg">
//                   <p className="text-sm font-medium">New image selected:</p>
//                   <p className="text-xs text-muted-foreground truncate">
//                     {avatar.name} ({(avatar.size / 1024).toFixed(1)} KB)
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Right Column - Profile Form */}
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle>Profile Information</CardTitle>
//               <CardDescription>
//                 Update your personal information
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Basic Information */}
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="fullName"
//                       className="flex items-center gap-2"
//                     >
//                       Full Name *
//                     </Label>
//                     <Input
//                       id="fullName"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       placeholder="Enter your full name"
//                       className="h-11"
//                     />
//                     {fullName !== adminData?.fullName && (
//                       <p className="text-xs text-muted-foreground">
//                         ✏️ Name has been modified
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email Address</Label>
//                     <Input
//                       id="email"
//                       value={adminData?.email || ""}
//                       disabled
//                       className="h-11 bg-muted"
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       Email cannot be changed
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="role">Role</Label>
//                     <Input
//                       id="role"
//                       value={adminData?.role || ""}
//                       disabled
//                       className="h-11 bg-muted"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="memberSince">Member Since</Label>
//                     <Input
//                       id="memberSince"
//                       value={
//                         adminData?.createdAt
//                           ? new Date(adminData.createdAt).toLocaleDateString()
//                           : ""
//                       }
//                       disabled
//                       className="h-11 bg-muted"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="lastUpdated">Last Updated</Label>
//                   <Input
//                     id="lastUpdated"
//                     value={
//                       adminData?.updatedAt
//                         ? new Date(adminData.updatedAt).toLocaleString()
//                         : ""
//                     }
//                     disabled
//                     className="h-11 bg-muted"
//                   />
//                 </div>
//               </div>

//               {/* Change Indicators */}
//               {(fullName !== adminData?.fullName || avatar) && (
//                 <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
//                   <div className="flex items-center gap-2 text-primary">
//                     <RefreshCw className="h-4 w-4" />
//                     <p className="font-medium">Pending changes:</p>
//                   </div>
//                   <ul className="mt-2 space-y-1 text-sm">
//                     {fullName !== adminData?.fullName && (
//                       <li className="flex items-center gap-2">
//                         <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
//                         Name: {adminData?.fullName} → {fullName}
//                       </li>
//                     )}
//                     {avatar && (
//                       <li className="flex items-center gap-2">
//                         <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
//                         Profile picture update
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={handleReset}
//                   disabled={!fullName && !avatar}
//                   className="gap-2"
//                 >
//                   <RefreshCw className="h-4 w-4" />
//                   Reset Changes
//                 </Button>

//                 {/* Use either handleSubmitWithUserId or handleSubmitAuto */}
//                 <Button
//                   onClick={handleSubmitAuto} // Or handleSubmitWithUserId
//                   disabled={
//                     isSaving || (!avatar && fullName === adminData?.fullName)
//                   }
//                   className="gap-2"
//                 >
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="h-4 w-4" />
//                       Save Changes
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Change Password Dialog */}
//       <ChangePasswordDialog
//         open={changePasswordOpen}
//         onOpenChange={setChangePasswordOpen}
//       />
//     </div>
//   );
// };

// export default AdminProfile;

// import { useState, ChangeEvent } from "react";
// import { useUpdateProfileMutation } from "@/redux/features/user/userApi";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const AdminProfile = () => {
//   const { data, isLoading } = useGetAdminQuery();
//   const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

//   const user = data?.data;

//   const [fullName, setFullName] = useState("");
//   const [avatar, setAvatar] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   if (isLoading) return <p className="p-6">Loading profile...</p>;

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAvatar(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async () => {
//     await updateProfile({
//       fullName: fullName || user!.fullName,
//       avatar: avatar || undefined,
//     }).unwrap();

//     alert("Profile updated successfully");
//   };

//   return (
//     <div>
//       <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
//         <h2 className="text-2xl font-bold mb-6">My Profile</h2>

//         {/* Avatar */}
//         <div className="flex items-center gap-4 mb-6">
//           <img
//             src={preview || user?.avatar || "/default-avatar.png"}
//             alt="Avatar"
//             className="w-24 h-24 rounded-full object-cover border"
//           />
//           <Input type="file" accept="image/*" onChange={handleImageChange} />
//         </div>

//         {/* Name */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Full Name</label>
//           <Input
//             defaultValue={user?.fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             placeholder="Enter your name"
//           />
//         </div>

//         {/* Email (readonly) */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium mb-1">Email</label>
//           <Input value={user?.email} disabled />
//         </div>

//         <Button onClick={handleSubmit} disabled={isUpdating}>
//           {isUpdating ? "Updating..." : "Save Changes"}
//         </Button>
//       </div>
//       <div>
//         <p>chnage password</p>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;
