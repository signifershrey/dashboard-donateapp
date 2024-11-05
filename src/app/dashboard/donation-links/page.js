"use client"; // This is a client component

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

export default function DonationLinksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [paymentLinks, setPaymentLinks] = useState({
    paypal: "",
    gofundme: "",
    venmo: "",
    sosusa: "",
    inash: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchPaymentLinks = async () => {
      try {
        const response = await fetch("/api/proxy-paymentlinks");
        if (!response.ok) throw new Error("Failed to fetch payment links");

        const data = await response.json();
        setPaymentLinks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentLinks();
  }, []);

  const handleChange = (field, value) => {
    setPaymentLinks((prevLinks) => ({
      ...prevLinks,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("/api/proxy-paymentlinks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentLinks),
      });
      if (!response.ok) throw new Error("Failed to update payment links");
      alert("Payment links updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update payment links.");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <p className="text-center text-lg font-semibold text-gray-700">
        Loading...
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center text-[#ffbb02] mb-4">
        Edit Payment Links
      </h1>
      <p className="text-center text-gray-600 text-lg mb-8">
        Manage and update payment links for donations across different
        platforms.
      </p>
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr>
            <th className="py-3 px-5 text-left text-lg font-semibold text-gray-700 border-b border-gray-300">
              Payment Method
            </th>
            <th className="py-3 px-5 text-left text-lg font-semibold text-gray-700 border-b border-gray-300">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(paymentLinks).map(([key, value]) => (
            <tr key={key} className="hover:bg-gray-100">
              <td className="py-4 px-5 text-gray-800 font-medium capitalize border-b border-gray-200">
                {key}
              </td>
              <td className="py-4 px-5 border-b border-gray-200">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={`Enter ${key} link`}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffbb02] transition duration-150"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center">
        <button
          onClick={handleUpdate}
          className="px-8 py-3 text-lg font-semibold text-white bg-[#ffbb02] rounded-full shadow-lg hover:bg-yellow-600 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Update Links
        </button>
      </div>
    </div>
  );
}
