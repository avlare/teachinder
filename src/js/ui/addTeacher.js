import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dayjs from 'dayjs';
// import { initSort } from "./sortTable";
import { renderChart } from "./sortTable";
const teachersContainer = document.querySelector(".panel-teachers");
const favoritesContainer = document.querySelector(".favourite-panel");
const dialogInfoTeacher = document.getElementById("dialog-teacher-info");
const closeInfoTeacher = document.getElementById("close-info-teacher-btn");
const favPanel = document.querySelector(".favourite-panel");
const leftBtn = document.querySelector(".arrow-btn.left");
const rightBtn = document.querySelector(".arrow-btn.right");
const birthdayField = dialogInfoTeacher.querySelector(".birthday-info");
// const activeTab = document.querySelector(".tabs .tab.active");



export let teachers = [];
let favorites = [];

export function renderTeachers(data) {
  teachers = data;
  teachersContainer.innerHTML = "";
  teachers.forEach(teacher => {
    const card = renderTeacherCard(teacher);
    teachersContainer.appendChild(card, true);
  });
  // initSort(teachers);
  const activeTab = document.querySelector(".tabs .tab.active");
  const category = activeTab ? activeTab.dataset.category : "course";
  renderChart(teachers, category);
}

function renderTeacherCard(teacher, favorite = true) {
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

function calcBirthday(b_date) {
  const today = dayjs().startOf("day");
  const birthday = dayjs(b_date).startOf("day");

  let nextBirthday = birthday.year(today.year());

  if (nextBirthday.isBefore(today, "day")) {
    nextBirthday = nextBirthday.add(1, "year");
  }

  const diff = nextBirthday.diff(today, "day");

  if (diff === 0) {
    return "Happy birthday! Congratulations to the teacher!";
  }
  else if (diff === 1) {
    return "Tomorrow is the birthday!";
  }
  else {
    return `${diff} days left until birthday`;
  }
}

document.addEventListener("click", (e) => {
  const teacherCard = e.target.closest(".teacher");
  if (!teacherCard) return;

  const teacherId = teacherCard.dataset.id;
  const teacher = findTeacherById(teacherId);
  if (!teacher) return;

  openTeacherDialog(teacher);
});

function findTeacherById(id) {
  return teachers.find((t) => t.id === id) || favorites.find((t) => t.id === id);
}


function openTeacherDialog(teacher) {
  updateDialogInfo(teacher);
  updateFavoriteButton(teacher);
  renderMap(teacher);
  dialogInfoTeacher.showModal();
}


function updateDialogInfo(teacher) {
  let ageGenderText = `${teacher.age} | ${teacher.gender}`;

  if (teacher.b_date) {
    const daysLeft = calcBirthday(teacher.b_date);
    ageGenderText += ` | ${daysLeft}`;
  } else {
    ageGenderText += ` | No birthday data`;
  }

  dialogInfoTeacher.querySelector("img").src =
    teacher.picture_large || "/images/blank_profile.webp";
  dialogInfoTeacher.querySelector("h2").textContent = teacher.full_name;
  dialogInfoTeacher.querySelector("h3").textContent = teacher.course;
  dialogInfoTeacher.querySelector(
    ".dialog-description p:nth-of-type(1)"
  ).textContent = `${teacher.city}, ${teacher.country}`;
  dialogInfoTeacher.querySelector(
    ".dialog-description p:nth-of-type(2)"
  ).textContent = ageGenderText;
  dialogInfoTeacher.querySelector("a").href = `mailto:${teacher.email}`;
  dialogInfoTeacher.querySelector("a").textContent = teacher.email;
  dialogInfoTeacher.querySelector(
    ".dialog-description p:nth-of-type(3)"
  ).textContent = teacher.phone ?? "No phone";
  dialogInfoTeacher.querySelector(".dialog-main-info > p").textContent =
    teacher.note ?? "";
}

function updateFavoriteButton(teacher) {
  const favBtn = dialogInfoTeacher.querySelector(".dialog-star");
  favBtn.textContent = teacher.favorite ? "★" : "☆";
  favBtn.onclick = () => {
    toggleFavorite(teacher.id);
    favBtn.textContent = teacher.favorite ? "★" : "☆";
  };
}


function renderMap(teacher) {
  const oldMap = dialogInfoTeacher.querySelector(".map-container");
  if (oldMap) oldMap.remove();

  const mapContainer = document.createElement("div");
  mapContainer.classList.add("map-container");
  dialogInfoTeacher.querySelector(".dialog-main-info").appendChild(mapContainer);

  setTimeout(() => {
    const lat = parseFloat(teacher.coordinates.latitude);
    const lng = parseFloat(teacher.coordinates.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      const map = L.map(mapContainer).setView([lat, lng], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const circle = L.circle([lat, lng], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 500,
      }).addTo(map);

      circle.bindTooltip(
        `${teacher.full_name}<br>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
        {
          permanent: false,
          direction: "top",
          offset: [0, -5],
        }
      );

      map.invalidateSize();
    } else {
      showNoMapData(mapContainer);
    }
  }, 200);
}


function showNoMapData(container) {
  console.warn("No valid coordinates for teacher");
  container.textContent = "No valid location data for this teacher.";
  Object.assign(container.style, {
    textAlign: "center",
    color: "#666",
    padding: "1em",
    height: "2rem",
  });
}

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