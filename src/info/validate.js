import { isValidPhoneNumber } from 'libphonenumber-js';

function checkStringCapitalLetter(word) {
    return (typeof word == "string" && word[0] == word[0].toUpperCase());
}

function checkNumber(num) {
    return typeof num == "number";
}

function checkEmail (email) {
    const chechkString = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return chechkString.test(email);
}

function checkPhoneNumber(phone) {
    if(typeof phone === "string")
        return isValidPhoneNumber(phone);
    return false;
}

function validateUser(user) {
    // console.log("User name   " + user.full_name);
    // console.log("пender:" + checkStringCapitalLetter(user.gender));
    // console.log("note:" + checkStringCapitalLetter(user.note));
    // console.log("country:" + checkStringCapitalLetter(user.country));
    // console.log("age:" + checkNumber(user.age));
    // console.log("phone:" + checkPhoneNumber(user.phone));
    // console.log("email:" + checkEmail(user.email));
    return (
    checkStringCapitalLetter(user.full_name) &&
    checkStringCapitalLetter(user.gender) &&
    checkStringCapitalLetter(user.note) &&
    checkStringCapitalLetter(user.state) &&
    checkStringCapitalLetter(user.country) &&
    checkNumber(user.age) &&
    checkPhoneNumber(user.phone) &&
    checkEmail(user.email)
    )
};

export function validateUsersFields(users) {
    return users.filter(user => validateUser(user))
}