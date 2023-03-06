import firebase from './firebase.js'
import { getDatabase, ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);

const logOutButton = document.getElementById('logOut');
const moviesUl = document.querySelector('.moviesList');
const expandButtonElement = document.querySelector('#addMovie');
const formElement = document.querySelector('#movieForm')
const movieTitleElement = document.querySelector('#userMovieTitle')

let userRef;
let currentUser = JSON.parse(window.localStorage.getItem('user'));

if (currentUser === null) {
  window.location.assign('/index.html');
}

movieTitleElement.textContent = `${currentUser.username}'s Movie List`

logOutButton.addEventListener('click', e => {
  window.localStorage.removeItem('user');
  window.location.assign('/index.html');
})

expandButtonElement.addEventListener('click', e => {
  if(formElement.classList.length === 1) {
    formElement.classList.add('show');
    e.target.innerHTML = 'ADD MOVIE ⬆'
  } else if (formElement.classList.length === 2) {
    formElement.classList.remove('show');
    e.target.innerHTML = 'ADD MOVIE ⬇'
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

//this function returns the unique id for the movie that is be be deleted. Using the unique date asociated with the object.
const deleteMovie = (data, date) => {
  for(let item in data) {
    if(data[item].date === +date) {
      return item;
    }
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
        //sort movies so that the most recent are first in the list
        let moviesArray = sortMovies(Object.values(data.val()));
        
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

          li.innerHTML = 
          `<h3 class="listHeader">${title}</h3>
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
          <button class='delete' aria-label='Delete movie' id='${movie.date}'>
          <i class='fa-solid fa-circle-minus fa-2xs'></i></button>
          </div>`

          moviesUl.append(li);

          li.firstChild.addEventListener('click', function () {
            const statContainer = this.nextElementSibling;
            statContainer.classList.toggle('expand');
          })

        })
        
        // Delete button - This removes an item from the list
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
          button.addEventListener('click', function (e) {
            const movieId = deleteMovie(data.val(), e.target.id)
            const movieRef = ref(database, '/users' + `/${user}` + '/movies' + `/${movieId}`)
            remove(movieRef);
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


