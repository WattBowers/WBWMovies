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

//const moviesRef = ref(database, `/${currentUser.movies}`);
console.log(currentUser);
const moviesUl = document.querySelector('.moviesList');

onValue(dbRef, (data) => {
  frontEndData = data.val();
  for(let user in frontEndData.users) {
    if (currentUser.username === user.username) {
      console.log(currentUser, user)
      currentUser = user;
    }
  }
  
  if (data.exists()) {
    moviesUl.innerHTML = '';
    const movieList = data.val();
    for (let key in movieList) {
      const title = movieList[key];
      const runtime = movieList[key].runtime;
      const genre = movieList[key].genre;
      const year = movieList[key].year;
      const synopsis = movieList[key].synopsis;

      const li = document.createElement('li');
      const h3 = document.createElement('h3');

      h3.textContent = title;

      moviesUl.append(li);
      li.append(h3);
    }
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