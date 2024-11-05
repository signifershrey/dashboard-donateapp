// "use client"; // This is a client component

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function LiveProgressPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     // Redirect non-admin users to the login page
//     if (status === "loading") return; // Wait for session loading
//     if (!session || session.user.role !== "admin") {
//       router.push("/login"); // Redirect to login if not admin
//     }
//   }, [session, status, router]);

//   // Optionally, show a loading state or nothing until redirection is determined
//   if (status === "loading") {
//     return <p>Loading...</p>; // or any loading spinner
//   }

//   return (
//     <div>
//       <h1>Live Progress</h1>
//       <p>This is the live progress page, accessible only to admins.</p>
//       {/* Add your live progress content here */}
//     </div>
//   );
// }

"use client"; // This is a client component

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LiveProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [donations, setDonations] = useState({
    totalDonations: "",
    paypalDonations: "",
    zelleDonations: "",
    venmoDonations: "",
  });

  useEffect(() => {
    // Redirect non-admin users to the login page
    if (status === "loading") return; // Wait for session loading
    if (!session || session.user.role !== "admin") {
      router.push("/login"); // Redirect to login if not admin
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("/api/proxy-donations");
        if (!response.ok) throw new Error("Failed to fetch donation data");

        const data = await response.json();
        setDonations({
          totalDonations: data.totalDonations || "",
          paypalDonations: data.paypalDonations || "",
          zelleDonations: data.zelleDonations || "",
          venmoDonations: data.venmoDonations || "",
        });
      } catch (error) {
        console.error("Error fetching donation data:", error);
      }
    };

    fetchDonations();
  }, []);

  const handleChange = (field, value) => {
    setDonations((prevDonations) => ({
      ...prevDonations,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/proxy-donations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donations),
      });

      if (!response.ok) throw new Error("Failed to update donation data");
      alert("Donation data updated successfully!");
    } catch (error) {
      console.error("Error updating donation data:", error);
      alert("Failed to update donation data.");
    }
  };

  // Optionally, show a loading state or nothing until redirection is determined
  if (status === "loading") {
    return <p>Loading...</p>; // or any loading spinner
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-extrabold text-center text-[#ffbb02] mb-8">
        Update Live Donation Progress
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Total Donations Received
          </label>
          <input
            type="text"
            value={donations.totalDonations}
            onChange={(e) => handleChange("totalDonations", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffbb02] transition duration-150 bg-gray-50"
            placeholder="$2000"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            PayPal Donations
          </label>
          <input
            type="text"
            value={donations.paypalDonations}
            onChange={(e) => handleChange("paypalDonations", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffbb02] transition duration-150 bg-gray-50"
            placeholder="$2000"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Zelle Donations
          </label>
          <input
            type="text"
            value={donations.zelleDonations}
            onChange={(e) => handleChange("zelleDonations", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffbb02] transition duration-150 bg-gray-50"
            placeholder="$2000"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Venmo Donations
          </label>
          <input
            type="text"
            value={donations.venmoDonations}
            onChange={(e) => handleChange("venmoDonations", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffbb02] transition duration-150 bg-gray-50"
            placeholder="$2000"
          />
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={handleSave}
          className="inline-block px-6 py-3 text-lg font-semibold text-white bg-[#ffbb02] rounded-lg shadow-md hover:bg-yellow-600 transition duration-200 transform hover:-translate-y-1"
        >
          Save Progress
        </button>
      </div>
    </div>
  );
}
