import { useState, type FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = ({ isSubmitting, onSubmit }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const validateForm = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const nextErrors: LoginErrors = {};

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm(event.currentTarget)) {
      return;
    }

    onSubmit(event);
  };

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      {/* Email */}
      <div>
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-[0.08em] text-[#3d3851]"
          htmlFor="login-email"
        >
          Email Address
        </label>

        <input
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          autoComplete="email"
          className={`h-12 w-full border bg-white px-4 text-[#26213d] outline-none transition placeholder:text-[#777283] focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15 ${
            errors.email ? "border-red-500" : "border-[#c7c2e3]"
          }`}
          id="login-email"
          name="email"
          placeholder="name@company.com"
          type="email"
          onChange={() =>
            setErrors((current) => ({ ...current, email: undefined }))
          }
        />
        
        {errors.email ? (
          <p className="mt-2 text-xs font-semibold text-red-600" id="login-email-error">
            {errors.email}
          </p>
        ) : null}
      </div>

      {/* Password */}
      <div className="relative">
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-[0.08em] text-[#3d3851]"
          htmlFor="login-password"
        >
          Password
        </label>

        <div className="relative">
          <input
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            autoComplete="current-password"
            className={`h-12 w-full border bg-white px-4 pr-12 text-[#26213d] outline-none transition placeholder:text-[#777283] focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15 ${
              errors.password ? "border-red-500" : "border-[#c7c2e3]"
            }`}
            id="login-password"
            name="password"
            placeholder="********"
            type={showPassword ? "text" : "password"}
            onChange={() =>
              setErrors((current) => ({ ...current, password: undefined }))
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777283] hover:text-[#26213d]"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        {errors.password ? (
          <p
            className="mt-2 text-xs font-semibold text-red-600"
            id="login-password-error"
          >
            {errors.password}
          </p>
        ) : null}
      </div>

      {/* Submit */}
      <button
        className="h-15 w-full bg-[#3f28d9] text-lg font-extrabold text-white transition hover:bg-[#311fb6] disabled:cursor-not-allowed disabled:bg-[#7d71d9]"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Please wait..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-[#3d3851]">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-semibold text-[#3f28d9] hover:underline"
        >
          Register
        </a>
      </p>
    </form>
  );
};

export default Login;
