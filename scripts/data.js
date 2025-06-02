class User {
    constructor(email, password, firstName, lastName, birthDate , isLogged , flats) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.isLogged = isLogged;
        this.flats = flats;
    }
}

class Flat {
    constructor(id , city , streetName , streetNumber , areaSize , hasAC , yearBuilt , rentPrice , dateAvailable , isFavorite){
        this.id = id;
        this.city = city;
        this.streetName = streetName;
        this.streetNumber = streetNumber;
        this.areaSize = areaSize;
        this.hasAC = hasAC;
        this.yearBuilt = yearBuilt;
        this.rentPrice = rentPrice;
        this.dateAvailable = dateAvailable;
        this.isFavorite = isFavorite;
    }
}

export {User , Flat}