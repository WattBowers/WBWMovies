import firebase from './firebase.js'
import { getDatabase, ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);

const logOutButton = document.getElementById('logOut');
const moviesUl = document.querySelector('.moviesList');
const expandButtonElement = document.querySelector('#addMovie');
const formElement = document.querySelector('#movieForm')

let userRef;
let currentUser = JSON.parse(window.localStorage.getItem('user'));

if (currentUser === null) {
  window.location.assign('/index.html');
}

logOutButton.addEventListener('click', e => {
  window.localStorage.removeItem('user');
  window.location.assign('/index.html');
})
console.log(expandButtonElement)
expandButtonElement.addEventListener('click', e => {
  if(formElement.classList.length === 1) {
    formElement.classList.add('show');
  } else if (formElement.classList.length === 2) {
    formElement.classList.remove('show')
  }
})

const addMovie = (title, runtime, genre, year, synopsis, userRef) => {
  const movie = {
    title: title,
    runtime: runtime,
    genre: genre,
    year: year,
    synopsis: synopsis,
    date: Date.now()
  }
  push(userRef, movie);
}

const sortMovies = (moviesArray) => {

  let sorted = false;
  for(let i = 0; i < moviesArray.length - 1; i++) {
    if(moviesArray[i].date < moviesArray[i + 1].date) {
     
      let storage = moviesArray[i]
      moviesArray[i] = moviesArray[i + 1]
      moviesArray[i + 1] = storage;
      sorted = true;
    }
  } 
  if (sorted === true) {
    return sortMovies(moviesArray);
  } else {
    return moviesArray;
  }
}

const connectFrontEnd = (data) => {
  //connecting the local user object to the databse user object
  for (let user in data.users) {
    if (currentUser.username === data.users[user].username) {
      currentUser = data.users[user];
      //creating a reference at the specific users /movie direcotry
      userRef = ref(database, 'users/' + user + '/movies');
      //listening to changes in the /movies directory to respond to changes
      onValue(userRef, (data) => {
        moviesUl.innerHTML = '';
        const movieList = data.val();
        
  
        //sort movies so that the most recent are first in the list
        let moviesArray = sortMovies(Object.values(currentUser.movies));
        
        //looping through list of movies, and creating Elements to represent the movie
        moviesArray.forEach(movie => {
          

          let runtime;
          let genre;
          let year;
          let synopsis;

          const title = movie.title;
          
          if (movie.runtime === undefined) {
            runtime = '';
          } else {
            runtime = movie.runtime;
          }
          if (movie.genre === undefined) {
            genre = '';
          } else {
            genre = movie.genre;
          }
          if (movie.year === undefined) {
            year = '';
          } else {
            year = movie.year;
          }
          if (movie.synopsis === undefined) {
            synopsis = '';
          } else {
            synopsis = movie.synopsis;
          }
          const li = document.createElement('li');

          li.setAttribute("data-id", key);
          //setting HTML to users cant inject malicious code
          li.innerHTML = `<div class="listHeader"><h3>${title}</h3><button class="delete">-</button></div>


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

          li.firstChild.addEventListener('click', function () {
            const statContainer = this.nextElementSibling;
            statContainer.classList.toggle('expand');
          })

        }
        // Delete button - This removes an item from the list
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
          button.addEventListener('click', function (e) {
            const li = this.parentNode.parentNode;
            const nodeId = li.getAttribute('data-id');
            const nodeRef = ref(database, 'users/' + user + '/movies/' + nodeId);
            console.log(nodeRef);
          })

        })
      })
    }
  }
}

onValue(dbRef, (data) => {
  if (data.exists()) {
    //this function does the work of getting the user information, and showing the movies list
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


