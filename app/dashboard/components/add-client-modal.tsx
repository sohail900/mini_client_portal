"use client";

import { useState } from "react";
import { toast } from "sonner";
import client from "@/supabase/supabaseConfig";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  fetchClients: () => Promise<void>;
}

const AddClientModal = ({ isOpen, setIsOpen, fetchClients }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business_name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // stored data in supabase
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send email");

      const { error } = await client.from("clients").insert([
        {
          business_name: formData.business_name,
          created_at: new Date().toISOString(),
          email: formData.email,
          name: formData.name,
        },
      ]);

      if (error) {
        throw error;
      }
      toast.success(
        `Successfully addeed clients && sent email to ${formData.email}`,
      );
      setFormData({ name: "", email: "", business_name: "" });
      setIsOpen(false);
      await fetchClients();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-20">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        <h3 className="text-xl font-semibold mb-2 text-gray-700">
          Add New Client
        </h3>
        <p className="text-gray-500 mb-4">Enter Client Details</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              value={formData.business_name}
              onChange={(e) =>
                setFormData({ ...formData, business_name: e.target.value })
              }
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Client"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
