// src/helpers/restaurantHelper.js
import { firestore } from "../services/firebase";
import { collection, getDocs, doc, getDoc, orderBy,limit,addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// Function to get all restaurants where isPending is false
export const getRestaurants = async () => {
    const restaurantsCollection = collection(firestore, 'restaurants');
    const q = query(restaurantsCollection, where("isPending", "==", false)); // Query to filter restaurants
    const restaurantSnapshot = await getDocs(q);
    const restaurantList = restaurantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return restaurantList;
};

// Function to get a single restaurant by ID
export const getRestaurantById = async (id) => {
    const restaurantDoc = doc(firestore, 'restaurants', id);
    const restaurantSnapshot = await getDoc(restaurantDoc);
    return restaurantSnapshot.exists() ? { id: restaurantSnapshot.id, ...restaurantSnapshot.data() } : null;
};

// Function to add a new restaurant
export const addRestaurant = async (restaurantData) => {
    const restaurantsCollection = collection(firestore, 'restaurants');
    const docRef = await addDoc(restaurantsCollection, restaurantData);
    return docRef.id;
};

// Function to update a restaurant
export const updateRestaurant = async (id, restaurantData) => {
    const restaurantDoc = doc(firestore, 'restaurants', id);
    await updateDoc(restaurantDoc, restaurantData);
};

// Function to delete a restaurant
export const deleteRestaurant = async (id) => {
    const restaurantDoc = doc(firestore, 'restaurants', id);
    await deleteDoc(restaurantDoc);
};

// **Fetch feedback for a specific restaurant**
export const getRestaurantFeedback = async (restaurantId) => {
    try {
      const feedbackRef = collection(firestore, "restaurants", restaurantId, "feedback");
      const snapshot = await getDocs(feedbackRef);
  
      const feedbackList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          customerName: data.customerName || "Anonymous",
          email: data.email || "N/A",
          ambiance: data.ambiance || 0,
          foodQuality: data.foodQuality || 0,
          service: data.service || 0,
          waitTime: data.waitTime || 0,
          message: data.message || "No message",
          hearAboutUs: data.hearAboutUs || "Unknown",
          createdAt: data.createdAt?.toDate().toLocaleString() || "Unknown date",
        };
      });
  
      return feedbackList;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return [];
    }
  };

//fetch OverallRatingAndCount for a restaurant
export const getOverallRatingAndCount = async (restaurantId) => {
  try {
    const restaurantRef = doc(firestore, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (restaurantSnap.exists()) {
      const data = restaurantSnap.data();
      return {
        
        overallRating: data.overallRating || 0,
        reviewCount: data.reviewCount || 0,
      };
    } else {
      console.warn("No restaurant found with ID:", restaurantId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return null;
  }
};



// **Fetch the last 5 recent feedbacks for a restaurant**
export const getRecentFeedbacks = async (restaurantId) => {
  try {
    const feedbackRef = collection(firestore, "restaurants", restaurantId, "feedback");
    const q = query(feedbackRef, orderBy("createdAt", "desc"), limit(5));
    const snapshot = await getDocs(q);

    const feedbackList = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        customerName: data.customerName || "Anonymous",
        email: data.email || "N/A",
        ambiance: data.ambiance || 0,
        foodQuality: data.foodQuality || 0,
        service: data.service || 0,
        waitTime: data.waitTime || 0,
        message: data.message || "No message",
        hearAboutUs: data.hearAboutUs || "Unknown",
        createdAt: data.createdAt?.toDate().toLocaleString() || "Unknown date",
      };
    });

    return feedbackList;
  } catch (error) {
    console.error("Error fetching recent feedbacks:", error);
    return [];
  }
};

// Function to get the total number of restaurants
export const getTotalRestaurantsCount = async () => {
  try {
    const restaurantsCollection = collection(firestore, 'restaurants');
    const q = query(restaurantsCollection, where("isPending", "==", false)); // Query to filter approved restaurants
    const restaurantSnapshot = await getDocs(q);
    return restaurantSnapshot.size; // Return the number of approved restaurants
  } catch (error) {
    console.error("Error fetching total number of restaurants:", error);
    return 0; // Return 0 in case of an error
  }
};


export const getTotalRestaurantsByPlan = async (plan) => {
  try {
    const restaurantsCollection = collection(firestore, 'restaurants');
    const q = query(
      restaurantsCollection,
      where("plan", "==", plan),
      where("isPending", "==", false) // Filter to include only approved restaurants
    );
    const restaurantSnapshot = await getDocs(q);
    return restaurantSnapshot.size; // Return the number of approved documents matching the plan
  } catch (error) {
    console.error("Error fetching total number of restaurants by plan:", error);
    return 0; // Return 0 in case of an error
  }
};


// Function to get the top 5 highest rated restaurants
export const getTopRatedRestaurants = async () => {
  try {
      const restaurantsCollection = collection(firestore, 'restaurants');
      const q = query(restaurantsCollection, orderBy("overallRating", "desc"), limit(5));
      const restaurantSnapshot = await getDocs(q);
      const topRatedRestaurants = restaurantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return topRatedRestaurants;
  } catch (error) {
      console.error("Error fetching top rated restaurants:", error);
      return []; // Return an empty array in case of an error
  }
};