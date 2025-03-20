"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HandHeart, Mail, Lock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthFormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Show toast for validation errors
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join(", ");
      toast.error(errorMessages);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    toast.loading(isLogin ? "Logging in..." : "Creating your account...");

    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        toast.error("Server response was not in the expected format");
        return;
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          if (data.errors) {
            // Validation errors from backend
            const errorMessages = data.errors
              .map((err: any) => err.msg)
              .join(", ");
            toast.error(errorMessages);
          } else {
            toast.error(data.message || "Validation failed");
          }
        } else if (response.status === 401) {
          toast.error("Invalid credentials");
        } else if (response.status === 409) {
          toast.error("Email already exists");
        } else {
          toast.error(data.message || "Authentication failed");
        }
        return;
      }

      if (!data.data || !data.data.token) {
        toast.error("Invalid response from server");
        return;
      }

      // Store token and user data
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      toast.success(
        isLogin
          ? "Welcome back! 👋"
          : "Welcome to HandsOn! Please check your email to verify your account."
      );

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <HandHeart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">HandsOn</h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Make a Difference in Your Community
          </h2>
          <p className="text-muted-foreground">
            Join thousands of volunteers creating positive change. Connect,
            contribute, and track your social impact journey with HandsOn.
          </p>
        </motion.div>

        {/* Right side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-2xl shadow-lg p-8"
        >
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 p-3 rounded-lg transition-all",
                isLogin
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 p-3 rounded-lg transition-all",
                !isLogin
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-lg border bg-background",
                      errors.name && "border-red-500"
                    )}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-lg border bg-background",
                    errors.email && "border-red-500"
                  )}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-lg border bg-background",
                    errors.password && "border-red-500"
                  )}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Processing..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>

            {isLogin && (
              <p className="text-center text-sm text-muted-foreground">
                <a href="#" className="text-primary hover:underline">
                  Forgot your password?
                </a>
              </p>
            )}
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
