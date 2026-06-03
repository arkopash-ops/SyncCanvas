import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.services";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between border border-[#c7c2e3] bg-white/90 px-6 py-4 shadow-[0_18px_45px_rgba(60,45,140,0.13)] backdrop-blur-md">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#443c65]">
            SyncCanvas
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#24184f]">
            Dashboard
          </h1>
        </div>

        <button
          className="bg-[#3f28d9] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#311fb6]"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
