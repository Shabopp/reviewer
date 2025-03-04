PHASE 1: Project Initialization

Goal: Set up the development environment and foundational tools.
Tasks:
Initialize the Project:
Use create-react-app for the frontend.
Install TailwindCSS and configure it with the project.
    Initialize Firebase for backend services.
    Set Up Firebase:
    Create a new Firebase project.
    Enable Firestore for database storage.
    Enable Firebase Authentication for user sign-in and roles (admin, restaurant owner, users).
    Setup File Structure:
    Organize folders for clean development:

src/
├── components/        # Reusable UI components
├── pages/             # Major screens (Login, Dashboard, etc.)
├── services/          # Firebase API logic
├── styles/            # Tailwind configuration
├── utils/             # Helper functions
└── App.jsx            # Main React entry point





PHASE 2: Authentication
Goal: Enable user roles and secure access.
Tasks:
Develop Login & Signup Pages:
Create forms for:
Admin login.
Restaurant owner registration.
Use Firebase Authentication (email/password).
Role-Based Access:
Use Firestore to assign roles (admin, restaurantOwner).
Implement role-based route protection (e.g., admin-only pages).
Forgot Password:
Add Firebase’s password reset functionality.
Deliverables:
Login, Signup, and Forgot Password pages.
Authentication integrated with Firebase.




PHASE 2.5: State managament

1. Auth Slice
Purpose: Manage authentication and user roles.

Store logged-in user details (e.g., uid, email, role).
Enable role-based access control for components and routes.
Persist session state across refreshes using localStorage or sessionStorage.
State Structure:
{
  user: null, // { uid, email, role }
  isAuthenticated: false,
}
Actions:

setUser: Save user data upon login or signup.
logout: Clear user data and end the session.
2. Restaurants Slice
Purpose: Manage restaurant data for both admins and restaurant owners.

Store restaurant details for CRUD operations.
Enable filtering and sorting of restaurant data.
Cache restaurant data for better performance.
State Structure:

javascript
Copy
Edit
{
  restaurants: [], // Array of restaurant objects
  selectedRestaurant: null, // For edit operations
  filters: { search: '', plan: 'all' }, // Filters for search and subscription plans
}
Actions:

setRestaurants: Load restaurant data from Firestore.
addRestaurant: Add a new restaurant.
updateRestaurant: Modify restaurant details.
setFilters: Apply search or filtering criteria.
3. Feedback Slice
Purpose: Manage feedback submissions and visibility rules.

Fetch and display feedback for restaurants.
Differentiate between public and private feedback.
State Structure:

javascript
Copy
Edit
{
  feedback: [], // Array of feedback objects
  filters: { visibility: 'public', rating: 'all' }, // Filters for feedback
}
Actions:

setFeedback: Load feedback from Firestore.
addFeedback: Submit new feedback.
setFilters: Apply filters for visibility (e.g., public/private).
4. Notifications Slice
Purpose: Handle global notifications and alerts.

Display success or error messages after specific actions.
Allow easy dismissal of alerts.
State Structure:

javascript
Copy
Edit
{
  message: '', // Alert message
  type: '', // success, error, or info
  visible: false, // Controls visibility of the notification
}
Actions:

setNotification: Set message and type for a new alert.
clearNotification: Reset the state to hide notifications.
5. Loading Slice
Purpose: Manage global loading states for API calls.

Prevent multiple submissions or actions when loading.
Show spinners or loading indicators across the app.
State Structure:

javascript
Copy
Edit
{
  isLoading: false, // True when an API call is in progress
}
Actions:

setLoading: Enable or disable loading.
6. Form Slice
Purpose: Manage multi-step form data (e.g., restaurant registration or subscription upgrades).

Save form data across steps.
Reset data when the form is submitted or canceled.
State Structure:

javascript
Copy
Edit
{
  step: 1, // Current step in the form
  data: {}, // Collected form data
}
Actions:

nextStep: Move to the next step in the form.
prevStep: Return to the previous step.
setFormData: Update form data for the current step.
resetForm: Clear the form state.
7. Filters Slice
Purpose: Manage filters for lists (restaurants, feedback, etc.).

Centralize filter logic for multiple components.
Support search and dropdown-based filtering.
State Structure:

javascript
Copy
Edit
{
  search: '', // Search query
  filterBy: 'all', // Active filter option (e.g., "free", "premium")
}
Actions:

setSearch: Update the search query.
setFilter: Apply a new filter.


phase 2.75 time and date standardization

1. Use ISO 8601 Format
Why? ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) is widely supported and easily parsed by both JavaScript (via Date or libraries like date-fns and moment) and backend systems like Firestore and Stripe.
Example: "2025-01-26T10:00:00.000Z" (UTC timezone).
2. Use UTC Time Everywhere
Why? UTC avoids issues with time zones and daylight saving time. It ensures consistency regardless of where your users or servers are located.
Convert all times to UTC when storing in Firestore, Stripe, or your app state.
3. Use a Time Management Library
To simplify time handling, use a well-maintained library:

Recommended Libraries:
date-fns: Lightweight and modular, great for modern React projects.
luxon: Powerful and time-zone aware.
Native JavaScript Date (if your needs are minimal).
4. Standardize Time in Firestore
Firestore timestamps are stored in UTC by default. Use Firestore's Timestamp type for all time-related fields.

Example:

javascript
Copy
Edit
import firebase from 'firebase/app';

// Add timestamp
await firestore.collection('users').add({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
});

// Read and convert timestamp to ISO
const snapshot = await firestore.collection('users').get();
snapshot.docs.forEach(doc => {
  const data = doc.data();
  const createdAt = data.createdAt.toDate().toISOString(); // Convert Firestore Timestamp to ISO string
});
5. Standardize Time in Stripe
Stripe uses Unix timestamps (seconds since epoch). Convert Stripe times to ISO or UTC before using them in your app.

Example:

javascript
Copy
Edit
const stripeTimestamp = 1674895200; // Unix time from Stripe
const isoTime = new Date(stripeTimestamp * 1000).toISOString(); // Convert to ISO
6. Standardize Time in React
When using React, ensure consistent handling:

Use date-fns or luxon to format and manipulate dates.
Parse and display times consistently, preferably in the user's local timezone (if needed).
Example (with date-fns):

javascript
Copy
Edit
import { format } from 'date-fns';

// Format ISO string to user-friendly format
const formattedDate = format(new Date("2025-01-26T10:00:00.000Z"), 'PPpp');
7. Global Timezone Configuration
If your project requires multiple timezones:

Use Luxon for explicit timezone handling.
Set the app's default timezone and format times based on user preferences.
Example (with Luxon):

javascript
Copy
Edit
import { DateTime } from 'luxon';

// Convert UTC to user's local timezone
const localTime = DateTime.fromISO("2025-01-26T10:00:00.000Z", { zone: 'utc' })
  .setZone('America/New_York')
  .toLocaleString(DateTime.DATETIME_MED);
8. Store All Times in UTC
Ensure that all times stored in your database are in UTC. This avoids discrepancies when querying or comparing timestamps.

Firestore Example:

javascript
Copy
Edit
createdAt: firebase.firestore.FieldValue.serverTimestamp() // Firestore stores it in UTC
9. Time Conversion Cheat Sheet
Source	Format	Conversion to ISO/UTC
Firestore Timestamp	serverTimestamp()	timestamp.toDate().toISOString()
Stripe Timestamp	Unix (seconds since epoch)	new Date(timestamp * 1000).toISOString()
React (JS Date Object)	Date	new Date(date).toISOString() or use date-fns / luxon
10. Example Workflow
Let's tie it together with a workflow example:

Firestore → React → Stripe
Create a Timestamp in Firestore:

javascript
Copy
Edit
await firestore.collection('events').add({
  eventTime: firebase.firestore.FieldValue.serverTimestamp(),
});
Read and Format Timestamp in React:

javascript
Copy
Edit
const eventTime = doc.data().eventTime.toDate(); // Firestore Timestamp → JS Date
const formattedTime = format(eventTime, 'PPpp'); // Using date-fns for user-friendly display
Send Time to Stripe:

javascript
Copy
Edit
const stripeTimestamp = Math.floor(eventTime.getTime() / 1000); // Convert JS Date to Unix
stripe.paymentIntents.create({
  amount: 1000,
  currency: 'usd',
  description: 'Subscription Payment',
  metadata: { eventTime: stripeTimestamp },
});
Stripe → React:

javascript
Copy
Edit
const stripeEventTime = new Date(stripeTimestamp * 1000).toISOString(); // Convert Unix to ISO
11. Developer Best Practices
Consistency: Always store, retrieve, and process time in UTC.
Documentation: Document the standard time format (ISO/UTC) in your project README for your team.
Testing: Test edge cases for time zones, daylight saving time, and formatting.
12. Example Helper Utilities
Create a utility file for time conversions:

javascript
Copy
Edit
// utils/time.js
import { format } from 'date-fns';

export const toISO = (date) => new Date(date).toISOString();

export const formatDate = (date, formatString = 'PPpp') =>
  format(new Date(date), formatString);

export const unixToISO = (unix) => new Date(unix * 1000).toISOString();
By following this approach, you'll have a unified, consistent time-handling strategy, avoiding the challenges you faced previously. Let me know if you'd like help implementing any specific part!



PHASE 3: Admin Panel
Goal: Allow the admin to manage restaurants, subscriptions, and generate QR codes.
Tasks:
Dashboard Overview:
Display total restaurants, total reviews, and subscription data (e.g., free vs. subscribed).
Include charts for revenue and subscriber percentages.
Restaurant Management:
Add a table listing all restaurants with:
Name, Location, Subscription Plan, Payment Due Date.
Actions: Add, Edit, Delete.
QR Code and Link Generation:
Add a form to generate QR codes and links for restaurants.
Save QR code details (e.g., image, restaurant ID) in Firestore.
Subscription Management:
Allow the admin to update a restaurant's subscription plan.
Deliverables:
Admin dashboard with restaurant management.
Functional QR code generator.
Subscription management interface.




PHASE 4: Restaurant Management (For Owners)
Goal: Allow restaurant owners to manage their feedback and subscription.
Tasks:
Dashboard Overview:
Display total reviews, average star rating, and last 5 reviews.
Include a toggle to switch between public and private feedback.
Feedback Management:
Fetch feedback from Firestore.
Show:
Public feedback (ratings > 5).
Private dashboard feedback (ratings < 3).
Allow marking private feedback as resolved.
Subscription Page:
Display current plan and expiry date.
Allow upgrading or renewing the subscription.
Deliverables:
Restaurant owner dashboard with feedback visibility.
Functional subscription management.





PHASE 5: Feedback System
Goal: Allow users to submit and view feedback.
Tasks:
Feedback Submission:
Add a feedback form with:
Rating (1-10), Feedback Text, and Restaurant ID.
Save feedback in Firestore with visibility rules:
Public: Ratings > 5.
Private: Ratings < 3.
Public Feedback Display:
Display public feedback on the restaurant's page.
Paginate feedback for scalability.
Private Feedback Dashboard:
Private feedback should only be visible to restaurant owners and admins.
Deliverables:
Feedback submission form.
Feedback display based on visibility rules.





PHASE 6: Subscription Model Integration
Goal: Monetize the platform by restricting access to premium features.
Tasks:
Design Subscription Plans:
Free: View public feedback.
Premium: View all feedback (including private).
Integrate Payment Gateway:
Use Stripe or Razorpay for payment processing.
Save payment details and subscription status in Firestore.
Access Control:
Use Firestore rules to restrict access to private feedback for non-subscribers.
Subscription Renewal Notifications:
Send email notifications for expiring subscriptions using Firebase Cloud Functions.
Deliverables:
Subscription plans with access control.
Payment processing system.





PHASE 7: Hosting and Deployment
Goal: Host the project and deliver it to the client.
Tasks:
Deploy Frontend:
Use Firebase Hosting for the React app.
Build and deploy:
bash
Copy
Edit
npm run build
firebase deploy
Set Up Firestore Rules:
Secure the database with role-based access:
json
Copy
Edit
{
  "rules": {
    "restaurants": {
      ".read": "auth != null && request.auth.token.role == 'admin'",
      ".write": "auth != null && request.auth.token.role == 'admin'"
    },
    "feedback": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
Transfer Ownership:
Add the client as an admin in Firebase.
Provide documentation for managing the platform.
Deliverables:
Fully hosted app on Firebase.
Database with security rules.
Client documentation.




PHASE 8: Testing and Final Delivery
Goal: Ensure a bug-free and client-approved product.
Tasks:
Manual Testing:
Test all workflows: login, feedback submission, QR code generation, subscription payment.
Cross-Device Testing:
Use BrowserStack or real devices to test on different browsers and screen sizes.
Client Review:
Share the live link with the client for feedback.
Final Revisions:
Address any issues or requests from the client.
Deliverables:
Final version of the app.
Handover documentation.
