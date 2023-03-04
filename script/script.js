import firebase from './firebase.js';
import constructUser from './constructUser.js';
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);

let frontEndData = {};
let currentUser = {};

const setCurrentUser = (value) => (currentUser = value)

if (window.location.pathname === '/index.html') {
  const loginFormElement = document.querySelector('#loginForm');
  const signupFormElement = document.querySelector('#signUpForm');
  

  loginFormElement.addEventListener('submit', e => {
    e.preventDefault();
    const givenUsername = e.target[0].value;
    const givenPassword = e.target[1].value;
    

    //for loop going through users checking to see if username and password match a specific user

    Object.values(frontEndData.users).forEach((user) => {
      if (user.username === givenUsername && user.password === givenPassword) {
        setCurrentUser(user);
        console.log(currentUser)
        window.localStorage.setItem('user', JSON.stringify(currentUser));
        window.location.assign('https://project02movietracker.netlify.app/functionality.html');
      }
    })
  })

  signupFormElement.addEventListener('submit', e => {
    e.preventDefault();
    const givenUsername = e.target[0].value;
    const givenPassword = e.target[1].value;
    const givenConfirmPassword = e.target[2].value;
    let isTakenUsername = false;
    const userObject = ref(database, 'users');

    
    // Make sure that both passwords match
    if (givenPassword !== givenConfirmPassword) {
      const pElement = document.querySelector('.passwordWarning')
      pElement.classList.remove('hidden')
      return;
    }

  // check to see if username already exists
    for (let user in frontEndData.users) {
      let checkUser = frontEndData.users[user].username;
      const pUsernameElement = document.querySelector('.sameUsernameWarning')
      if (givenUsername === checkUser) {
        isTakenUsername = true;
        pUsernameElement.classList.remove('hidden')
        break;
      }
    }
    //Checking to see if username is already taken, if not will create new user and push to database
    if (isTakenUsername === false) {
      push(userObject, constructUser(givenUsername, givenPassword));
      setCurrentUser(constructUser(givenUsername, givenPassword));
    }
  })

  onValue(dbRef, (data) => {
    if (data.exists()) {
      frontEndData = data.val();
    }
  });
}

