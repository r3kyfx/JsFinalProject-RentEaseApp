import {getLoggedUser} from "./utils.js"
function getHeader(container){
    const header = document.createElement("div");
    const headerTitile = document.createElement("h1");

    const headerMenu = createMenu();
    const loggedUser = getLoggedUser();
    headerTitile.innerText += "Hello " + loggedUser.firstName + " " + loggedUser.lastName;

    header.classList.add("headerContainer");

    header.append(headerTitile , headerMenu);
    container.prepend(header);
}

function createMenu(){
    const menu = document.createElement("select");
    const placeholder = document.createElement("option");
    const upf = document.createElement("option");
    const home = document.createElement("option");
    const allFlats = document.createElement("option");
    const newFlat = document.createElement("option");
    const logOut = document.createElement("option");

    placeholder.textContent = "Menu";
    placeholder.disabled = true;
    placeholder.selected = true;

    home.textContent = "Home";
    home.value = "home";

    allFlats.textContent = "All Flats"
    allFlats.value = "allFlats";

    newFlat.textContent = "New Flat";
    newFlat.value = "newFlat";

    upf.textContent = "Update profile";
    upf.value = "updatePf";

    logOut.textContent = "Log Out"
    logOut.value = "logOut"

    const router = {
        home : "../pages/HomePage.html",
        updatePf : "../pages/UpdateProfile.html",
        allFlats : "../pages/AllFlats.html",
        newFlat : "../pages/NewFlat.html",
        logOut : "../pages/LoginRegister.html",
    }

    menu.addEventListener("change" , (e) => {
        const targetPage = router[e.target.value];
        if(targetPage) window.location.assign(targetPage);
    })

    menu.append(placeholder , home , upf , allFlats , newFlat , logOut)
    return menu;
}

export { getHeader }