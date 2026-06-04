import DeleteAccount from "../../components/dashboard/settings/DeleteAccount";
import Security from "../../components/dashboard/settings/Security";
import Profile from "../../components/dashboard/settings/Profile";

const Settings = () => {
  return (
    <div className="px-6 py-4 space-y-6 bg-white/50 min-h-screen">
      <div
        className={`bg-white/50 shadow-md rounded-lg border border-gray-200 p-4`}
      >
        <h1 className="text-3xl font-extrabold text-[#24184f]">Settings</h1>
        <p className="text-[#24184f]">
          Manage your personal information and security.
        </p>
      </div>

      {/* profile */}
      <Profile />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password */}
        <Security />

        {/* delete */}
        <DeleteAccount />
      </div>
    </div>
  );
};

export default Settings;
