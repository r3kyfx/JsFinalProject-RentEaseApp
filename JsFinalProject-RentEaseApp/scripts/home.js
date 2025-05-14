const users = JSON.parse(localStorage.getItem("users"))
const upfBtn = document.getElementById("updatePfBtn");
const title = document.getElementsByClassName("title")[0];

const loggedUser = users.find(user => user.isLogged === true);

title.innerText +=" " + loggedUser.firstName + " " + loggedUser.lastName;