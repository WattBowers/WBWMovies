import firebase from './firebase.js';
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);

const loginFormElement = document.querySelector('#loginForm');
const signupFormElement = document.querySelector('#signUpForm');

let frontEndData = {};
let currentUser= {}

const constructUser = (username, password) => {
  return {
    "username": username,
    "password": password,
  }
}

loginFormElement.addEventListener('submit', e => {
   
  e.preventDefault()
    const givenUsername = e.target[0].value
    const givenPassword = e.target[1].value

    //for loop going through users checking to see if username and password match a specific user
  
    Object.values(frontEndData.users).forEach((user) => {
      if(user.username === givenUsername && user.password === givenPassword) {
        currentUser = user
      }
    })
    console.log(currentUser)
})

signupFormElement.addEventListener('submit', e => {
  e.preventDefault()
  const givenUsername = e.target[0].value
  const givenPassword = e.target[1].value

  const userObject = ref(database, 'users')

  push(userObject, constructUser(givenUsername, givenPassword))
})

onValue(dbRef, (data) => {
    if(data.exists()){
      frontEndData = data.val()
    }else{
      console.log("No data available")
    }
  })

