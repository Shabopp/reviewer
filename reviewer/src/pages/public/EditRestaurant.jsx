"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getRestaurantById, updateRestaurant } from "../../utils/restaurantHelper"
import { Loader2 } from "lucide-react"
import Toast from "../../components/Toast" // Import the custom Toast component

const EditRestaurant = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: "", type: "" }) // State for toast notifications

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(id)
        setRestaurant(data)
      } catch (error) {
        console.error("Error fetching restaurant details:", error)
        setToast({ message: "Failed to fetch restaurant details.", type: "error" })
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setRestaurant((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateRestaurant(id, restaurant)
      setToast({ message: "Restaurant details updated successfully.", type: "success" })
       // Delay navigation so the user sees the toast
    } catch (error) {
      console.error("Error updating restaurant:", error)
      setToast({ message: "Failed to update restaurant.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Restaurant not found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Edit Restaurant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="restaurantName" className="block font-medium">Restaurant Name</label>
            <input
              id="restaurantName"
              name="restaurantName"
              value={restaurant.restaurantName}
              onChange={handleChange}
              placeholder="Restaurant Name"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={restaurant.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-medium">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={restaurant.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="location" className="block font-medium">Location</label>
            <input
              id="location"
              name="location"
              value={restaurant.location}
              onChange={handleChange}
              placeholder="Location"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="restaurantType" className="block font-medium">Restaurant Type</label>
            <input
              id="restaurantType"
              name="restaurantType"
              value={restaurant.restaurantType}
              onChange={handleChange}
              placeholder="Restaurant Type"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditRestaurant
