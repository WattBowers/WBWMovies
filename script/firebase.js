// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmvHbrpqtoj6PylQGS2yf3LCh7aYyw_lo",
  authDomain: "junoproject2.firebaseapp.com",
  databaseURL: "https://junoproject2-default-rtdb.firebaseio.com",
  projectId: "junoproject2",
  storageBucket: "junoproject2.appspot.com",
  messagingSenderId: "867496677129",
  appId: "1:867496677129:web:7e0912e07986b0d6e00dd8"
};


// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;