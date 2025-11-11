import { Client } from "../page";

interface Props {
  clients: Client[];
}

const ClientsCards = ({ clients }: Props) => {
  if (clients.length === 0)
    return (
      <div className=" border border-gray-200 mt-12 rounded-2xl text-center py-8 text-gray-500">
        No clients yet. Add your first client.
      </div>
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
      {clients?.map((client) => (
        <div
          key={client?.id}
          className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {client?.name}
          </h3>
          <p className="text-gray-500 mb-1">
            <span className="font-medium">Email:</span> {client?.email}
          </p>
          <p className="text-gray-500 mb-3">
            <span className="font-medium">Business:</span>{" "}
            {client?.business_name}
          </p>
          <p className="text-gray-400 text-sm">
            Added: {new Date(client?.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ClientsCards;
