import firebase from './firebase.js'
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);

let frontEndData;
const logOutButton = document.getElementById('logOut');
const currentUser = JSON.parse(window.localStorage.getItem('user'));

logOutButton.addEventListener('click', e => {
  window.localStorage.removeItem('user');
  window.location.assign('index.html');
  })

  onValue(dbRef, (data) => {
    if (data.exists()){
      frontEndData = data.val();
    }
  })