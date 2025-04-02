import { useState } from "react"
import { doc,setDoc, collection, addDoc } from "firebase/firestore"
import { auth,firestore } from "../../services/firebase" // Adjust the import path as needed
import QRCode from "qrcode"
import bcrypt from "bcryptjs"
import axios from "axios"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, RefreshCw } from "lucide-react"
import Toast from "../../components/Toast" // Import the custom Toast component
import { useNavigate } from "react-router-dom" // Import useNavigate

const AddRestaurant = () => {
  const [restaurantData, setRestaurantData] = useState({
    restaurantName: "",
    email: "",
    phone: "",
    location: "",
    restaurantType: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [qrCodeUrl, setQRCodeUrl] = useState("")
  const [toast, setToast] = useState(null)
  const navigate = useNavigate() // Initialize useNavigate

  const handleGeneratePassword = () => {
    const generatedPassword = Math.random().toString(36).slice(-8)
    setRestaurantData({ ...restaurantData, password: generatedPassword })
  }

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // 🔹 1️⃣ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        restaurantData.email, // Restaurant owner's email
        restaurantData.password // Plain text password
      );
  
      const userId = userCredential.user.uid; // ✅ Get Firebase Authentication UID
  
      // 🔹 2️⃣ Generate feedback URL and QR code
      const feedbackUrl = `https://yourdomain.com/feedback/${userId}`;
      const qrCode = await QRCode.toDataURL(feedbackUrl);
      setQRCodeUrl(qrCode);
  
      // 🔹 3️⃣ Upload QR Code to Cloudinary
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "ReviewIt"); // Replace with your Cloudinary preset
  
      const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dagusuc4s/image/upload", {
        method: "POST",
        body: formData,
      });
  
      const uploadData = await uploadResponse.json();
      const uploadedQRCodeUrl = uploadData.secure_url;
  
      // 🔹 4️⃣ Store restaurant details in Firestore (Using Auth UID as ID)
      const newRestaurantRef = doc(firestore, "restaurants", userId);
      await setDoc(newRestaurantRef, {
        ...restaurantData,
        authId: userId, // ✅ Store Auth UID for authentication reference
        role: "restaurantOwner",
        qrCodeUrl: uploadedQRCodeUrl,
        plan: "free tier",
        overallRating: 0,
        reviewCount: 0,
        dateOfJoining: new Date(),
        isPending: false,
      });
  
      // 🔹 5️⃣ Send email with login credentials
      try {
        await axios.post("http://localhost:5000/send-email", {
          to: restaurantData.email,
          subject: "Your Restaurant Login Credentials",
          text: `Welcome to our platform!\n\nYour login credentials:\nEmail: ${restaurantData.email}\nPassword: ${restaurantData.password}\n\nPlease change your password after logging in.`,
        });
        console.log("Email request sent to backend successfully.");
      } catch (error) {
        console.error("Failed to send email:", error.response?.data || error.message);
      }
  
      // 🔹 6️⃣ Reset form fields
      setRestaurantData({
        restaurantName: "",
        email: "",
        phone: "",
        location: "",
        restaurantType: "",
        password: "",
      });
      setQRCodeUrl("");
  
      // 🔹 7️⃣ Redirect user to dashboard
      setTimeout(() => {
        navigate("/dashboard"); // Change this to your actual dashboard route
      }, 3000);
  
      setToast({
        message: "Restaurant added successfully!",
        type: "success",
      });
  
    } catch (error) {
      console.error("Error adding restaurant:", error);
      setToast({
        message: "Failed to add restaurant. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Restaurant</CardTitle>
          <CardDescription>Enter the details of the new restaurant to add it to the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddRestaurant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                value={restaurantData.restaurantName}
                onChange={(e) => setRestaurantData({ ...restaurantData, restaurantName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={restaurantData.email}
                onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                value={restaurantData.phone}
                onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={restaurantData.location}
                onChange={(e) => setRestaurantData({ ...restaurantData, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantType">Restaurant Type</Label>
              <Select
                onValueChange={(value) => setRestaurantData({ ...restaurantData, restaurantType: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select restaurant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast-food">Fast Food</SelectItem>
                  <SelectItem value="fine-dining">Fine Dining</SelectItem>
                  <SelectItem value="casual">Casual Dining</SelectItem>
                  <SelectItem value="cafe">Café</SelectItem>
                  <SelectItem value="buffet">Buffet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  id="password"
                  value={restaurantData.password}
                  onChange={(e) => setRestaurantData({ ...restaurantData, password: e.target.value })}
                  required
                />
                <Button type="button" variant="outline" onClick={handleGeneratePassword}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setRestaurantData({
                restaurantName: "",
                email: "",
                phone: "",
                location: "",
                restaurantType: "",
                password: "",
              })
            }
          >
            Reset
          </Button>
          <Button type="submit" onClick={handleAddRestaurant} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Restaurant"
            )}
          </Button>
        </CardFooter>
      </Card>

      {qrCodeUrl && (
        <Card className="mt-6 w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Feedback QR Code</CardTitle>
            <CardDescription>Scan this QR code to access the feedback page for this restaurant.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
          </CardContent>
        </Card>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AddRestaurant

