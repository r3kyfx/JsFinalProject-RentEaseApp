import { checkPassword , dropDownAnimation} from "./utils.js"
import { getHeader } from "./header.js";
const users = JSON.parse(localStorage.getItem("users"))
const upfContainer = document.getElementsByClassName("container")[0];
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

getHeader(upfContainer);

updateInputs();

saveBtn.addEventListener("click" , () => {
    upfErrors.innerHTML = "";

    if(oldPass.value.trim() === ""){
        upfErrors.innerHTML = "Old password is required"
        return;
    }

    if(oldPass.value != loggedUser.password){
        upfErrors.innerHTML = "Old password is incorect"
        return;
    }

    if(newPass.value.trim() != ""){
        let passCheck = checkPassword(newPass.value);
        if(passCheck !== "") {
            upfErrors.innerHTML = passCheck;
            return;
        }
    }
    
    loggedUser.email = upfEmail.value.trim();
    if(newPass.value.trim() !== "") loggedUser.password = newPass.value;
    loggedUser.firstName = upfFirstName.value.trim();
    loggedUser.lastName = upfLastName.value.trim();
    loggedUser.birthDate = upfDate.value;

    users[loggedIndex] = loggedUser;
    localStorage.setItem("users" , JSON.stringify(users));
    updateInputs();

    succes.style.transition = "transform 0.5s ease";
    succes.style.transform = "translateY(0%)";

    dropDownAnimation(succes);
})

function updateInputs(){
    upfEmail.value = loggedUser.email;
    upfFirstName.value = loggedUser.firstName;
    upfLastName.value = loggedUser.lastName;
    upfDate.value = loggedUser.birthDate;
    oldPass.value = "";
    newPass.value = "";
}