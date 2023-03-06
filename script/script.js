import firebase from './firebase.js';
import constructUser from './constructUser.js';
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);

let frontEndData = {};
let currentUser = {};

const setCurrentUser = (value) => (currentUser = value)

 //forEach loop going through users checking to see if username and password match a specific user
const checkUsersList = (givenUsername, givenPassword, users) => {
  let foundUser = false;
  Object.values(users).forEach((user, i) => {
    if (user.username === givenUsername && user.password === givenPassword) {
      setCurrentUser(user);
      window.localStorage.setItem('user', JSON.stringify(currentUser));
      window.location.assign('moviesList.html');
      foundUser = true;
    }
    if (Object.values(users).length - 1 === i && foundUser === false) {
      alert('There is no account with that username and password combination')
  }
  })
}

if (window.location.pathname !== '/moviesList.html') {
  const loginFormElement = document.querySelector('#loginForm');
  const signupFormElement = document.querySelector('#signUpForm');
  

  loginFormElement.addEventListener('submit', e => {
    e.preventDefault();
    const givenUsername = e.target[0].value;
    const givenPassword = e.target[1].value;

    checkUsersList(givenUsername, givenPassword, frontEndData.users)
  })

  signupFormElement.addEventListener('submit', e => {
    e.preventDefault();
    
    const pUsernameWarningElement = document.querySelector('.sameUsernameWarning');
    const pWarningElement = document.querySelector('.passwordWarning');

    pUsernameWarningElement.classList.add('hidden');
    pWarningElement.classList.add('hidden');
    
    const givenUsername = e.target[0].value;
    const givenPassword = e.target[1].value;
    const givenConfirmPassword = e.target[2].value;
    
    e.target[0].value = '';
    e.target[1].value = '';
    e.target[2].value = '';
    let isTakenUsername = false;
    const userObject = ref(database, 'users');

  // check to see if username already exists
    
    for (let user in frontEndData.users) {
      let checkUser = frontEndData.users[user].username;
      if (givenUsername === checkUser) {
        isTakenUsername = true;
        pUsernameWarningElement.classList.remove('hidden')
        return;
      }
    }

    // Make sure that both passwords match
    if (givenPassword !== givenConfirmPassword) {
      pWarningElement.classList.remove('hidden')
      return;
    }

    //Checking to see if username is already taken, if not will create new user and push to database
    if (isTakenUsername === false) {
      push(userObject, constructUser(givenUsername, givenPassword));
      setCurrentUser(constructUser(givenUsername, givenPassword));
      window.localStorage.setItem('user', JSON.stringify(currentUser));
      window.location.assign('/moviesList.html');
    }
  })

  onValue(dbRef, (data) => {
    if (data.exists()) {
      frontEndData = data.val();
    }
  });
}

