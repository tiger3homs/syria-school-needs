import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Need {
  id: string;
  title: string;
  description: string;
  quantity: number;
  category: string;
  priority: string;
  image_url: string | null;
  status: string;
  created_at: string | null;
  schools: {
    name: string;
    governorate: string | null;
    contact_email: string | null;
    contact_phone: string | null;
  } | null;
}

const NeedsPage = () => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [governorateFilter, setGovernorateFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [governorateOptions, setGovernorateOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const { data, error } = await supabase
          .from('needs')
          .select('*, schools(name, governorate, contact_email, contact_phone)')

        if (error) {
          console.error("Error fetching needs:", error);
          return;
        }

        setNeeds(data || []);

        // Extract governorate options
        const governorates = data
          .map((need) => need.schools?.governorate)
          .filter((governorate, index, self) => governorate && self.indexOf(governorate) === index) as string[];
        setGovernorateOptions(governorates);

         // Extract category options
         const categories = data
         .map((need) => need.category)
         .filter((category, index, self) => category && self.indexOf(category) === index) as string[];
       setCategoryOptions(categories);

      } finally {
        setIsLoading(false);
      }
    };

    fetchNeeds();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Needs</h1>

      <div className="mb-4 flex space-x-4">
        <select
          className="border rounded px-2 py-1"
          value={governorateFilter}
          onChange={(e) => setGovernorateFilter(e.target.value)}
        >
          <option value="">All Governorates</option>
          {governorateOptions.map((governorate) => (
            <option key={governorate} value={governorate}>
              {governorate}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-1"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
        </select>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={() => {
            setGovernorateFilter("");
            setCategoryFilter("");
            setStatusFilter("");
          }}
        >
          Reset Filters
        </button>
      </div>

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by title or description"
          className="border rounded px-2 py-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {needs
          .filter((need) => {
            if (governorateFilter && need.schools?.governorate !== governorateFilter) {
              return false;
            }
            if (categoryFilter && need.category !== categoryFilter) {
              return false;
            }
            if (statusFilter && need.status !== statusFilter) {
              return false;
            }
            if (searchQuery && !`${need.title} ${need.description}`.toLowerCase().includes(searchQuery.toLowerCase())) {
              return false;
            }
            return true;
          })
          .sort((a, b) => {
            if (sortBy === "newest") {
              return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
            }
            if (sortBy === "oldest") {
              return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
            }
            if (sortBy === "priority") {
              const priorityOrder = { high: 1, medium: 2, low: 3 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return 0;
          })
          .map((need) => (
            <div key={need.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {need.image_url && (
                <div className="relative">
                  <img
                    src={"https://fdusgurjkmdroacxtrtb.supabase.co/storage/v1/object/public/need-images/" + need.image_url}
                    alt={need.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{need.title}</h2>
                <p className="text-gray-600">{need.description}</p>
                <div className="mt-2">
                  <span className="font-bold">Quantity:</span> {need.quantity}
                </div>
                <div>
                  <span className="font-bold">Category:</span> {need.category}
                </div>
                <div>
                  <span className="font-bold">Priority:</span>
                  <span
                    className={`ml-1 rounded-full px-2 py-1 text-xs font-bold ${
                      need.priority === "high"
                        ? "bg-red-200 text-red-700"
                        : need.priority === "medium"
                        ? "bg-orange-200 text-orange-700"
                        : "bg-green-200 text-green-700"
                    }`}
                  >
                    {need.priority}
                  </span>
                </div>
                <div>
                  <span className="font-bold">Status:</span>
                  <span
                    className={`ml-1 rounded-full px-2 py-1 text-xs font-bold ${
                      need.status === "pending"
                        ? "bg-red-200 text-red-700"
                        : "bg-green-200 text-green-700"
                    }`}
                  >
                    {need.status}
                  </span>
                </div>
                {need.schools && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">School Info</h3>
                    <div>
                      <span className="font-bold">Name:</span> {need.schools.name}
                    </div>
                    <div>
                      <span className="font-bold">Governorate:</span> {need.schools.governorate}
                    </div>
                    {need.schools.contact_email && (
                      <div>
                        <span className="font-bold">Email:</span>
                        <a
                          href={`mailto:${need.schools.contact_email}`}
                          className="text-blue-500"
                        >
                          {need.schools.contact_email}
                        </a>
                      </div>
                    )}
                    {need.schools.contact_phone && (
                      <div>
                        <span className="font-bold">Phone:</span> {need.schools.contact_phone}
                      </div>
                    )}
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Contact School
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div >
  );
};

export default NeedsPage;
