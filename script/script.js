import firebase from './firebase.js';
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);

const formElement = document.querySelector('#loginForm');

let dataTwo = {};

formElement.addEventListener('submit', e => {
    e.preventDefault()
    const givenUsername = e.target[0].value
    const givenPassword = e.target[1].value

    //for in loop going through users checking to see if username and password match a specific user
    
    //for (let i = 0; i <= Object.keys(dataTwo).length; i++) {
    //    console.log(i)
    //    
    //}

    for(let user in dataTwo.users) {
        console.log(user)
    }

})



onValue(dbRef, (data) => {
    if(data.exists()){
      dataTwo = data.val()
    }else{
      console.log("No data available")
    }
  })