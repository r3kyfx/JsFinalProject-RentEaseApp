import { getHeader } from "./header.js";
import { getLoggedUser  , checkTimeOut , transposeTable , handleNoItems } from "./utils.js";
const loggedUser = getLoggedUser();
checkTimeOut(loggedUser.email);
const homeContainer = document.getElementsByClassName("container")[0];
getHeader(homeContainer);

const users = JSON.parse(localStorage.getItem("users"));
const userIndex = users.findIndex(u => u.email === loggedUser.email);

const mediaQuery = window.matchMedia('(max-width: 750px)') //phone media querry

let favFlats = loggedUser.flats.filter((flat) => flat.isFavorite === true)

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
            <td><button class="removeFav" data-id = ${flat.id}>X</button></td>
        </tr>
    `
}

function CreateTable(container , flats){
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table-container");
    
    const table = document.createElement("table");
    table.setAttribute("data-transposed" , mediaQuery.matches);

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
                <th>Remove</th>
            </tr>
            </thead>
            <tbody>
                ${flats.map((flat) => CreateTableRow(flat)).join("")}
            </tbody>
        `
    tableContainer.addEventListener("click" , (e) => {
        const button = e.target;
        if(!button.classList.contains("removeFav")) return;

        const flatId = button.dataset.id;

        if(!flatId) return;

        const absoluteIndex = loggedUser.flats.findIndex(flat => flat.id === flatId);

        if(absoluteIndex === -1) return;

        loggedUser.flats[absoluteIndex].isFavorite = false;
        users[userIndex] = loggedUser;
        localStorage.setItem("users" , JSON.stringify(users));

        renderTable();
    })
    tableContainer.append(table);
    container.append(tableContainer);
}

function renderTable() {
    const oldTableContainer = document.querySelector(".table-container");
    if (oldTableContainer) oldTableContainer.remove();

    favFlats = loggedUser.flats.filter(flat => flat.isFavorite);

    CreateTable(homeContainer, favFlats);
    handleNoItems(homeContainer , favFlats);

    if (mediaQuery.matches) {
        transposeTable(document.querySelector("table"));
    }
}

renderTable();

mediaQuery.addEventListener("change", () => {
    renderTable(); 
});