import { getHeader } from "./header.js";
import { getLoggedUser } from "./utils.js";
const allFLatsContainer = document.getElementsByClassName("container")[0];
getHeader(allFLatsContainer);

const loggedUser = getLoggedUser();
const users = JSON.parse(localStorage.getItem("users"));
const userIndex = users.findIndex(u => u.email === loggedUser.email);
const filter = document.getElementById("filterBtn");
const filterTab = document.querySelector(".filterTab");

//filter options
//city filter
const cityFilter = document.getElementById("cityFilter");
console.log(cityFilter.value)
//price fillter
const minPrice = document.getElementById("minPirce")
const maxPrice = document.getElementById("maxPrice");
//area filter
const minArea = document.getElementById("minArea");
const maxArea = document.getElementById("maxArea");


function CreateTableRow(flat){
    
    return `
        <tr>
            <td>${flat.city}</td>
            <td>${flat.streetName}</td>
            <td>${flat.streetNumber}</td>
            <td>${flat.areaSize}</td>
            <td>${flat.hasAC === true ? "Yes" : "No"}</td>
            <td>${flat.yearBuilt}</td>
            <td>${flat.rentPrice}</td>
            <td>${flat.dateAvailable}</td>
            <td><input type="checkbox" class="favorite-toggle" ${flat.isFavorite === true ? "checked" : ""} /></td>
        </tr>
    `
}

function CreateTable(container , flats){
    const table = document.createElement("table");
    table.innerHTML = 
        `
            <thead>
            <tr>
                <th>City</th>
                <th>Street Name</th>
                <th>Street Number</th>
                <th>Area Size (sqm)</th>
                <th>Has AC</th>
                <th>Year Built</th>
                <th>Rent Price ($)</th>
                <th>Date Available</th>
                <th>Favourite</th>
            </tr>
            </thead> 
        `
    let tbody = `<tbody>`
    flats.forEach(flat => {
        tbody += CreateTableRow(flat);
    });
    tbody += `</tbody>`

    table.innerHTML += tbody;
    
    table.querySelectorAll(".favorite-toggle").forEach((checkbox , i) => {
        checkbox.addEventListener("change" , () => {
            loggedUser.flats[i].isFavorite = checkbox.checked;
            users[userIndex] = loggedUser;
            localStorage.setItem("users" , JSON.stringify(users));
        })
    })

    container.append(table);
}

filter.addEventListener("click" , () => {
    filterTab.classList.toggle("filterTabShown")
    allFLatsContainer.classList.toggle("lowOpacity")
})

filterTab.addEventListener("submit" , (e) => {
    e.preventDefault();
    filterTab.classList.remove("filterTabShown");
    allFLatsContainer.classList.remove("lowOpacity")
    allFLatsContainer.querySelector("table").remove();
    CreateTable(allFLatsContainer , filterByCity(cityFilter.value.trim()))
})

function filterByCity(city){
    return loggedUser.flats.filter(flat => flat.city.toLowerCase() === city.toLowerCase())
}

CreateTable(allFLatsContainer , loggedUser.flats);