import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "@/services/auth";
import { Button } from "@/components/ui/button";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "teacher",
    },
  });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await registerUser(formData);
      toast.success("Account created. Please login.");
      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-emerald-200 bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Register as teacher or student
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter your name"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Create a password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("role", { required: "Role is required" })}
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          <Button
            className="w-full bg-linear-to-r from-emerald-500 to-teal-500 font-semibold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            className="font-semibold text-emerald-600 underline decoration-emerald-300 hover:text-emerald-700"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
