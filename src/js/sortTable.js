import { sortUsers } from "./info/sort.js";

let currentSort = { key: null, order: null };
let originalUsers = [];

const tbody = document.getElementById("table-stats");

export function renderTable(data) {
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
    renderTable(originalUsers);

    const ths = document.querySelectorAll("thead th");

    function updateThClasses() {
        ths.forEach(h => h.classList.remove("asc", "desc"));
        if (currentSort.key) {
            const activeTh = document.querySelector(`th[data-key="${currentSort.key}"]`);
            if (activeTh) activeTh.classList.add(currentSort.order);
        }
    }

    ths.forEach(th => {
        th.style.cursor = "pointer";
        th.addEventListener("click", () => {
            const sortKey = th.dataset.key;
            if (!sortKey) return;
            if (currentSort.key === sortKey) {
                if (currentSort.order === "desc") {
                    currentSort.order = "asc";
                } else if (currentSort.order === "asc") {
                    currentSort = { key: null, order: null };
                    updateThClasses();
                    renderTable(originalUsers);
                    return;
                } else {
                    currentSort.order = "desc";
                }
            } else {
                currentSort.key = sortKey;
                currentSort.order = "desc";
            }

            updateThClasses();

            const sorted = sortUsers([...originalUsers], currentSort.key, currentSort.order);
            renderTable(sorted);
        });
    });
}
