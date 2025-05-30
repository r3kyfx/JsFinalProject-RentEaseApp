import { getHeader } from "./header.js";
import { getLoggedUser  , checkTimeOut} from "./utils.js";
const loggedUser = getLoggedUser();
checkTimeOut(loggedUser.email);
const homeContainer = document.getElementsByClassName("container")[0];
getHeader(homeContainer);

const users = JSON.parse(localStorage.getItem("users"));
const userIndex = users.findIndex(u => u.email === loggedUser.email);

let favFlats = loggedUser.flats.filter((flat) => flat.isFavorite === true)

function CreateTableRow(flat , index){
    return `
        <tr data-index = ${index}>
            <td>${flat.city}</td>
            <td>${flat.streetName}</td>
            <td>${flat.streetNumber}</td>
            <td>${flat.areaSize}</td>
            <td>${flat.hasAC === true ? "Yes" : "No"}</td>
            <td>${flat.yearBuilt}</td>
            <td>${flat.rentPrice}</td>
            <td>${flat.dateAvailable}</td>
            <td><button class="removeFav">X</button></td>
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
                <th>Remove</th>
            </tr>
            </thead>
            <tbody>
                ${flats.map((flat , index) => CreateTableRow(flat, index)).join("")}
                <tr class=${favFlats.length === 0 ? '' : 'hide'}>
                    <td colspan=9 >No items to show</td>
                </tr>
            </tbody>
        `
    table.addEventListener("click" , (e) => {
        if(e.target && e.target.classList.contains("removeFav")){
            const row = e.target.closest("tr");
            const rowIndex = parseInt(row.getAttribute("data-index"));

            const originalIndex = loggedUser.flats.findIndex(flat => flat === favFlats[rowIndex]);
            if(originalIndex != -1){
                loggedUser.flats[originalIndex].isFavorite = false;
                users[userIndex].flats = loggedUser.flats;
                localStorage.setItem("users" , JSON.stringify(users));
                favFlats.splice(rowIndex , 1);
                
                const noItemsMsg = homeContainer.querySelector("table tbody .hide");
                if(!favFlats.length) noItemsMsg.classList.remove("hide")
                else noItemsMsg.classList.add("hide");

                row.remove();
            }
        }
    })
    container.append(table);
}

CreateTable(homeContainer , favFlats);