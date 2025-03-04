import React, { useEffect, useState } from "react";
import { getRestaurants, deleteRestaurant } from "../../utils/restaurantHelper"; // Import the helper functions
import { Input } from "@/components/ui/input"; // Custom Input component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Table components
import { Button } from "@/components/ui/button"; // Custom Button component
import { Search, ArrowUpDown, MoreHorizontal, X } from "lucide-react"; // Icons from lucide-react
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Dropdown components
import { Link } from "react-router-dom"; // Update to use react-router-dom's Link component
import Toast from "../../components/Toast"; // Import the custom Toast component

const Manage = () => {
  const [restaurants, setRestaurants] = useState([]);  // State for storing restaurants
  const [loading, setLoading] = useState(true);  // State for loading status
  const [searchTerm, setSearchTerm] = useState("");  // State for search term
  const [toast, setToast] = useState({ message: "", type: "" }); // State for toast notifications

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantList = await getRestaurants(); // Call the helper function
        setRestaurants(restaurantList); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);  // Set loading to false after data is fetched
      }
    };

    fetchRestaurants(); // Invoke the fetch function
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  // Filter restaurants based on the search term
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await deleteRestaurant(id); // Call the delete function from the helper
        setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id)); // Update state to remove the deleted restaurant
        setToast({ message: "Restaurant deleted successfully.", type: "success" }); // Show success toast
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        setToast({ message: "Failed to delete restaurant.", type: "error" }); // Show error toast
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;  // Show loading text if data is still being fetched
  }

  return (
    <div className="container mx-auto py-10">
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Restaurants</h1>
        <Link to="/admin/addRestaurant">
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Restaurant"}
          </Button> {/* Add Restaurant button */}
        </Link>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}  // Update search term state
          className="max-w-sm"
          icon={<Search className="mr-2 h-4 w-4" />}  // Search icon
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button variant="ghost">
                  Restaurant Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost">
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Restaurant Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRestaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell className="font-medium">
                  <Link to={`/admin/restaurant/${restaurant.id}`}>{restaurant.restaurantName}</Link>
                </TableCell>
                <TableCell>{restaurant.email}</TableCell>
                <TableCell>{restaurant.phone}</TableCell>
                <TableCell>{restaurant.location}</TableCell>
                <TableCell>{restaurant.restaurantType}</TableCell>
                <TableCell>{restaurant.isPending ? "Pending" : "Approved"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link to={`/admin/edit-restaurant/${restaurant.id}`} className="flex items-center">
                          <X className="mr-2 h-4 w-4" /> Edit Restaurant
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(restaurant.id)}>
                        <X className="mr-2 h-4 w-4" /> Delete Restaurant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Manage;
