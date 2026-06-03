import { useState, type FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = ({ isSubmitting, onSubmit }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const validateForm = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const nextErrors: RegisterErrors = {};

    if (!name) {
      nextErrors.name = "Full name is required.";
    } else if (name.length < 2) {
      nextErrors.name = "Full name must be at least 2 characters.";
    }

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

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      {/* Full Name */}
      <div>
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-[0.08em] text-[#3d3851]"
          htmlFor="register-name"
        >
          Full Name
        </label>

        <input
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "register-name-error" : undefined}
          autoComplete="name"
          className={`h-12 w-full border bg-white px-4 text-[#26213d] outline-none transition placeholder:text-[#777283] focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15 ${
            errors.name ? "border-red-500" : "border-[#c7c2e3]"
          }`}
          id="register-name"
          name="name"
          placeholder="Your full name"
          type="text"
          onChange={() =>
            setErrors((current) => ({ ...current, name: undefined }))
          }
        />
        {errors.name ? (
          <p
            className="mt-2 text-xs font-semibold text-red-600"
            id="register-name-error"
          >
            {errors.name}
          </p>
        ) : null}
      </div>

      {/* Email */}
      <div>
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-[0.08em] text-[#3d3851]"
          htmlFor="register-email"
        >
          Email Address
        </label>

        <input
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          autoComplete="email"
          className={`h-12 w-full border bg-white px-4 text-[#26213d] outline-none transition placeholder:text-[#777283] focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15 ${
            errors.email ? "border-red-500" : "border-[#c7c2e3]"
          }`}
          id="register-email"
          name="email"
          placeholder="name@company.com"
          type="email"
          onChange={() =>
            setErrors((current) => ({ ...current, email: undefined }))
          }
        />
        {errors.email ? (
          <p
            className="mt-2 text-xs font-semibold text-red-600"
            id="register-email-error"
          >
            {errors.email}
          </p>
        ) : null}
      </div>

      {/* Password */}
      <div className="relative">
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-[0.08em] text-[#3d3851]"
          htmlFor="register-password"
        >
          Password
        </label>

        <div className="relative">
          <input
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "register-password-error" : undefined
            }
            autoComplete="new-password"
            className={`h-12 w-full border bg-white px-4 pr-12 text-[#26213d] outline-none transition placeholder:text-[#777283] focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15 ${
              errors.password ? "border-red-500" : "border-[#c7c2e3]"
            }`}
            type={showPassword ? "text" : "password"}
            id="register-password"
            name="password"
            placeholder="********"
            onChange={() =>
              setErrors((current) => ({ ...current, password: undefined }))
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777283] hover:text-[#26213d]"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        {errors.password ? (
          <p
            className="mt-2 text-xs font-semibold text-red-600"
            id="register-password-error"
          >
            {errors.password}
          </p>
        ) : null}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-[0.08em] text-[#3d3851]"
          htmlFor="register-confirm-password"
        >
          Confirm Password
        </label>

        <div className="relative">
          <input
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword
                ? "register-confirm-password-error"
                : undefined
            }
            autoComplete="new-password"
            className={`h-12 w-full border bg-white px-4 pr-12 text-[#26213d] outline-none transition placeholder:text-[#777283] focus:border-[#3f28d9] focus:ring-2 focus:ring-[#3f28d9]/15 ${
              errors.confirmPassword ? "border-red-500" : "border-[#c7c2e3]"
            }`}
            id="register-confirm-password"
            name="confirmPassword"
            placeholder="********"
            type={showConfirmPassword ? "text" : "password"}
            onChange={() =>
              setErrors((current) => ({
                ...current,
                confirmPassword: undefined,
              }))
            }
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777283] hover:text-[#26213d]"
          >
            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        {errors.confirmPassword ? (
          <p
            className="mt-2 text-xs font-semibold text-red-600"
            id="register-confirm-password-error"
          >
            {errors.confirmPassword}
          </p>
        ) : null}
      </div>

      {/* Submit */}
      <button
        className="h-15 w-full bg-[#3f28d9] text-lg font-extrabold text-white transition hover:bg-[#311fb6] disabled:cursor-not-allowed disabled:bg-[#7d71d9]"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Please wait..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-[#3d3851]">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-[#3f28d9] hover:underline"
        >
          Login
        </a>
      </p>
    </form>
  );
};

export default Register;
