import { checkPassword } from "./utils.js"
const users = JSON.parse(localStorage.getItem("users"))
const upfEmail = document.getElementById("updatePfEmail");
const oldPass = document.getElementById("updatePfOldPass");
const newPass = document.getElementById("updatePfNewPass");
const upfFirstName = document.getElementById("updatePfFirstName");
const upfLastName = document.getElementById("updatePfLastName");
const upfDate = document.getElementById("updatePfBirthDate"); 
const saveBtn = document.getElementById("saveBtn");
const upfErrors = document.getElementsByClassName("updatePfErrors")[0]
const succes = document.getElementsByClassName("succes")[0];

const loggedUser = users.find(user => user.isLogged === true);
const loggedIndex = users.findIndex(user => user.isLogged === true);

upfEmail.value = loggedUser.email;
upfFirstName.value = loggedUser.firstName;
upfLastName.value = loggedUser.lastName;
upfDate.value = loggedUser.birthDate;

saveBtn.addEventListener("click" , () => {
    upfErrors.innerHTML = "";

    if(oldPass.value != loggedUser.password){
        upfErrors.innerHTML = "Old password is incorect"
        return;
    }

    let passCheck = checkPassword(newPass.value);
    if(passCheck !== "") {
        upfErrors.innerHTML = passCheck;
        return;
    }
    
    loggedUser.email = upfEmail.value;
    loggedUser.password = newPass.value;
    loggedUser.firstName = upfFirstName.value;
    loggedUser.lastName = upfLastName.value;
    loggedUser.birthDate = upfDate.value;

    users[loggedIndex] = loggedUser;
    localStorage.setItem("users" , JSON.stringify(users));
    succes.style.transition = "transform 0.5s ease";
    succes.style.transform = "translateY(0%)";

    setTimeout(() => {
    succes.style.transition = "transform 0.5s ease";
    succes.style.transform = "translateY(100%)"; 
    }, 1000)
    setTimeout(() => {
    succes.style.transition = "none";
    succes.style.transform = "translateY(-100%)"; // Reset position
    }, 2500); 
})