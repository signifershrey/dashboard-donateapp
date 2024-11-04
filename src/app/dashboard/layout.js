"use client"; // This is a client component

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect non-admin users to the login page
    if (status === "loading") return; // Wait for session loading
    if (!session || session.user.role !== "admin") {
      router.push("/login"); // Redirect to login if not admin
    }
  }, [session, status, router]);

  // Optionally, show a loading state or nothing until redirection is determined
  if (status === "loading") {
    return <p>Loading...</p>; // or any loading spinner
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-64 bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
        <ul className="space-y-4 text-gray-600">
          <li>
            <a
              href="/dashboard/live-progress"
              className="block p-2 rounded-lg hover:bg-gray-200 transition"
            >
              Live Progress
            </a>
          </li>
          <li>
            <a
              href="/dashboard/donation-links"
              className="block p-2 rounded-lg hover:bg-gray-200 transition"
            >
              Donation Links
            </a>
          </li>
          <li>
            <a
              href="/dashboard/stories"
              className="block p-2 rounded-lg hover:bg-gray-200 transition"
            >
              Stories
            </a>
          </li>
        </ul>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-8 w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
