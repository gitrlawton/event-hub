"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Zap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Github,
  Chrome,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Check,
  X,
} from "lucide-react";

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: "bg-gray-200",
  });
  const router = useRouter();

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 25;
    } else {
      feedback.push("Mix of uppercase and lowercase");
    }

    if (/\d/.test(password)) {
      score += 25;
    } else {
      feedback.push("At least one number");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 25;
    } else {
      feedback.push("At least one special character");
    }

    let color = "bg-red-500";
    if (score >= 75) color = "bg-green-500";
    else if (score >= 50) color = "bg-yellow-500";
    else if (score >= 25) color = "bg-orange-500";

    return { score, feedback, color };
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing

    // Calculate password strength for password field
    if (field === "password" && typeof value === "string") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.email.includes("@"))
      return "Please enter a valid email address";
    if (!formData.password) return "Password is required";
    if (passwordStrength.score < 50) return "Please choose a stronger password";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    if (!formData.agreeToTerms) return "You must agree to the Terms of Service";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, this would make an API call to create the account
      console.log("Signup attempt:", formData);

      // Simulate successful signup
      router.push("/profile");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Signup with ${provider}`);
    // In a real app, this would initiate OAuth flow
  };

  const navigateHome = () => {
    router.push("/");
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score >= 75) return "Strong";
    if (passwordStrength.score >= 50) return "Good";
    if (passwordStrength.score >= 25) return "Fair";
    return "Weak";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Button
          variant="ghost"
          onClick={navigateHome}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Happening
              </h1>
            </div>

            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Create your account
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                Join the community and start discovering amazing tech events
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                className="border-red-200 dark:border-red-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Social Signup Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSocialSignup("google")}
                disabled={isLoading}
              >
                <Chrome className="h-5 w-5 mr-3" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSocialSignup("github")}
                disabled={isLoading}
              >
                <Github className="h-5 w-5 mr-3" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    First name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-10 pr-10 h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Password strength:
                      </span>
                      <span
                        className={`font-medium ${
                          passwordStrength.score >= 75
                            ? "text-green-600"
                            : passwordStrength.score >= 50
                              ? "text-yellow-600"
                              : passwordStrength.score >= 25
                                ? "text-orange-600"
                                : "text-red-600"
                        }`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>

                    {passwordStrength.feedback.length > 0 && (
                      <div className="space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                          >
                            <X className="h-3 w-3 text-red-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="pl-10 pr-10 h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                      <X className="h-3 w-3" />
                      Passwords do not match
                    </div>
                  )}
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword &&
                  formData.password && (
                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                      <Check className="h-3 w-3" />
                      Passwords match
                    </div>
                  )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreeToTerms", checked as boolean)
                    }
                    disabled={isLoading}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        "subscribeNewsletter",
                        checked as boolean
                      )
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="newsletter"
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    Send me updates about new events and features
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
