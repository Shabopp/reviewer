"use client"

import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { collection, addDoc, doc, runTransaction } from "firebase/firestore"
import { firestore } from "../services/firebase"
import { motion } from "framer-motion"
import { FaStar, FaSmile, FaUtensils, FaUser, FaComment, FaThumbsUp, FaClock, FaHeart } from "react-icons/fa"

const FeedbackForm = () => {
  const { restaurantId } = useParams()
  const [formData, setFormData] = useState({
    customerName: "",
    feedback: "",
    waitTime: 1,
    foodQuality: 1,
    service: 1,
    ambiance: 1,
    hearAboutUs: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleRatingChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleReviewRedirect = () => {
    window.open("https://www.google.com/search?q=hotel+noor&sca_esv=d03a084c8dceab01&sxsrf=AHTn8zpmKiC4BSoXU4YjICMX_8n-vQ1p5A%3A1740474784304&ei=oIm9Z7eXEtnL1e8P0POSmAg&ved=0ahUKEwi354jqvd6LAxXZZfUHHdC5BIMQ4dUDCBE&uact=5&oq=hotel+noor&gs_lp=Egxnd3Mtd2l6LXNlcnAiCmhvdGVsIG5vb3IyFxAuGIAEGJECGMcBGJgFGJkFGIoFGK8BMgsQABiABBiRAhiKBTIFEAAYgAQyERAuGIAEGMcBGJgFGJkFGK8BMgUQABiABDILEC4YgAQYxwEYrwEyERAuGIAEGMcBGJgFGJkFGK8BMhEQLhiABBjHARiYBRiZBRivATIREC4YgAQYxwEYmAUYmQUYrwEyFhAuGIAEGBQYxwEYhwIYmAUYmQUYrwEyJhAuGIAEGJECGMcBGJgFGJkFGIoFGK8BGJcFGNwEGN4EGOAE2AEBSNUcUIACWKIXcAN4AZABAJgB6wKgAe4TqgEFMi02LjO4AQPIAQD4AQGYAgqgAq0QwgIKEAAYsAMY1gQYR8ICDRAAGIAEGLADGEMYigXCAg4QABiwAxjkAhjWBNgBAcICGRAuGIAEGLADGNEDGEMYxwEYyAMYigXYAQHCAhMQLhiABBiwAxhDGMgDGIoF2AEBwgIKECMYgAQYJxiKBcICChAAGIAEGEMYigXCAgsQABiABBiSAxiKBcICCxAAGIAEGLEDGMkDwgIREC4YgAQYkQIY0QMYxwEYigXCAg4QABiABBiRAhixAxiKBcICCBAAGIAEGLEDwgIgEC4YgAQYkQIY0QMYxwEYigUYlwUY3AQY3gQY4ATYAQHCAhQQLhiABBjHARiYBRiZBRieBRivAcICCBAAGIAEGMkDwgIQEAAYgAQYsQMYFBiHAhjJA8ICCxAAGIAEGLEDGIoFwgIREC4YgAQYkQIYxwEYigUYrwHCAgsQABiABBixAxiDAZgDAIgGAZAGE7oGBggBEAEYCZIHBzMuMC40LjOgB7K7AQ&sclient=gws-wiz-serp&lqi=Cgpob3RlbCBub29ySPi1qcrUuICACFoUEAAQARgAGAEiCmhvdGVsIG5vb3KSAQVkaGFiYaoBQxABKg4iCmhvdGVsIG5vb3IoADIfEAEiG4y0sqYx329PcYMQ8XRQQyrD98LMYhjlV3KxaDIOEAIiCmhvdGVsIG5vb3I#lkt=LocalPoiReviews&lrd=0x3bc5d745a723b405:0x1e8b7b764fe782bf,3,,,,&rlimm=2200988590977548991")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const feedbackRef = collection(firestore, `restaurants/${restaurantId}/feedback`)
      const restaurantRef = doc(firestore, "restaurants", restaurantId)

      const newAverageReview = (formData.foodQuality + formData.service + formData.ambiance + formData.waitTime) / 4

      await runTransaction(firestore, async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantRef)

        if (!restaurantDoc.exists()) {
          throw new Error("Restaurant not found")
        }

        const restaurantData = restaurantDoc.data()
        const currentReviewCount = restaurantData.reviewCount || 0
        const currentAvgRating = Number(restaurantData.overallRating) || 0

        const newReviewCount = currentReviewCount + 1
        const newAvgRating = (currentAvgRating * currentReviewCount + newAverageReview) / newReviewCount

        await addDoc(feedbackRef, {
          ...formData,
          createdAt: new Date(),
          newAverageReview: Number(newAverageReview.toFixed(1)),
        })

        transaction.update(restaurantRef, {
          overallRating: Number.parseFloat(newAvgRating.toFixed(1)),
          reviewCount: newReviewCount,
        })
      })

      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Failed to submit feedback. Please try again.")
    }
  }

  if (submitted) {
    return <ThankYouScreen handleReviewRedirect={handleReviewRedirect} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">We Value Your Feedback</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            icon={<FaUser />}
            label="Your Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />

          <StarRating
            icon={<FaClock />}
            label="Wait Time"
            name="waitTime"
            rating={formData.waitTime}
            setRating={(value) => handleRatingChange("waitTime", value)}
            color="yellow"
          />

          <StarRating
            icon={<FaUtensils />}
            label="Food Quality"
            name="foodQuality"
            rating={formData.foodQuality}
            setRating={(value) => handleRatingChange("foodQuality", value)}
            color="green"
          />

          <StarRating
            icon={<FaSmile />}
            label="Service"
            name="service"
            rating={formData.service}
            setRating={(value) => handleRatingChange("service", value)}
            color="purple"
          />

          <StarRating
            icon={<FaHeart />}
            label="Ambiance"
            name="ambiance"
            rating={formData.ambiance}
            setRating={(value) => handleRatingChange("ambiance", value)}
            color="pink"
          />

          <SelectField
            icon={<FaComment />}
            label="How did you hear about us?"
            name="hearAboutUs"
            value={formData.hearAboutUs}
            onChange={handleInputChange}
            options={[
              { value: "Friend", label: "Friend" },
              { value: "Social Media", label: "Social Media" },
              { value: "Advertisement", label: "Advertisement" },
              { value: "Other", label: "Other" },
            ]}
          />

          <InputField
            icon={<FaComment />}
            label="Your Feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleInputChange}
            placeholder="Share your thoughts..."
            type="textarea"
          />

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 text-lg font-semibold"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </motion.div>
  )
}

const InputField = ({ icon, label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      {React.cloneElement(icon, { className: "mr-2 text-blue-500" })} {label}
    </label>
    {type === "textarea" ? (
      <textarea
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        rows="4"
        required
      />
    ) : (
      <input
        type={type}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
    )}
    <div className="absolute left-3 top-10 text-gray-400">{React.cloneElement(icon, { className: "text-xl" })}</div>
  </div>
)

const StarRating = ({ icon, label, name, rating, setRating, color }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      {React.cloneElement(icon, { className: `mr-2 text-${color}-500` })} {label}
    </label>
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`text-3xl ${
            star <= rating ? `text-${color}-400` : "text-gray-300"
          } hover:text-${color}-500 transition-colors transform hover:scale-110 focus:outline-none`}
        >
          ★
        </button>
      ))}
    </div>
  </div>
)

const SelectField = ({ icon, label, name, value, onChange, options }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      {React.cloneElement(icon, { className: "mr-2 text-blue-500" })} {label}
    </label>
    <select
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 appearance-none"
      name={name}
      value={value}
      onChange={onChange}
      required
    >
      <option value="" disabled>
        Select an option
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="absolute left-3 top-10 text-gray-400">{React.cloneElement(icon, { className: "text-xl" })}</div>
    <div className="absolute right-3 top-10 text-gray-400 pointer-events-none">
      <FaStar />
    </div>
  </div>
)

const ThankYouScreen = ({ handleReviewRedirect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100"
  >
    <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Thank you for your feedback!</h1>
      <p className="text-gray-600 mb-6">We truly appreciate your time and input.</p>
      <FaThumbsUp className="text-6xl text-blue-500 mx-auto animate-bounce mb-6" />
      <button
        onClick={handleReviewRedirect}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none transition-all transform hover:-translate-y-1 text-lg font-semibold"
      >
        Leave Us a Google Review
      </button>
    </div>
  </motion.div>
)

export default FeedbackForm

