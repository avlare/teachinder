import "../css/app.css";
import { renderTeachers } from "./ui/addTeacher.js";
import { searchTeachers } from "./ui/searchTeachers.js";
import { initTabs, setWdr, updateWdr } from "./ui/sortTable.js"
import "./ui/filterUsers.js";
import "./ui/formAddTeacher.js";
import { validUsers, loadTeachers } from "./users.js";


document.addEventListener("DOMContentLoaded", async () => {
  await loadTeachers();
  renderTeachers(validUsers);
  searchTeachers(validUsers);
  initTabs(validUsers);
  setWdr(validUsers);
  // renderChart(validUsers, "course");

  const loadMoreBtn = document.getElementById("load-more");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => loadTeachers(10));
  }
});

export async function addTeacherOnServer(teacher) {
  try {
    const response = await fetch("http://localhost:3000/teachers", {
      method: "POST",
      body: JSON.stringify(teacher)
    });
      console.log("added");
  } catch (error) {
    console.error({error});
  }
}
