import firebase from './firebase.js'
import { getDatabase, ref, onValue, push, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);

let frontEndData = {};
const logOutButton = document.getElementById('logOut');
const testButton = document.getElementById('test');
let currentUser = JSON.parse(window.localStorage.getItem('user'));

testButton.addEventListener('click', e => {
  console.log(frontEndData)
})

logOutButton.addEventListener('click', e => {
  window.localStorage.removeItem('user');
  window.location.assign('index.html');
})

//const moviesRef = ref(database, `/${currentUser.movies}`);
console.log(currentUser);
const moviesUl = document.querySelector('.moviesList');

const connectFrontEnd = (data) => {
  for(let user in data.users) {
    if (currentUser.username === data.users[user].username) {
      currentUser = data.users[user];
      const userRef = ref(database, 'users/' + user + '/movies');
      onValue(userRef, (data) => {
        console.log(data.val())
      })
    }
  }
}

onValue(dbRef, (data) => {
  console.log('were here')
  if (data.exists()) {
    connectFrontEnd(data.val());
    
    //connecting database to currentUser
    
  
  
    moviesUl.innerHTML = '';
    const movieList = data.val();
    console.log(currentUser)
  for (let key in currentUser.movies) {
    console.log(key)
  }

    //for (let key in movieList.users) {
    //  const title = movieList[key];
    //  console.log(movieList.users[key].movies)
    //  const runtime = movieList[key].runtime;
    //  const genre = movieList[key].genre;
    //  const year = movieList[key].year;
    //  const synopsis = movieList[key].synopsis;
//
    //  const li = document.createElement('li');
    //  const h3 = document.createElement('h3');
//
    //  h3.textContent = title;
//
    //  moviesUl.append(li);
    //  li.append(h3);
    //}
  }
})

const movieForm = document.querySelector('#movieForm');

movieForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const title = document.getElementById('movieTitle');
  const runtime = document.getElementById('runtime');
  const genre = document.getElementById('movieGenre');
  const year = document.getElementById('movieYear');
  const synopsis = document.getElementById('movieSynopsis');
})
