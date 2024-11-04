"use client"; // Makes the component a Client Component

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is not logged in or not an admin, redirect to login
    if (status === "authenticated" && session?.user.role !== "admin") {
      router.push("/login");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <nav style={{ width: "250px", background: "#f0f0f0", padding: "20px" }}>
        <h2>Admin Dashboard</h2>
        <ul>
          <li>
            <Link href="/dashboard/live-progress">Live Progress</Link>
          </li>
          <li>
            <Link href="/dashboard/donation-links">Donation Links</Link>
          </li>
          <li>
            <Link href="/dashboard/stories">Stories</Link>
          </li>
        </ul>
        <button onClick={() => signOut()}>Logout</button>
      </nav>
      <main style={{ flexGrow: 1, padding: "20px" }}>{children}</main>
    </div>
  );
};

export default AdminLayout;
