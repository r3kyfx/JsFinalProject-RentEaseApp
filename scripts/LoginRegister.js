import { checkPassword , logDate} from "./utils.js";
import { User } from "./data.js";

const regBtn = document.getElementById("regBtn");
const regForm = document.getElementById("regForm");
const regSucces = document.getElementsByClassName("regSucces")[0];
const logBtn = document.getElementById("logBtn")
const container = document.getElementsByClassName("container")[0];
const actualLogBtn = document.getElementById("actualLogBtn");
const actualRegBtn = document.getElementById("actualRegBtn");

//login
const logEmail = document.getElementById("logMail");
const logPass = document.getElementById("logPass");
const logErrors = document.getElementsByClassName("logErrors")[0];

//register
const regEmail = document.getElementById("regEmail");
const regPass = document.getElementById("regPass");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const birthDate = document.getElementById("birthDate");
const regErrors = document.getElementsByClassName("regErrors")[0];

window.addEventListener("pageshow", () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.forEach(user => user.isLogged = false);
    localStorage.setItem("users", JSON.stringify(users));
});


regBtn.addEventListener("click" , () => {
    regForm.style.transform = "translateY(0%)";
    container.style.backgroundColor = "#78C0E0";
})

logBtn.addEventListener("click" , () => {
    regForm.style.transform = "translateY(-100%)";
    container.style.backgroundColor = "#efecec";
})

actualLogBtn.addEventListener("click" , () => {
    logErrors.innerText = "";

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const findUser = users.find((user) => (user.email === logEmail.value && user.password === logPass.value));
    console.log(findUser)
    if(findUser){
        users.forEach(user => {
            if(user.email === findUser.email)
                user.isLogged = true;
            else user.isLogged = false;
        });
        localStorage.setItem("users" , JSON.stringify(users));
        logDate(logEmail.value);
        window.location.href = "./HomePage.html";
    }else{
        logErrors.innerText = "Email or password invalid";
    }

})

actualRegBtn.addEventListener("click" , () => {
    regErrors.innerText = "";
    const regInputs = Array.from(regForm.querySelectorAll("input"));
    const clearInputs = regInputs.filter(input => input.value === "");
    const filledInputs = regInputs.filter(input => input.value !== "");
    filledInputs.forEach(input => input.style.borderColor = "black");
    if(clearInputs.length){
        regErrors.innerText = "All fields are required";
        clearInputs.forEach(input => {
            input.style.borderColor = "red";
        })
        return;
    }
    const passCheck = checkPassword(regPass.value);

    if(passCheck !== ""){
        regErrors.innerText = passCheck;
        return
    }
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const uploadUser = users.some((user) => user.email === regEmail.value);
    if(!uploadUser){
            let newUser = new User(
            regEmail.value,
            regPass.value,
            firstName.value,
            lastName.value,
            birthDate.value,
            true,
            []
        );
        
        users.push(newUser);
        localStorage.setItem("users" , JSON.stringify(users));
        logDate(regEmail.value);
        window.location.assign("../pages/HomePage.html");
    }else{
        regErrors.innerText = "User already exists";
        return;
    }
})