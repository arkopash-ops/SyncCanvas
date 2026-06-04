import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { userServices } from "../../../services/user.services";
import type { FeedbackState, User } from "../../../types";

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
  }, 5000);
};

const Profile = () => {
  const initialUser = userServices.getStoredUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [profileData, setProfileData] = useState({
    name: initialUser?.name ?? "",
    email: initialUser?.email ?? "",
    bio: initialUser?.bio ?? "",
  });

  const [isAvatarSubmitting, setIsAvatarSubmitting] = useState(false);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  const [avatarFeedback, setAvatarFeedback] = useState<FeedbackState>(null);
  const [profileFeedback, setProfileFeedback] = useState<FeedbackState>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasAvatar = Boolean(currentUser?.avatar);
  const avatarInitial =
    currentUser?.name?.trim().charAt(0).toUpperCase() || "U";

  const syncUser = (user: User) => {
    setCurrentUser(user);
    setProfileData({
      name: user.name,
      email: user.email,
      bio: user.bio ?? "",
    });
  };

  const handleAvatarSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const avatar = event.target.files?.[0];

    if (!avatar) {
      return;
    }

    setIsAvatarSubmitting(true);
    setAvatarFeedback(null);

    try {
      const response = await userServices.uploadAvatar({ avatar });
      setCurrentUser((user) =>
        user
          ? {
              ...user,
              avatar: response.avatar,
              avatarPublicId: response.avatarPublicId ?? null,
            }
          : user,
      );
      showTimedFeedback(setAvatarFeedback, {
        type: "success",
        message: "Profile image updated successfully.",
      });
    } catch (error) {
      showTimedFeedback(setAvatarFeedback, {
        type: "error",
        message: getErrorMessage(error, "Profile image could not be updated."),
      });
    } finally {
      setIsAvatarSubmitting(false);
      event.target.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    setIsAvatarSubmitting(true);
    setAvatarFeedback(null);

    try {
      await userServices.deleteAvatar();
      setCurrentUser((user) =>
        user ? { ...user, avatar: null, avatarPublicId: null } : user,
      );
      showTimedFeedback(setAvatarFeedback, {
        type: "success",
        message: "Profile image removed successfully.",
      });
    } catch (error) {
      showTimedFeedback(setAvatarFeedback, {
        type: "error",
        message: getErrorMessage(error, "Profile image could not be removed."),
      });
    } finally {
      setIsAvatarSubmitting(false);
    }
  };

  const handleSubmitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowConfirmModal(true);
  };

  const handleProfileSubmit = async () => {
    setIsProfileSubmitting(true);
    setProfileFeedback(null);

    try {
      const response = await userServices.updateProfile({
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        bio: profileData.bio.trim(),
      });

      syncUser(response.user);

      showTimedFeedback(setProfileFeedback, {
        type: "success",
        message: "Profile updated successfully.",
      });
    } catch (error) {
      showTimedFeedback(setProfileFeedback, {
        type: "error",
        message: getErrorMessage(error, "Profile could not be updated."),
      });
    } finally {
      setIsProfileSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmitRequest}
        className="bg-white/50 shadow-md rounded-lg border border-gray-200 p-6"
      >
        <h2 className="text-2xl font-bold text-[#24184f]">Profile</h2>
        <p className="text-sm text-gray-600 mb-6">
          How others see you on the canvas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-white/70 border border-gray-200 flex items-center justify-center overflow-hidden">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-extrabold text-[#3f28d9]">
                  {avatarInitial}
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
            />

            {hasAvatar ? (
              <div className="flex gap-2 mt-3">
                <button
                  className="px-3 py-1 text-sm bg-white/70 border border-gray-200 hover:bg-white transition"
                  type="button"
                  disabled={isAvatarSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isAvatarSubmitting ? "Saving..." : "Change"}
                </button>
                <button
                  className="px-3 py-1 text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
                  type="button"
                  disabled={isAvatarSubmitting}
                  onClick={handleDeleteAvatar}
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                className="h-12 px-6 bg-[#3f28d9] text-white font-semibold hover:bg-[#2f1fb0] transition mt-4 w-full"
                type="button"
                disabled={isAvatarSubmitting}
                onClick={() => fileInputRef.current?.click()}
              >
                {isAvatarSubmitting ? "Saving..." : "Add Image"}
              </button>
            )}
            {avatarFeedback ? (
              <p
                className={`mt-3 text-center text-xs font-medium ${
                  avatarFeedback.type === "success"
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {avatarFeedback.message}
              </p>
            ) : null}
          </div>

          {/* Form */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-[#3d3851]">
                Full Name
              </label>
              <input
                name="name"
                placeholder="John Doe"
                value={profileData.name}
                className="h-12 w-full border border-[#c7c2e3] bg-white/80 px-4 text-[#26213d] outline-none transition focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15"
                onChange={(event) =>
                  setProfileData((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-[#3d3851]">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                value={profileData.email}
                className="h-12 w-full border border-[#c7c2e3] bg-white/80 px-4 text-[#26213d] outline-none transition focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15"
                onChange={(event) =>
                  setProfileData((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase text-[#3d3851]">
                Bio
              </label>
              <textarea
                name="bio"
                rows={3}
                placeholder="Tell something about yourself..."
                value={profileData.bio}
                className="w-full border border-[#c7c2e3] bg-white/80 px-4 py-3 text-[#26213d] outline-none transition focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15 resize-none"
                onChange={(event) =>
                  setProfileData((current) => ({
                    ...current,
                    bio: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            className="h-12 px-6 bg-[#3f28d9] text-white font-semibold hover:bg-[#2f1fb0] transition"
            type="submit"
            disabled={isProfileSubmitting}
          >
            {isProfileSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {profileFeedback ? (
          <p
            className={`mt-3 text-center text-sm font-medium ${
              profileFeedback.type === "success"
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {profileFeedback.message}
          </p>
        ) : null}
      </form>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#24184f]">
              Confirm Changes
            </h3>

            <p className="mt-3 text-gray-600">
              Do you really want to save these profile changes?
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
                onClick={handleProfileSubmit}
                disabled={isProfileSubmitting}
                className="px-4 py-2 bg-[#3f28d9] text-white hover:bg-[#2f1fb0]"
              >
                {isProfileSubmitting ? "Saving..." : "Yes, Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
