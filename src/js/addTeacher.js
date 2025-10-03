import { initSort } from "./sortTable";
const teachersContainer = document.querySelector(".panel-teachers");
const favoritesContainer = document.querySelector(".favourite-panel");
const dialogInfoTeacher = document.getElementById("dialog-teacher-info");
const closeInfoTeacher = document.getElementById("close-info-teacher-btn");
const favPanel = document.querySelector(".favourite-panel");
const leftBtn = document.querySelector(".arrow-btn.left");
const rightBtn = document.querySelector(".arrow-btn.right");

export let teachers = [];
let favorites = [];

export function renderTeachers(data) {
    teachers = data;
    teachersContainer.innerHTML = "";
    teachers.forEach(teacher => {
        const card = renderTeacherCard(teacher);
        teachersContainer.appendChild(card, true);
    });
    initSort(teachers);
}

function renderTeacherCard(teacher, favorite=true) {
    const teacherDiv = document.createElement("div");
    teacherDiv.classList.add("teacher");
    if (teacher.favorite && favorite) teacherDiv.classList.add("star");
    let teacherAvatar = "";
    if (teacher.picture_large) {
        teacherAvatar = `<img src="${teacher.picture_large}" alt="Photo of ${teacher.full_name}" />`;
    } else {
        const names = teacher.full_name.split(" ");
        let initials = "";
        if (names.length === 1) {
            initials = names[0][0] || "?";
        } else {
            initials = (names[0][0] || "?") + (names[1][0] || "?");
        }
        teacherAvatar = `<span style="color: ${teacher.bg_color}">${initials}</span>`;
    }

    teacherDiv.innerHTML = `
<div class="teacher-image" style="border-color: ${teacher.bg_color}">
    ${teacherAvatar}
</div>
    <div class="teacher-info">
        <p class="teacher-name">${teacher.full_name.split(" ")[0]}</p>
        <p class="teacher-surname">${teacher.full_name.split(" ")[1] || ""}</p>
        <p class="teacher-discipline">${teacher.course}</p>
        <p class="teacher-country">${teacher.country}</p>
    </div>
`;


    teacherDiv.dataset.id = teacher.id;
    return teacherDiv;
}

document.addEventListener("click", (e) => {
    const teacherCard = e.target.closest(".teacher");
    if (!teacherCard) return;

    const teacherId = teacherCard.dataset.id;
    const teacher = teachers.find(t => t.id === teacherId)
        || favorites.find(t => t.id === teacherId);

    if (!teacher) return;

    dialogInfoTeacher.querySelector("img").src = teacher.picture_large || "/images/blank_profile.webp";
    dialogInfoTeacher.querySelector("h2").textContent = teacher.full_name;
    dialogInfoTeacher.querySelector("h3").textContent = teacher.course;
    dialogInfoTeacher.querySelector(".dialog-description p:nth-of-type(1)").textContent =
        `${teacher.city}, ${teacher.country}`;
    dialogInfoTeacher.querySelector(".dialog-description p:nth-of-type(2)").textContent =
        `${teacher.age}, ${teacher.gender}`;
    dialogInfoTeacher.querySelector("a").href = `${teacher.email}`;
    dialogInfoTeacher.querySelector("a").textContent = teacher.email;
    dialogInfoTeacher.querySelector(".dialog-description p:nth-of-type(3)").textContent =
        teacher.phone;
    dialogInfoTeacher.querySelector(".dialog-main-info > p").textContent =
        teacher.note;


    const favBtn = dialogInfoTeacher.querySelector(".dialog-star");
    favBtn.textContent = teacher.favorite ? "★" : "☆";
    favBtn.onclick = () => {
        toggleFavorite(teacherId);
        favBtn.textContent = teacher.favorite ? "★" : "☆";
    };

    dialogInfoTeacher.showModal();
});

closeInfoTeacher.addEventListener("click", () => {
    dialogInfoTeacher.close();
});


function toggleFavorite(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    teacher.favorite = !teacher.favorite;

    if (teacher.favorite) {
        if (!favorites.some(f => f.id === teacherId)) {
            favorites.push(teacher);
        }
    } else {
        favorites = favorites.filter(f => f.id !== teacherId);
    }

    renderTeachers(teachers);
    renderFavorites();
}


function renderFavorites() {
    favoritesContainer.innerHTML = "";
    favorites.forEach(teacher => {
        const favCard = renderTeacherCard(teacher, false);
        favoritesContainer.appendChild(favCard);
    });
    updateArrowsVisibility();
}

function updateArrowsVisibility() {
    if (favPanel.scrollWidth <= favPanel.clientWidth) {
        leftBtn.style.display = "none";
        rightBtn.style.display = "none";
    } else {
        leftBtn.style.display = "block";
        rightBtn.style.display = "block";
    }
}

leftBtn.addEventListener("click", () => {
    favPanel.scrollBy({ left: -100, behavior: "smooth" });
});

rightBtn.addEventListener("click", () => {
    favPanel.scrollBy({ left: 100, behavior: "smooth" });
});

favPanel.addEventListener("scroll", updateArrowsVisibility);