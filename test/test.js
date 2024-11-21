// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjsjyXEvxffeYr2JiFBOpbuT_fIKnCj00",
    authDomain: "mapleunion-caf3a.firebaseapp.com",
    projectId: "mapleunion-caf3a",
    storageBucket: "mapleunion-caf3a.appspot.com",
    messagingSenderId: "829721512995",
    appId: "1:829721512995:web:3827a81f5633125a8bf596",
    measurementId: "G-0ELLZYL86C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Generate random 5-character alphanumeric code (excluding 1, l, i, 0, o)
function generateRandomCode() {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Function to sync local data to Firestore
async function syncLocalDataToFirestore(localData) {
    // Generate unique ID for the user
    const userId = generateRandomCode();

    try {
        // Check if the generated ID already exists
        const userRef = doc(firestore, "userID", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            console.warn("Generated ID already exists. Generating a new one...");
            return syncLocalDataToFirestore(localData); // Retry with a new ID
        }

        // Set the user's data in Firestore
        await setDoc(userRef, localData);
        console.log(`Data successfully synced to Firestore with ID: ${userId}`);
        return userId; // Return the generated ID
    } catch (error) {
        console.error("Error syncing data to Firestore:", error);
    }
}

// Example usage
(async () => {
    // Mock local data
    const localData = {
        cha_level: 10,
        cha_img: "img/signboard/defaultcha.png",
        cha_name: "TestCharacter",
        cha_job: "Beginner",
        signCounts: {
            mon: 5,
            tue: 3,
            wed: 7,
            thu: 0,
            fri: 2,
            sat: 6,
            sun: 1
        },
        lastSignDate: "2024-11-22"
    };

    // Call the sync function
    const generatedId = await syncLocalDataToFirestore(localData);

    if (generatedId) {
        console.log(`Your generated ID is: ${generatedId}`);
    }
})();
