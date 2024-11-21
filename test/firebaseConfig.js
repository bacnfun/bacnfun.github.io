// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjsjyXEvxffeYr2JiFBOpbuT_fIKnCj00",
  authDomain: "mapleunion-caf3a.firebaseapp.com",
  projectId: "mapleunion-caf3a",
  storageBucket: "mapleunion-caf3a.firebasestorage.app",
  messagingSenderId: "829721512995",
  appId: "1:829721512995:web:3827a81f5633125a8bf596",
  measurementId: "G-0ELLZYL86C"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore and Analytics
const firestore = getFirestore(firebaseApp);
const analytics = getAnalytics(firebaseApp);

// Export Firebase app and Firestore for use in other modules
export { firebaseApp, firestore };
