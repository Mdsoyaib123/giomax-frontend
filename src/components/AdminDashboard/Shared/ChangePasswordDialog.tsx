// components/admin/ChangePasswordDialog.tsx
import { useState } from "react";
import { useChangePasswordMutation } from "@/redux/features/admin/profile/adminProfileApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordDialog = ({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [formError, setFormError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setFormError("All fields are required");
      return false;
    }

    if (formData.newPassword.length < 6) {
      setFormError("New password must be at least 6 characters");
      return false;
    }

    if (formData.newPassword === formData.oldPassword) {
      setFormError("New password must be different from current password");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setFormError("New passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      setIsSuccess(true);
      toast.success("Password changed successfully!");

      // Reset form and close dialog after success
      setTimeout(() => {
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to change password";
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFormError("");
      setIsSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] bg-white border-none">
        <DialogHeader>
          <DialogTitle className="text-xl">Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and set a new password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="text-sm font-medium">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="oldPassword"
                name="oldPassword"
                type={showPasswords.old ? "text" : "password"}
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                required
                disabled={isLoading || isSuccess}
                className="pr-10 border border-[#AFAFAF] rounded-xl "
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("old")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPasswords.old ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password (min. 6 characters)"
                required
                disabled={isLoading || isSuccess}
                className="pr-10 border border-[#AFAFAF] rounded-xl "
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                disabled={isLoading || isSuccess}
                className="pr-10 border border-[#AFAFAF] rounded-xl "
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Password strength:</span>
                <span
                  className={
                    formData.newPassword.length >= 6
                      ? "text-green-600"
                      : "text-amber-600"
                  }
                >
                  {formData.newPassword.length >= 6 ? "Strong" : "Weak"}
                </span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    formData.newPassword.length >= 6
                      ? "w-full bg-green-500"
                      : "w-1/3 bg-amber-500"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {formError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{formError}</p>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <p className="text-sm font-medium">
                  Password changed successfully!
                </p>
              </div>
            </div>
          )}

          <div className=" flex justify-end gap-3 ">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 sm:flex-none border border-[#afafaf] rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              className="flex-1 sm:flex-none bg-[#2E6FF3] rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Success
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
