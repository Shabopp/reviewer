import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import DemoRequestPage from "../pages/public/DemoRequestPage";
import ProtectedRoute from "./ProtectedRoute";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import RequestApproval from "@/pages/requestapproval";
import CreateProfile from "@/pages/public/CreateProfile";
import AddRestaurant from "@/pages/public/AddRestaurant";
import FeedbackForm from "@/pages/FeedbackForm";
import Manage from "@/pages/public/Manage";
import RestaurantDetails from "@/pages/public/RestaurantDetails";
import EditRestaurant from "@/pages/public/EditRestaurant";
import Subscriptions from "@/pages/Subscriptions";


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/demo-request" element={<DemoRequestPage />} />
      <Route path="/feedback/:restaurantId" element={<FeedbackForm />} />


      {/* Authenticated routes */}
      <Route
        element={<ProtectedRoute element={<AuthenticatedLayout />} />}
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/requestapproval" element={<RequestApproval/>}/>
        <Route path="/admin/create-profile" element={<CreateProfile/>}/>
        <Route path="/admin/addRestaurant"element={<AddRestaurant/>}/>    
        <Route path="ManageRestaurants"element={<Manage/>}/>   
        <Route path="/admin/restaurant/:id" element={<RestaurantDetails/>} />
        <Route path="/admin/edit-restaurant/:id" element={<EditRestaurant />} />{/* Route for editing restaurant */}
        <Route path="/subscriptions" element={<Subscriptions/>}/>

      </Route>
    </Routes>
  );
};

export default AppRoutes;
