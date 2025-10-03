import { renderTeachers } from "./addTeacher.js";
import { searchInfo } from "../info/search.js";
import { validUsers } from "../users.js";

const input = document.getElementById("search");
const btn = document.querySelector(".search-header");

export function searchTeachers() {
    btn.addEventListener("submit", (event) => {
        event.preventDefault();
        const foundUsers = searchInfo(validUsers, input.value.trim());
        renderTeachers(foundUsers);
        input.value = '';
    });
}