import { getHeader } from "./header.js";
import { getLoggedUser } from "./utils.js";
const allFLatsContainer = document.getElementsByClassName("container")[0];
getHeader(allFLatsContainer);

const loggedUser = getLoggedUser();
const users = JSON.parse(localStorage.getItem("users"));
const userIndex = users.findIndex(u => u.email === loggedUser.email);


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

CreateTable(allFLatsContainer , loggedUser.flats);