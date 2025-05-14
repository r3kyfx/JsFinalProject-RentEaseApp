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

export { checkPassword };
