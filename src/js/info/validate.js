import _ from "lodash";
import { isValidPhoneNumber } from "libphonenumber-js";

function checkStringCapitalLetter(word) {
  return _.isString(word) && word.charAt(0) === _.upperFirst(word).charAt(0);
}

function checkNumber(num) {
  return _.isNumber(num) && !_.isNaN(num);
}

function checkEmail(email) {
  return _.isString(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkPhoneNumber(phone) {
  return _.isString(phone) && isValidPhoneNumber(phone);
}

function validateUser(user) {
  return (
    checkStringCapitalLetter(_.get(user, "full_name")) &&
    checkStringCapitalLetter(_.get(user, "gender")) &&
    checkStringCapitalLetter(_.get(user, "note")) &&
    checkStringCapitalLetter(_.get(user, "state")) &&
    checkStringCapitalLetter(_.get(user, "country")) &&
    checkNumber(_.get(user, "age")) &&
    checkPhoneNumber(_.get(user, "phone")) &&
    checkEmail(_.get(user, "email"))
  );
}

export function validateUsersFields(users) {
  return _.filter(users, validateUser);
}
