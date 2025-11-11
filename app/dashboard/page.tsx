"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ClientsTable from "./components/client-table";
import AddClientModal from "./components/add-client-modal";
import client from "@/supabase/supabaseConfig";

export interface Client {
  id: string;
  name: string;
  email: string;
  business_name: string;
  created_at: string;
}

const DashboardPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/");
    });
    setLoading(false);
    return () => subscription.unsubscribe();
  }, [router]);

  // fetch all clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await client
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }
      setClients(data as Client[]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await client.auth.signOut();
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-linear-to-br from-blue-50 via-white to-gray-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-gray-100">
      <header className="border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            Client Portal
          </h1>
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="flex items-center rounded-lg text-gray-700 gap-2 border border-gray-300 px-3 py-1.5  hover:bg-gray-100"
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Clients</h2>
              <p className=" text-sm">Manage your client accounts</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center rounded-lg gap-2 bg-blue-600 text-white px-4 py-2  hover:bg-blue-700"
            >
              Add Client
            </button>
          </div>

          <ClientsTable clients={clients} />
        </div>
      </main>

      <AddClientModal
        fetchClients={fetchClients}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </div>
  );
};

export default DashboardPage;
