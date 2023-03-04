import firebase from './firebase.js'
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);
const logOutButton = document.getElementById('logOut');
const moviesUl = document.querySelector('.moviesList');
let userRef;
let currentUser = JSON.parse(window.localStorage.getItem('user'));
if (currentUser === null) {
  window.location.assign('/index.html');
}

logOutButton.addEventListener('click', e => {
  window.localStorage.removeItem('user');
  window.location.assign('https://project02movietracker.netlify.app/index.html');
})

const addMovie = (title, runtime, genre, year, synopsis, userRef) => {
  const movie = {
    title: title,
    runtime: runtime,
    genre: genre,
    year: year,
    synopsis: synopsis,
  }
  push(userRef, movie);
}

const connectFrontEnd = (data) => {
  //connecting the local user object to the databse user object
  for (let user in data.users) {
    if (currentUser.username === data.users[user].username) {
      currentUser = data.users[user];
      //creating a reference at the specific users /movie direcotry
      userRef = ref(database, 'users/' + user + '/movies');
      //listening to changes in the /movies directory to respond to  changes
      onValue(userRef, (data) => {
        moviesUl.innerHTML = '';
        const movieList = data.val();
        //looping through list of movies, and creating Elements to represent the movie
        for (let key in currentUser.movies) {

          let title;
          let runtime;
          let genre;
          let year;
          let synopsis;

          if (movieList[key].title === undefined) {
            title = '';
          } else {
            title = movieList[key].title;
          }
          if (movieList[key].runtime === undefined) {
            runtime = '';
          } else {
            runtime = movieList[key].runtime;
          }
          if (movieList[key].genre === undefined) {
            genre = '';
          } else {
            genre = movieList[key].genre;
          }
          if (movieList[key].year === undefined) {
            year = '';
          } else {
            year = movieList[key].year;
          }
          if (movieList[key].synopsis === undefined) {
            synopsis = '';
          } else {
            synopsis = movieList[key].synopsis;
          }
          const li = document.createElement('li');
          //setting HTML to users cant inject malicious code
          li.innerHTML = `<h3 class="listHeader">${title}</h3>
          <div class="statContainer">
          <div class="stats">
          <h4>Runtime:</h4><p>${runtime}</p>
          </div>
          <div class="stats">
          <h4>Genre:</h4><p>${genre}</p>
          </div>
          <div class="stats">
          <h4>Year:</h4><p>${year}</p>
          </div>
          <div class="stats">
          <h4>Synopsis:</h4><p>${synopsis}</p>
          </div>
          </div>`

          moviesUl.append(li);

          li.firstChild.addEventListener('click', function(){
            const statContainer = this.nextElementSibling;
            statContainer.classList.toggle('expand');
          })
        }
      })
    }
  }
}

onValue(dbRef, (data) => {
  if (data.exists()) {
    //this function does the work of gettign the user information, and showing the movies list
    connectFrontEnd(data.val());
  }
})

const movieForm = document.querySelector('#movieForm');

movieForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const title = document.getElementById('movieTitle').value;
  const runtime = document.getElementById('runtime').value;
  const genre = document.getElementById('movieGenre').value;
  const year = document.getElementById('movieYear').value;
  const synopsis = document.getElementById('movieSynopsis').value;

  addMovie(title, runtime, genre, year, synopsis, userRef);
  movieForm.reset();
})

