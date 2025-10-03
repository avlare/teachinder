import { renderTeachers } from "./addTeacher.js";
import { searchInfo } from "./info/search.js";

const input = document.getElementById("search");
const btn = document.querySelector(".search-header");

export function searchTeachers(users) {
    btn.addEventListener("submit", (event) => {
        event.preventDefault();
        const foundUsers = searchInfo(users, input.value.trim());
        renderTeachers(foundUsers);
        input.value = '';
    });
}
