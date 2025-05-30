import { getHeader } from "./header.js";
import { getLoggedUser } from "./utils.js";
const allFLatsContainer = document.getElementsByClassName("container")[0];
getHeader(allFLatsContainer);

const loggedUser = getLoggedUser();
const users = JSON.parse(localStorage.getItem("users"));
const userIndex = users.findIndex(u => u.email === loggedUser.email);
let filteredFlats = [...loggedUser.flats]
const filter = document.getElementById("filterBtn");
const filterTab = document.querySelector(".filterTab");
const showAllBtn = document.getElementById("showAll");
const autoComplete = document.getElementsByClassName("suggestions")[0]


//filter options
//city filter
const cityFilter = document.getElementById("cityFilter");
//price fillter
const minPrice = document.getElementById("minPrice")
const maxPrice = document.getElementById("maxPrice");
//area filter
const minArea = document.getElementById("minArea");
const maxArea = document.getElementById("maxArea");


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
            <tbody>
                ${flats.map((flat , index) => CreateTableRow(flat, index)).join("")}
                <tr class="hide">
                    <td colspan=9 >No items to show</td>
                </tr>
            </tbody>
        `

    table.addEventListener("change" , (e) => {
        if(e.target && e.target.classList.contains("favorite-toggle")){
            const row = e.target.closest("tr");
            const rowIndex = parseInt(row.getAttribute("data-index"));

            const originalIndex = loggedUser.flats.findIndex(flat => flat === filteredFlats[rowIndex]);
            if(originalIndex != -1){
                loggedUser.flats[originalIndex].isFavorite = e.target.checked;
                users[userIndex].flats = loggedUser.flats;
                localStorage.setItem("users" , JSON.stringify(users));
            }
        }
    })

    container.append(table);
}

//filter logic

//autocomplete

cityFilter.addEventListener("input" , (e) => {
    autoComplete.innerHTML = '';
    let input = e.target.value.trim();
    if(input === '') return;

    let cities = [...new Set(
        loggedUser.flats
        .filter(flat => flat.city
                            .trim()
                            .toLowerCase()
                            .startsWith(
                                input
                                .toLowerCase()
                            ))
        .map(flat => flat.city)
    )]

    cities.forEach(city => {
        let div = document.createElement("div");
        div.innerHTML = city;
        div.addEventListener("click" , (e) => {
            e.stopPropagation();
            cityFilter.value = city;
            autoComplete.innerHTML = ''
        })
        autoComplete.append(div);
    });
})

filter.addEventListener("click" , (e) => {
    filterTab.classList.add("filterTabShown");
    allFLatsContainer.classList.add("lowOpacity");
    e.stopPropagation()
})

filterTab.addEventListener("submit" , (e) => {
    e.preventDefault();

    allFLatsContainer.querySelector("table").remove();

    filteredFlats = loggedUser.flats
        .filterByString("city" , cityFilter.value)
        .filterByNumber("rentPrice" , minPrice.value , maxPrice.value)
        .filterByNumber("areaSize" , minArea.value , maxArea.value)
    CreateTable(allFLatsContainer , filteredFlats);
    
    const noItemsMsg = allFLatsContainer.querySelector("table tbody .hide")

    if(filteredFlats.length === 0) noItemsMsg.classList.remove("hide");
    else noItemsMsg.classList.add("hide");
})

document.addEventListener("click", (e) => {
    if (
        !filterTab.contains(e.target) &&
        !autoComplete.contains(e.target)
    ) {
        hideFilterTab();
    }
});

document.addEventListener("keydown" , (e) => {
    if(e.key === "Escape") hideFilterTab()
})



function hideFilterTab(){
    filterTab.classList.remove("filterTabShown");
    allFLatsContainer.classList.remove("lowOpacity");
    filter.disabled = false;
}

showAllBtn.addEventListener("click" , () => {
    filteredFlats = [...loggedUser.flats];
    allFLatsContainer.querySelector("table").remove();
    resetFilterInputs();
    CreateTable(allFLatsContainer , filteredFlats);

    const noItemsMsg = allFLatsContainer.querySelector("table tbody .hide");
    noItemsMsg.classList.add("hide");
})
//filter functions
function resetFilterInputs(){
    cityFilter.value = "";
    minPrice.value = "";
    maxPrice.value = "";
    minArea.value = "";
    maxArea.value = "";
}

Array.prototype.filterByString = function(strProp , city){
    if(city.trim() === "" || city === undefined || city === null) return this;
    return this.filter(flat => flat[strProp].toLowerCase() === city.toLowerCase())
}

Array.prototype.filterByNumber = function(nrProp , minProp , maxProp){
    if(minProp === undefined || minProp === null || minProp === "") minProp = 0;
    if(maxProp === undefined || maxProp === null || maxProp === "") maxProp = Number.MAX_SAFE_INTEGER;

    minProp = Number(minProp);
    maxProp = Number(maxProp);

    return this.filter(flat => flat[nrProp] >= minProp && flat[nrProp] <= maxProp);
}

CreateTable(allFLatsContainer , loggedUser.flats);