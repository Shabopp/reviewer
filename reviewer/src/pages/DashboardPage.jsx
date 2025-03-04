import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  getTotalRestaurantsCount,
  getTotalRestaurantsByPlan,
  getTopRatedRestaurants,
} from "../utils/restaurantHelper"

const DashboardPage = () => {
  const [stats, setStats] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  // Fetch stats and restaurant data from Firebase
  useEffect(() => {
    const fetchStatsAndData = async () => {
      try {
        const totalRestaurants = await getTotalRestaurantsCount();
        const subscribed = await getTotalRestaurantsByPlan("subscribed");
        const free = await getTotalRestaurantsByPlan("free tier");
        const topRatedRestaurants = await getTopRatedRestaurants();

        setStats([
          { number: totalRestaurants, label: "TOTAL RESTAURANTS" },
          { number: subscribed, label: "SUBSCRIBED" },
          { number: free, label: "FREE" },
        ]);

        setRestaurants(topRatedRestaurants);
      } catch (error) {
        console.error("Error fetching data for dashboard:", error);
      }
    };

    fetchStatsAndData();
  }, []);

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-4xl font-medium">
                {stat.number}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Restaurants Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Top 5 Restaurants</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Subscription Model</TableHead>
                <TableHead>Overall Rating</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell className="font-medium">
                    <Button
                      variant="link"
                      onClick={() => navigate(`/admin/restaurant/${restaurant.id}`)}
                    >
                      {restaurant.restaurantName}
                    </Button>
                  </TableCell>
                  <TableCell>{restaurant.location}</TableCell>
                  <TableCell>{restaurant.plan}</TableCell>
                  <TableCell>{restaurant.overallRating || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate(`/admin/restaurant/${restaurant.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
