import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { FeedbackState } from "../../../types";
import { userServices } from "../../../services/user.services";

type SecurityErrors = {
  currentPassword?: string;
  newPassword?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};

const showTimedFeedback = (
  setter: React.Dispatch<React.SetStateAction<FeedbackState>>,
  value: FeedbackState,
) => {
  setter(value);

  setTimeout(() => {
    setter(null);
  }, 2500);
};

const Security = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState<SecurityErrors>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const [passwordFeedback, setPasswordFeedback] = useState<FeedbackState>(null);

  const validateSecurityForm = () => {
    const nextErrors: SecurityErrors = {};

    if (!securityData.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required.";
    }

    if (!securityData.newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (securityData.newPassword.length < 8) {
      nextErrors.newPassword = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateSecurityForm()) return;

    setShowConfirmModal(true);
  };

  const handlePasswordChange = async () => {
    setIsPasswordSubmitting(true);
    setPasswordFeedback(null);

    try {
      await userServices.updatePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });

      setSecurityData({
        currentPassword: "",
        newPassword: "",
      });

      setErrors({});

      showTimedFeedback(setPasswordFeedback, {
        type: "success",
        message: "Password changed successfully.",
      });
    } catch (error) {
      showTimedFeedback(setPasswordFeedback, {
        type: "error",
        message: getErrorMessage(error, "Password could not be changed."),
      });
    } finally {
      setIsPasswordSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmitRequest}
        className="bg-white/50 shadow-md rounded-lg border border-gray-200 p-6"
      >
        <h2 className="text-2xl font-bold text-[#24184f]">Security</h2>

        <p className="text-sm text-gray-600 mb-6">
          Regularly change the password
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Password */}
          <div>
            <label className="text-xs font-semibold uppercase text-[#3d3851]">
              Current Password
            </label>

            <div className="relative">
              <input
                name="currentPassword"
                value={securityData.currentPassword}
                type={showCurrentPassword ? "text" : "password"}
                className={`h-12 w-full border border-[#c7c2e3] bg-white/80 px-4 text-[#26213d] outline-none transition focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15 pr-12 ${
                  errors.currentPassword ? "border-red-500" : ""
                }`}
                onChange={(event) => {
                  setSecurityData((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }));

                  setErrors((current) => ({
                    ...current,
                    currentPassword: undefined,
                  }));
                }}
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777283]"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.currentPassword && (
              <p className="text-xs text-red-600 mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="text-xs font-semibold uppercase text-[#3d3851]">
              New Password
            </label>

            <div className="relative">
              <input
                name="newPassword"
                value={securityData.newPassword}
                type={showNewPassword ? "text" : "password"}
                className={`h-12 w-full border border-[#c7c2e3] bg-white/80 px-4 text-[#26213d] outline-none transition focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15 pr-12 ${
                  errors.newPassword ? "border-red-500" : ""
                }`}
                onChange={(event) => {
                  setSecurityData((current) => ({
                    ...current,
                    newPassword: event.target.value,
                  }));

                  setErrors((current) => ({
                    ...current,
                    newPassword: undefined,
                  }));
                }}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777283]"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.newPassword}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={isPasswordSubmitting}
            className="h-12 px-6 bg-[#3f28d9] text-white font-semibold hover:bg-[#2f1fb0] transition"
          >
            {isPasswordSubmitting ? "Changing..." : "Change Password"}
          </button>
        </div>

        {passwordFeedback && (
          <p
            className={`mt-3 text-center text-sm font-medium ${
              passwordFeedback.type === "success"
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {passwordFeedback.message}
          </p>
        )}
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#24184f]">
              Confirm Password Change
            </h3>

            <p className="mt-3 text-gray-600">
              Do you really want to change your password?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={isPasswordSubmitting}
                className="px-4 py-2 bg-[#3f28d9] text-white hover:bg-[#2f1fb0]"
              >
                {isPasswordSubmitting ? "Changing..." : "Yes, Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Security;
