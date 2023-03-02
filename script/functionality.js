const logOutButton = document.getElementById('logOut');
const currentUser = JSON.parse(window.localStorage.getItem('user'));

logOutButton.addEventListener('click', e => {
  window.localStorage.removeItem('user');
  window.location.assign('index.html');
  })  