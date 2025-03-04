"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Star, MapPin, Phone, Mail, CreditCard, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getRestaurantFeedback,
  getRestaurantById,
  getOverallRatingAndCount,
  getRecentFeedbacks,
} from "../../utils/restaurantHelper"

const RatingStars = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-200"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function RestaurantDetails() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [detailedView, setDetailedView] = useState(false)
  const [overallRating, setOverallRating] = useState(null)
  const [reviewCount, setReviewCount] = useState(0)
  const [recentReviews, setRecentReviews] = useState([])

  useEffect(() => {
    async function fetchData() {
      const restaurantData = await getRestaurantById(id)
      const feedbackData = await getRestaurantFeedback(id)
      const { overallRating, reviewCount } = await getOverallRatingAndCount(id)
      setRestaurant(restaurantData)
      setFeedbacks(feedbackData)
      setOverallRating(overallRating)
      setReviewCount(reviewCount)
    }
    fetchData()
  }, [id])

  // Fetch recent reviews based on current time
  const fetchRecentReviews = async () => {
    const recentReviews = await getRecentFeedbacks(id)
    setRecentReviews(recentReviews)
  }

  useEffect(() => {
    fetchRecentReviews()
  }, [id])

  if (!restaurant) return <div className="p-4">Loading...</div>

  if (detailedView) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">{restaurant.restaurantName} - Feedback</h1>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Feedback</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Ambiance</TableHead>
                  <TableHead>Food Quality</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>
                      <RatingStars rating={item.ambiance} />
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={item.foodQuality} />
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={item.service} />
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={item.waitTime} />
                    </TableCell>
                    <TableCell>{item.message}</TableCell>
                    <TableCell>{item.hearAboutUs}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setDetailedView(false)}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">{restaurant.restaurantName} - Feedback</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Improved Restaurant Details Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Restaurant Details</h2>
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              {/* Left Info */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                  <span>{restaurant.location}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-gray-500" />
                  <span>{restaurant.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-gray-500" />
                  <span>{restaurant.email}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-gray-500" />
                  <span>
                    {new Date(restaurant.dateOfJoining).toLocaleDateString() || "Invalid Date"}
                  </span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
                  <span>Subscription: </span>
                  <Badge variant="secondary" className="ml-2">
                    {restaurant.plan}
                  </Badge>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 shadow-lg">
                <span className="text-lg font-medium text-gray-700 mb-2">QR Code</span>
                {restaurant.qrCodeUrl && (
                  <img
                    src={restaurant.qrCodeUrl}
                    alt="QR Code"
                    className="w-40 h-40 rounded-lg shadow-lg border border-gray-200"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ratings & Reviews Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Ratings & Reviews</h2>
            <p className="text-gray-500 mb-4">
              Based on{" "}
              <span className="font-bold text-black scale-150 text-lg size-10 ">
                {reviewCount}
              </span>{" "}
              reviews
            </p>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl font-bold mb-8">{overallRating}</span>
              <RatingStars rating={overallRating} />
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setDetailedView(true)}
            >
              <MessageCircle className="h-4 w-4" />
              View Detailed Feedback
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReviews.slice(0, 5).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.customerName}</TableCell>
                  <TableCell>
                    <RatingStars rating={item.foodQuality} />
                  </TableCell>
                  <TableCell>{item.message}</TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
