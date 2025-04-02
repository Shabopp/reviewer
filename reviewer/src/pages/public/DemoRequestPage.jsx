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
<div className="min-h-screen flex items-center justify-center bg-white p-4">
  <div className="w-full max-w-lg bg-white   p-8 transform transition-transform  duration-300">
    <h2 className="text-3xl font-extrabold  text-[#3D52A0] mb-8">
      Request a Free Demo
    </h2>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Restaurant Name */}
      <div>
        <label className="block text-sm font-medium text-[#5A6C89]">Restaurant Name</label>
        <input
          type="text"
          {...register("restaurantName", { required: true })}
          className="w-full mt-1 p-4 border border-[#B4C9E3] rounded-lg focus:ring-2 focus:ring-[#7091E6] focus:outline-none transition-all duration-200"
          placeholder="E.g., The Gourmet Spot"
        />
      </div>

      {/* Restaurant Type */}
      <div>
        <label className="block text-sm font-medium text-[#5A6C89]">Restaurant Type</label>
        <input
          type="text"
          {...register("restaurantType", { required: true })}
          className="w-full mt-1 p-4 border border-[#B4C9E3] rounded-lg focus:ring-2 focus:ring-[#7091E6] focus:outline-none transition-all duration-200"
          placeholder="E.g., Fine Dining, Café"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-[#5A6C89]">Location</label>
        <input
          type="text"
          {...register("location", { required: true })}
          className="w-full mt-1 p-4 border border-[#B4C9E3] rounded-lg focus:ring-2 focus:ring-[#7091E6] focus:outline-none transition-all duration-200"
          placeholder="City, Country"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-[#5A6C89]">Phone Number</label>
        <input
          type="text"
          {...register("phone", { required: true })}
          className="w-full mt-1 p-4 border border-[#B4C9E3] rounded-lg focus:ring-2 focus:ring-[#7091E6] focus:outline-none transition-all duration-200"
          placeholder="+1 234 567 890"
        />
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-sm font-medium text-[#5A6C89]">Email Address</label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="w-full mt-1 p-4 border border-[#B4C9E3] rounded-lg focus:ring-2 focus:ring-[#7091E6] focus:outline-none transition-all duration-200"
          placeholder="you@example.com"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-[#7091E6] text-white font-semibold rounded-lg shadow-lg hover:bg-[#3D52A0] transition-all duration-300 ease-in-out transform hover:translate-y-1"
      >
        Submit Request
      </button>
    </form>
  </div>
</div>


  );
};

export default DemoRequestPage;
