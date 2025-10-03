import { teachers, renderTeachers } from "./addTeacher.js";
import { cleanFilters } from "./filterUsers.js";
import { validUsers } from "./app.js";

const dialogAddTeacher = document.getElementById("dialog-add-teacher");
const openAddTeacherBtn = document.getElementById("open-add-teacher-btn");
const closeAddTeacherBtn = document.getElementById("close-add-teacher-btn");
const formAddTeacher = document.querySelector(".form-add-teacher");

openAddTeacherBtn.addEventListener("click", () => {
    dialogAddTeacher.showModal();
});


closeAddTeacherBtn.addEventListener("click", () => {
    dialogAddTeacher.close();
});


formAddTeacher.addEventListener("submit", (e) => {
    e.preventDefault();

    const full_name = formAddTeacher["dialog-name-teacher"].value.trim();
    const course = formAddTeacher["dialog-speciality-teacher"].value;
    const country = formAddTeacher["dialog-country-teacher"].value;
    const city = formAddTeacher["dialog-city-teacher"].value.trim();
    const email = formAddTeacher["dialog-email-teacher"].value.trim();
    const phone = formAddTeacher["dialog-phone-teacher"].value.trim();
    const dob = formAddTeacher["dialog-date-teacher"].value;
    const gender = formAddTeacher["dialog-sex-teacher"].value;
    const note = formAddTeacher["dialog-notes-teacher"].value.trim();
    const bgColor = formAddTeacher["dialog-background-color-teacher"].value;


    let age = null;
    if (dob) {
        const birthDate = new Date(dob);
        const diff = Date.now() - birthDate.getTime();
        age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    if (age === null || age < 18) {
        alert("Age value is unavailable!");
        return;
    }


    const newTeacher = {
        id: crypto.randomUUID(),
        full_name,
        course,
        country,
        city,
        email,
        phone,
        age,
        gender,
        note,
        picture_large: null,
        favorite: false,
        bg_color: bgColor
    };

    validUsers.push(newTeacher);
    cleanFilters();
    formAddTeacher.reset();
    dialogAddTeacher.close();
});
