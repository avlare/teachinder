import { sortUsers } from "../info/sort.js";
import { initPagination, updateData } from "./pagination.js";

let currentSort = { key: null, order: null };
let originalUsers = [];

export function renderTable(data) {
    const tbody = document.getElementById("table-stats");
    tbody.innerHTML = "";
    data.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.full_name}</td>
          <td>${user.course}</td>
          <td>${user.age}</td>
          <td>${user.gender}</td>
          <td>${user.country}</td>
        `;
        tbody.appendChild(row);
    });
}

export function initSort(users) {
    originalUsers = Array.isArray(users) ? [...users] : [];
    initPagination(originalUsers, renderTable);

    const ths = document.querySelectorAll("thead th");

    function updateThClasses() {
        ths.forEach(th => {
            th.classList.remove("asc", "desc");
            if (th.dataset.key === currentSort.key) th.classList.add(currentSort.order);
        });
    }

    ths.forEach(th => {
        th.style.cursor = "pointer";
        th.addEventListener("click", () => {
            const sortKey = th.dataset.key;
            if (!sortKey) return;

            if (currentSort.key === sortKey) {
                currentSort.order = currentSort.order === "desc" ? "asc"
                                  : currentSort.order === "asc" ? null
                                  : "desc";
                if (!currentSort.order) {
                    currentSort.key = null;
                    updateThClasses();
                    updateData(originalUsers);
                    return;
                }
            } else {
                currentSort.key = sortKey;
                currentSort.order = "desc";
            }

            updateThClasses();
            updateData(sortUsers([...originalUsers], currentSort.key, currentSort.order));
        });
    });
}
