import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../services/firebase"; // Adjust the path to your Firebase setup
import { Input } from "@/components/ui/input"; // Custom Input component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Table components
import { Button } from "@/components/ui/button"; // Custom Button component
import { Search, ArrowUpDown, MoreHorizontal, X } from "lucide-react"; // Icons from lucide-react
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Dropdown components
import { Link } from "react-router-dom"; // Update to use react-router-dom's Link component

const RequestApproval = () => {
  const [demoRequests, setDemoRequests] = useState([]);  // State for storing demo requests
  const [loading, setLoading] = useState(true);  // State for loading status
  const [searchTerm, setSearchTerm] = useState("");  // State for search term

  useEffect(() => {
    const fetchDemoRequests = async () => {
      try {
        const demoRef = collection(firestore, "demoRequests");
        const q = query(demoRef, where("isPending", "==", true)); // Query to fetch only isPending: true requests
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDemoRequests(requests);
      } catch (error) {
        console.error("Error fetching demo requests:", error);
      } finally {
        setLoading(false);  // Set loading to false after data is fetched
      }
    };

    fetchDemoRequests();
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  // Function to delete a demo request
  const handleDeleteRequest = async (requestId) => {
    try {
      const requestRef = doc(firestore, "demoRequests", requestId); // Reference to the demo request
      await deleteDoc(requestRef); // Delete the document
      setDemoRequests(demoRequests.filter(request => request.id !== requestId)); // Update local state
    } catch (error) {
      console.error("Error deleting demo request:", error);
    }
  };

  // Filter demo requests based on the search term
  const filteredRequests = demoRequests.filter(
    (request) =>
      request.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;  // Show loading text if data is still being fetched
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Demo Requests</h1>
      <div className="mb-4">
        <Input
          placeholder="Search requests..."
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
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.restaurantName}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.phone}</TableCell>
                <TableCell>{request.location}</TableCell>
                <TableCell>{request.restaurantType}</TableCell>
                <TableCell>{request.isPending ? "Pending" : "Approved"}</TableCell>
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
                        <Link to={`/admin/create-profile?id=${request.id}`} className="flex items-center">
                          <X className="mr-2 h-4 w-4" /> Create Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteRequest(request.id)}>
                        <X className="mr-2 h-4 w-4" /> Reject Request
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

export default RequestApproval;
