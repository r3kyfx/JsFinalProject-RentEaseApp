import { getHeader } from "./header.js";
import { getLoggedUser , transposeTable} from "./utils.js";
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

const mediaQuery = window.matchMedia('(max-width: 750px)') //phone media querry

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

    tableContainer.addEventListener("click" , (e) => {
        const button = e.target;
        let rowIndex = button.closest('tr').getAttribute("data-index");
        let colIndex = button.closest("td").cellIndex - 1;
        let relativeIndex = table.dataset.transposed === true ? colIndex : rowIndex;
        console.log(table.dataset.transposed)
        console.log(flats[relativeIndex])
        let absoluteIndex = loggedUser.flats.findIndex(flat => flat.id === flats[relativeIndex].id);
        loggedUser.flats[absoluteIndex].isFavorite = button.checked;
        users[userIndex] = loggedUser;
        localStorage.setItem("users" , JSON.stringify(users));
    })
    tableContainer.append(table);
    container.append(tableContainer);
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
    if(mediaQuery.matches) transposeTable(document.querySelector("table")) //phone

    
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
    if(mediaQuery.matches) transposeTable(document.querySelector("table")) //phone

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

// phone

if(mediaQuery.matches) transposeTable(document.querySelector("table"))

mediaQuery.addEventListener("change", (e) => {
    let table = document.querySelector("table");
    if (e.matches) {
        transposeTable(table);
        table.dataset.transposed = "true";
    } else {
        location.reload();
        table.dataset.transposed = "false";
    }
});