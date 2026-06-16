import { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.services";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

type AuthView = "login" | "register";

type FormStatus = {
  message: string;
  type: "success" | "error";
} | null;

const getErrorMessage = (error: unknown) => {
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

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authView: AuthView =
    location.pathname === "/register" ? "register" : "login";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);

  const handleViewChange = (view: AuthView) => {
    setStatus(null);
    navigate(view === "login" ? "/login" : "/register");
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await authService.login({ email, password });
      setStatus({ type: "success", message: "Signed in successfully." });
      navigate("/user/work-space", { replace: true });
    } catch (error) {
      setStatus({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.register({ name, email, password });
      setStatus({ type: "success", message: "Account created successfully." });
      navigate("/user/work-space", { replace: true });
    } catch (error) {
      setStatus({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10">
      <section className="w-full max-w-110 border border-[#c7c2e3] bg-white/90 px-10 py-11 shadow-[0_18px_45px_rgba(60,45,140,0.13)] backdrop-blur-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-lg font-bold font-[cursive] tracking-[0.24em] text-[#443c65]">
            SyncCanvas
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#24184f]">
            {authView === "login" ? "Sign in" : "Create account"}
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-7 grid grid-cols-2 border border-[#c7c2e3] p-1">
          <button
            className={`py-2.5 text-sm font-bold ${
              authView === "login"
                ? "bg-[#3f28d9] text-white"
                : "text-[#31284d]"
            }`}
            onClick={() => handleViewChange("login")}
            type="button"
          >
            Sign In
          </button>

          <button
            className={`py-2.5 text-sm font-bold ${
              authView === "register"
                ? "bg-[#3f28d9] text-white"
                : "text-[#31284d]"
            }`}
            onClick={() => handleViewChange("register")}
            type="button"
          >
            Register
          </button>
        </div>

        {/* Forms */}
        {authView === "login" ? (
          <Login isSubmitting={isSubmitting} onSubmit={handleLogin} />
        ) : (
          <Register isSubmitting={isSubmitting} onSubmit={handleRegister} />
        )}

        {/* Status */}
        {status && (
          <p
            className={`mt-5 text-center text-sm font-semibold ${
              status.type === "success" ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}
      </section>
    </div>
  );
};

export default Auth;
