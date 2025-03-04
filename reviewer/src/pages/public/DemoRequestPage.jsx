import React from "react";
import { useForm } from "react-hook-form";
import { submitDemoRequest, checkExistingDemoRequest } from "../../services/restaurantService";
import { useNotification } from "../../context/NotificationContext";

const DemoRequestPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const { showNotification } = useNotification();

  const onSubmit = async (data) => {
    try {
      const exists = await checkExistingDemoRequest(data.email);
      if (exists) {
        showNotification("A demo request with this email already exists.", "error");
        return;
      }

      const requestData = {
        ...data,
        isPending: true,
      };

      await submitDemoRequest(requestData);
      showNotification("Demo request submitted successfully!", "success");
      reset();
    } catch (error) {
      console.error("Error submitting demo request:", error);
      showNotification("Failed to submit demo request. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
          🚀 Request a Free Demo
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
            <input
              type="text"
              {...register("restaurantName", { required: true })}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="E.g., The Gourmet Spot"
            />
          </div>

          {/* Restaurant Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Restaurant Type</label>
            <input
              type="text"
              {...register("restaurantType", { required: true })}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="E.g., Fine Dining, Café"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              {...register("location", { required: true })}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="City, Country"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              {...register("phone", { required: true })}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="+1 234 567 890"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-transform transform hover:-translate-y-1"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default DemoRequestPage;
