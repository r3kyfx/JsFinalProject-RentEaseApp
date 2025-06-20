import { getHeader } from "./header.js";
import { Flat } from "./data.js"
import { getLoggedUser , dropDownAnimation } from "./utils.js";
const newFlatContainer = document.getElementsByClassName("container")[0];
getHeader(newFlatContainer);

const succes = document.getElementsByClassName("succesNewFlat")[0];

const flatForm = document.getElementsByClassName("flatForm")[0];

const cityInput = document.getElementById("city");
const streetNameInput = document.getElementById("streetName");
const streetNumberInput = document.getElementById("streetNumber");
const areaSizeInput = document.getElementById("areaSize");
const hasACInput = document.getElementById("hasAC");
const yearBuiltInput = document.getElementById("yearBuilt");
const rentPriceInput = document.getElementById("rentPrice");
const dateAvailableInput = document.getElementById("dateAvailable");

flatForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users"));
    const loggedUser = getLoggedUser();
    const loggedIndex = users.findIndex(user => user.email === loggedUser.email);

    loggedUser.flats.push(new Flat(
        crypto.randomUUID(),
        cityInput.value.trim() , 
        streetNameInput.value.trim() , 
        Number(streetNumberInput.value) ,
        Number(areaSizeInput.value) , 
        hasACInput.checked ,
        Number(yearBuiltInput.value) ,
        Number(rentPriceInput.value) ,
        dateAvailableInput.value ,
        true 
    ))

    users[loggedIndex] = loggedUser;
    localStorage.setItem("users" , JSON.stringify(users));

    succes.style.transition = "transform 0.5s ease";
    succes.style.transform = "translateY(0%)";
    dropDownAnimation(succes);

    resetInputs();
});

function resetInputs(){
    flatForm.querySelectorAll("input").forEach(input => {
        input.value = "";
    })
    hasACInput.checked = false;
}
