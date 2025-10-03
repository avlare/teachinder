import { filterUsers } from "../info/filter.js";
import { validUsers } from "../users.js";
import { renderTeachers, teachers } from "./addTeacher.js";

let currentFilters = {
    age: null,
    country: null,
    gender: null,
    favorite: null,
    photo: null,
};

const ageSelect = document.getElementById("age");
const regionSelect = document.getElementById("region");
const sexSelect = document.getElementById("sex");
const photoCheck = document.getElementById("photo-check");
const favCheck = document.getElementById("favorites-check");

export function cleanFilters() {
    ageSelect.value = "-";
    regionSelect.value = "-";
    sexSelect.value = "-";
    photoCheck.checked = false;
    favCheck.checked = false;

    currentFilters = { age: null, country: null, gender: null, favorite: false, photo: false };

    applyFilters();
}

function applyFilters() {
    const ageRange = ageSelect.value ? ageSelect.value.split("-") : null;
    currentFilters.age = ageRange
        ? { min: parseInt(ageRange[0]), max: parseInt(ageRange[1]) }
        : null;

    currentFilters.country = regionSelect.value || null;
    currentFilters.gender = sexSelect.value || null;
    currentFilters.photo = photoCheck.checked ? true : null;
    currentFilters.favorite = favCheck.checked ? true : null;

    const filtered = filterUsers(validUsers, currentFilters);
    renderTeachers(filtered);

    const loadMoreBtn = document.getElementById("load-more");
        if (loadMoreBtn) {
        const hasFilters = currentFilters.age || currentFilters.country || currentFilters.gender || currentFilters.photo || currentFilters.favorite;
        loadMoreBtn.style.display = hasFilters ? "none" : "";
    }
}

[ageSelect, regionSelect, sexSelect, photoCheck, favCheck].forEach(el => {
    el.addEventListener("change", () => applyFilters());
});