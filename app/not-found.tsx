"use client";
import Link from "next/link";
import { BsFileEarmarkX } from "react-icons/bs";

export default function NotFoundPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md shadow-xl border-0 bg-white rounded-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <BsFileEarmarkX className="text-5xl text-gray-400" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page not found
        </h2>

        <p className="text-gray-500 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
