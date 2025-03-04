import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

// Check if a demo request exists for the given email
export const checkExistingDemoRequest = async (email) => {
  const demoRef = collection(firestore, "demoRequests");
  const q = query(demoRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  // Return true if a document exists
  return !querySnapshot.empty;
};

// Submit a new demo request
export const submitDemoRequest = async (data) => {
  const demoRef = collection(firestore, "demoRequests");
  return await addDoc(demoRef, data);
};
