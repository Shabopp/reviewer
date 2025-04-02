import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth,firestore } from "../../services/firebase"; // Firebase configuration
import { Button } from "@/components/ui/button"; // Custom Button component
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import bcrypt from "bcryptjs";
import QRCode from "qrcode"; // QR code generation library
import { isPending } from "@reduxjs/toolkit";


const CreateProfile = () => {
  const location = useLocation();
  const [restaurantData, setRestaurantData] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [qrCodeUrl, setQRCodeUrl] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const restaurantId = queryParams.get("id");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantRef = doc(firestore, "demoRequests", restaurantId);
        const docSnap = await getDoc(restaurantRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRestaurantData(data);

          // Generate QR code for feedback link
          const feedbackUrl = `https://876b-2401-4900-7c72-c5c3-7850-f952-ac1d-abd5.ngrok-free.app/feedback/${restaurantId}`;
          const qrCode = await QRCode.toDataURL(feedbackUrl);
          setQRCodeUrl(qrCode);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  const handleGeneratePassword = () => {
    const generatedPassword = Math.random().toString(36).slice(-8);
    setPassword(generatedPassword);
  };
  const handleAddRestaurant = async (demoRequestId) => {
    if (restaurantData && password && qrCodeUrl) {
      try {
        // 1️⃣ Hash the password (Optional, as Firebase Authentication stores it securely)
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // 2️⃣ Upload QR code to Cloudinary
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "ReviewIt"); // Replace with your Cloudinary upload preset
  
        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dagusuc4s/image/upload",
          { method: "POST", body: formData }
        );
  
        const uploadData = await uploadResponse.json();
        if (!uploadData.secure_url) {
          throw new Error("Failed to upload QR code to Cloudinary");
        }
  
        const qrCodeImageUrl = uploadData.secure_url; // Get the secure URL of the uploaded image
  
        // 3️⃣ Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          restaurantData.email, // Restaurant owner's email
          password // Plain text password
        );
  
        const userId = userCredential.user.uid; // Get the Firebase Authentication UID
  
        // 4️⃣ Store restaurant details in Firestore
        const newRestaurantRef = doc(firestore, "restaurants", userId);
        await setDoc(newRestaurantRef, {
          ...restaurantData,
          authId: userId, // Store Auth UID
          role: "restaurantOwner",
          qrCodeUrl: qrCodeImageUrl,
          plan: "free tier",
          overallRating: Number(restaurantData.overallRating) || 0,
          reviewCount: restaurantData.reviewCount || 0,
          dateOfJoining: new Date(),
          id: userId, // Use Auth UID as the restaurant ID
          isPending: false, // Set isPending to false after adding the restaurant
        });
  
        // 5️⃣ Update the corresponding demo request to set isPending to false
        const demoRequestRef = doc(firestore, "demoRequests", demoRequestId);
        await updateDoc(demoRequestRef, { isPending: false });
  
        console.log("Restaurant successfully added with Authentication!");
  
      } catch (error) {
        console.error("Error adding restaurant:", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!restaurantData) {
    return <div>Restaurant data not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Restaurant Profile</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="restaurantName" className="block font-semibold">Restaurant Name</label>
          <input
            type="text"
            id="restaurantName"
            value={restaurantData.restaurantName}
            onChange={(e) => setRestaurantData({ ...restaurantData, restaurantName: e.target.value })}
            disabled={!isEditing}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold">Email</label>
          <input
            type="email"
            id="email"
            value={restaurantData.email}
            onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })}
            disabled={!isEditing}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-semibold">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={restaurantData.phone}
            onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
            disabled={!isEditing}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="location" className="block font-semibold">Location</label>
          <input
            type="text"
            id="location"
            value={restaurantData.location}
            onChange={(e) => setRestaurantData({ ...restaurantData, location: e.target.value })}
            disabled={!isEditing}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="restaurantType" className="block font-semibold">Restaurant Type</label>
          <input
            type="text"
            id="restaurantType"
            value={restaurantData.restaurantType}
            onChange={(e) => setRestaurantData({ ...restaurantData, restaurantType: e.target.value })}
            disabled={!isEditing}
            className="input-field"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="qrCode" className="block font-semibold">Feedback QR Code</label>
          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code for Feedback" />}
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <Button type="button" onClick={handleGeneratePassword}>Generate Password</Button>
          <Button type="button" onClick={() => handleAddRestaurant(restaurantId)}>Add Restaurant</Button>
          <Button type="button" onClick={handleEditToggle}>{isEditing ? "Save Changes" : "Edit Details"}</Button>
        </div>
        {password && <div className="mt-4">Generated Password: {password}</div>}
      </form>
    </div>
  );
};

export default CreateProfile;
