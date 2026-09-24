import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Suspense } from "react";

export const metadata = {
  title: "Forgot Password | WebSQ",
  description: "Reset your WebSQ password",
  alternates: {
    canonical: "/forgot-password",
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Forgot Password
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your email to receive a reset link
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
