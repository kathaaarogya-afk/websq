import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Login to Your Account",
  description:
    "Login to your WebSQ account to write tech and AI guides, bookmark favourites, and connect with our community.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">
            Login to continue to WebSQ
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
