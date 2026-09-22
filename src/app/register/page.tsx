import RegisterForm from "@/components/auth/RegisterForm";
import { Suspense } from "react";

export const metadata = {
  title: "Create Your Free Account",
  description:
    "Join WebSQ for free and start sharing your stories. Connect with a community that values real stories from real people.",
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-600 mt-2">
            Join WebSQ and start sharing your stories
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
