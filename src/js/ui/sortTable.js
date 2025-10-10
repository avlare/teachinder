// import Chart from 'chart.js/auto';
// import { sortUsers } from "../info/sort.js";
// import { initPagination, updateData } from "./pagination.js";

// let currentSort = { key: null, order: null };
// let originalUsers = [];

// export function renderTable(data) {
//     const tbody = document.getElementById("table-stats");
//     tbody.innerHTML = "";
//     data.forEach(user => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//           <td>${user.full_name}</td>
//           <td>${user.course}</td>
//           <td>${user.age}</td>
//           <td>${user.gender}</td>
//           <td>${user.country}</td>
//         `;
//         tbody.appendChild(row);
//     });
// }

// export function initSort(users) {
//     originalUsers = Array.isArray(users) ? [...users] : [];
//     initPagination(originalUsers, renderTable);

//     const ths = document.querySelectorAll("thead th");

//     function updateThClasses() {
//         ths.forEach(th => {
//             th.classList.remove("asc", "desc");
//             if (th.dataset.key === currentSort.key) th.classList.add(currentSort.order);
//         });
//     }

//     ths.forEach(th => {
//         th.style.cursor = "pointer";
//         th.addEventListener("click", () => {
//             const sortKey = th.dataset.key;
//             if (!sortKey) return;

//             if (currentSort.key === sortKey) {
//                 currentSort.order = currentSort.order === "desc" ? "asc"
//                                   : currentSort.order === "asc" ? null
//                                   : "desc";
//                 if (!currentSort.order) {
//                     currentSort.key = null;
//                     updateThClasses();
//                     updateData(originalUsers);
//                     return;
//                 }
//             } else {
//                 currentSort.key = sortKey;
//                 currentSort.order = "desc";
//             }

//             updateThClasses();
//             updateData(sortUsers([...originalUsers], currentSort.key, currentSort.order));
//         });
//     });
// }

// const config = {
//   type: 'pie',
//   data: data,
//   options: {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Chart.js Pie Chart'
//       }
//     }
//   },
// };

//  new Chart(
//     document.getElementById('acquisitions'),
//     {
//       type: 'bar',
//       options: {
//         animation: false,
//         plugins: {
//           legend: {
//             display: false
//           },
//           tooltip: {
//             enabled: false
//           }
//         }
//       },
//       data: {
//         labels: data.map(row => row.year),
//         datasets: [
//           {
//             label: 'Acquisitions by year',
//             data: data.map(row => row.count)
//           }
//         ]
//       }
//     }
//   );

import Chart from "chart.js/auto";
import WebDataRocks from "@webdatarocks/webdatarocks";
import "@webdatarocks/webdatarocks/webdatarocks.min.css";
import { teachers } from "./addTeacher.js";

let chartInstance = null;
let pivot = null;

function getCategoryStats(users, key) {
  const stats = {};

  users.forEach((user) => {
    let value = user[key];

    if (key === "age" && typeof value === "number") {
      if (value >= 18 && value <= 31) value = "18–31";
      else if (value >= 32 && value <= 41) value = "32–41";
      else if (value >= 42 && value <= 51) value = "42–51";
      else if (value >= 52 && value <= 61) value = "52–61";
      else if (value >= 62 && value <= 81) value = "62–81";
      else value = "Other";
    }

    stats[value] = (stats[value] || 0) + 1;
  });

  return stats;
}

export function renderChart(users, categoryKey) {
  const ctx = document.getElementById("chartCanvas");
  const stats = getCategoryStats(users, categoryKey);

  let labels = Object.keys(stats);
  let data = Object.values(stats);

  if (categoryKey === "age") {
    const ageOrder = ["18–31", "32–41", "42–51", "52–61", "62–81", "Other"];
    labels = ageOrder.filter(label => stats[label]);
    data = labels.map(label => stats[label]);
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}


export function initTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const key = tab.dataset.category;
            renderChart(teachers, key);
        });
    });
}

export function setWdr(users) {
    const usersWithMetadata = getMetadata(users);
    pivot = new WebDataRocks({
        container: "#pivotContainer",
        width: "100%",
        beforetoolbarcreated: customizeToolbar,
        toolbar: true,
        report: {
            dataSource: { data: usersWithMetadata },
            slice: {
                rows: [
                    {
                        uniqueName: "course"
                    }
                ],
                columns: [
                    {
                        uniqueName: "country"
                    },
                    {
                        uniqueName: "Measures"
                    }
                ],
                measures: [
                    {
                        uniqueName: "full_name",
                        aggregation: "count",
                    }
                ]
            }
        }
    });
}

export function updateWdr(users) {
    const usersWithMetadata = getMetadata(users);
    pivot.updateData({
        data: usersWithMetadata,
    });
}

function customizeToolbar(toolbar) {
    let tabs = toolbar.getTabs();
    tabs = [];
    toolbar.getTabs = function () {
        tabs.unshift({
            id: "wdr-tab-country",
            title: "Country Table",
            handler: setCountryReport,
            icon: this.icons.format
        }, {
            id: "wdr-tab-flat",
            title: "Flat Table",
            handler: setFlatTable,
            icon: this.icons.format
        });
        return tabs;
    }

    const setCountryReport = function () {
        let report = pivot.getReport();
        report.slice = {
            rows: [
                {
                    uniqueName: "course"
                }
            ],
            columns: [
                {
                    uniqueName: "country"
                },
                {
                    uniqueName: "Measures"
                }
            ],
            measures: [
                {
                    uniqueName: "full_name",
                    aggregation: "count",
                }
            ]
        };
        report.options.grid = {
            type: "classic"
        };
        pivot.setReport(report);
        pivot.refresh();
    };

    const setFlatTable = function () {
        let report = pivot.getReport();
        report.slice = {
            "rows": [
                {
                    "uniqueName": "full_name"
                },
                {
                    "uniqueName": "course"
                },
                {
                    "uniqueName": "country"
                },
                {
                    "uniqueName": "city"
                },
                {
                    "uniqueName": "age"
                },
                {
                    "uniqueName": "b_date"
                },
                {
                    "uniqueName": "email"
                },
                {
                    "uniqueName": "gender"
                },
                {
                    "uniqueName": "phone"
                },
            ],
            "flatOrder": [
                "full_name",
                "course",
                "country",
                "city",
                "age",
                "b_date",
                "email",
                "gender",
                "phone"
            ]
        };
        pivot.setReport(report);
        pivot.setOptions({
            grid: {
                type: "flat",
                showGrandTotals: false
            }
        });
        pivot.refresh();
    };
}

function getMetadata(users) {
    const metadataRow = {
        id: { type: "string", caption: "ID" },
        title: { type: "string", caption: "Title" },
        full_name: { type: "string", caption: "Full Name" },
        gender: { type: "string", caption: "Gender" },
        age: { type: "number", caption: "Age" },
        b_date: { type: "datetime", caption: "Birth Date" },
        course: { type: "string", caption: "Course" },
        city: { type: "string", caption: "City" },
        state: { type: "string", caption: "Region / State" },
        country: { type: "string", caption: "Country" },
        postcode: { type: "number", caption: "Postcode" },
        email: { type: "string", caption: "Email" },
        phone: { type: "string", caption: "Phone" },
        favorite: { type: "boolean", caption: "Favorite" },
        note: { type: "string", caption: "Note" },
        "coordinates.latitude": { type: "number", caption: "Latitude" },
        "coordinates.longitude": { type: "number", caption: "Longitude" },
        "timezone.offset": { type: "string", caption: "Timezone Offset" },
        "timezone.description": { type: "string", caption: "Timezone Description" },
        bg_color: { type: "string", caption: "Background Color" },
    };

    return [metadataRow, ...users];
}
