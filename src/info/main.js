import { randomUserMock, additionalUsers } from "./FE4U-Lab2-mock.js"
import { getFormattedUsers } from "./format.js"
import { validateUsersFields } from "./validate.js"
import { filterUsers } from "./filter.js";
import { sortUsers } from "./sort.js";
import { searchInfo, calculatePercentage } from "./search.js";
import { writeFileSync } from 'fs';

// const randomUserMock = [
//   {
//     gender: undefined,
//     name: { title: "Mr", first: "Norbert", last: "Weishaupt" },
//     location: { city: "Rhön-Grabfeld", state: "" },
//     email: "norbert@example.com",
//     login: { uuid: "id-123" },
//     dob: { date: "1956-12-23T19:09:19.602Z", age: 75 },
//     phone: "89995",
//     picture: { large: undefined, thumbnail: "" },
//     favorite: null

//   },
//   {
//     gender: "Male",
//     name: { title: "Mr", first: "Claude", last: "Payne" },
//     location: { city: "Skerries", state: "Longford", country: "Ireland" },
//     email: "claude@example.com",
//     login: { uuid: "id-456" },
//     dob: { date: "1966-07-31T21:57:32.876Z", age: 74 },
//     phone: "071-558-2972",
//     picture: { large: "https://randomuser.me/api/portraits/men/40.jpg", thumbnail: "" },
//     note: "Hi"
//   },
// ];

// const additionalUsers = [
//   {
//     gender: "Male",
//     name: { title: "Mr", first: "Norbert", last: "Weishaupt" },
//     location: { city: "", state: "Mecklenburg-Vorpommern", country: "Ukraine" },
//     email: "norbert@example.com",
//     login: { uuid: "id-123" },
//     dob: { date: "", age: null },
//     phone: "971-558-297",
//     picture: { large: "https://randomuser.me/api/portraits/men/28.jpg", thumbnail: "https://randomuser.me/api/portraits/thumb/men/28.jpg" },
//     note: "Hello",
//   },
// ];

const JSONToFile = (results, filename) =>
  writeFileSync(`${filename}.json`, JSON.stringify(results, null, 2));

// task 1
let result = getFormattedUsers(randomUserMock, additionalUsers);
JSONToFile({ result }, 'src\\info\\results\\task1');

// task 2
let validUsers = validateUsersFields(result);
JSONToFile({ validUsers }, 'src\\info\\results\\task2');

// task 3
const filter = { age: { min: 61, max: 75 }, gender: "Male" };
let filteredUsers = filterUsers(validUsers, filter);
JSONToFile({ filteredUsers }, 'src\\info\\results\\task3');

// task 4
let sortedUsers = sortUsers(validUsers, "country", "desc");
JSONToFile({ sortedUsers }, 'src\\info\\results\\task4');

// task 5
const search = "Female germany";
let searchUsers = searchInfo(validUsers, search);
JSONToFile({ searchUsers }, 'src\\info\\results\\task5');

// task 6
let percentage = calculatePercentage(validUsers, search);
console.log("All users: " + validUsers.length + "; According to search: " + searchUsers.length + "; Percentage: " + percentage);