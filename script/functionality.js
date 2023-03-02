const logOutButton = document.getElementById('logOut')
const testButton = document.getElementById('test')


testButton.addEventListener('click', e => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  console.log(user)
  })

logOutButton.addEventListener('click', e => {
  window.localStorage.removeItem('user')
  window.location.assign('index.html')
  })