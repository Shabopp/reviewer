const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Function to create a restaurant owner account
exports.createRestaurantOwnerAccount = functions.https.onCall(async (data, context) => {
  const { email, password, restaurantId } = data;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `Restaurant Owner - ${restaurantId}`,
    });

    // Store user data in Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email,
      role: "restaurantOwner",
      restaurantId,
      isPending: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: error.message };
  }
});
