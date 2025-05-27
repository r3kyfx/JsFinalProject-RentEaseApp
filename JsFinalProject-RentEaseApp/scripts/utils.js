function checkPassword(password) {
    let result = "Password must contain at least one ";
    let upperCase = /[A-Z]/.test(password);
    let nums = /[0-9]/.test(password);
    let specialCh = /[^A-Za-z0-9]/.test(password);

    if (!upperCase) return result += "uppercase letter";
    if (!nums) return result += "number";
    if (!specialCh) return result += "special character";

    return "";
}

function dropDownAnimation(element){
    setTimeout(() => {
        element.style.transition = "transform 0.5s ease";
        element.style.transform = "translateY(100%)"; 
    }, 1000)
    setTimeout(() => {
        element.style.transition = "none";
        element.style.transform = "translateY(-100%)";
    }, 2500); 
}

function getLoggedUser(){
    const users = JSON.parse(localStorage.getItem("users"));
    return users.find(user => user.isLogged === true);
}

function logDate(userEmail){
    const current = Date.now();
    sessionStorage.setItem(userEmail, current.toString());
}

function checkTimeOut(userEmail){
    const loggedTime = parseInt(sessionStorage.getItem(userEmail), 10);
    const currentTime = Date.now();

    const oneHour = 60 * 60 * 1000; 

    if (currentTime - loggedTime > oneHour) {
        alert("Session expired");
        window.location.assign("../pages/LoginRegister.html");
        return false
    }
    return true
}
export { checkPassword , checkTimeOut , dropDownAnimation , getLoggedUser , logDate};
