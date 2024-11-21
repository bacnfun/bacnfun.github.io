import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjsjyXEvxffeYr2JiFBOpbuT_fIKnCj00",
  authDomain: "mapleunion-caf3a.firebaseapp.com",
  projectId: "mapleunion-caf3a",
  storageBucket: "mapleunion-caf3a.firebasestorage.app",
  messagingSenderId: "829721512995",
  appId: "1:829721512995:web:3827a81f5633125a8bf596",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { firebaseApp, db };
