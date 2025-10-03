let currentPage = 1;
let itemsPerPage = 10;
let users = [];
let renderFn = null;

const tbody = document.getElementById("table-stats");
const paginationContainer = document.createElement("nav");
paginationContainer.classList.add("table-pages");
paginationContainer.innerHTML = `<ul id="pagination-list"></ul>`;
tbody.parentElement.parentElement.appendChild(paginationContainer);

export function initPagination(data, renderCallback) {
    users = data;
    renderFn = renderCallback;
    currentPage = 1;
    renderPage();
}

function renderPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageUsers = users.slice(start, end);
    renderFn(pageUsers);
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginationList = document.getElementById("pagination-list");
    paginationList.innerHTML = "";

    if (totalPages <= 1) return;

    function createPageLink(page) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = page;

        if (page === currentPage) {
            a.style.fontWeight = "bold";
            a.style.color = "gray";
            a.style.cursor = "default";
            a.style.pointerEvents = "none";
        } else {
            a.addEventListener("click", (e) => {
                e.preventDefault();
                currentPage = page;
                renderPage();
            });
        }
        li.appendChild(a);
        return li;
    }

    function addEllipsis() {
        const li = document.createElement("li");
        li.textContent = "...";
        li.style.margin = "0 5px";
        paginationList.appendChild(li);
    }

    if (totalPages <= 4) {
        for (let i = 1; i <= totalPages; i++) {
            paginationList.appendChild(createPageLink(i));
        }
        return;
    }

    paginationList.appendChild(createPageLink(1));

    if (currentPage === 1) {
        paginationList.appendChild(createPageLink(2));
        addEllipsis();
        paginationList.appendChild(createPageLink(totalPages));
        return;
    }

    if (currentPage === 2) {
        paginationList.appendChild(createPageLink(2));
        paginationList.appendChild(createPageLink(3));
        addEllipsis();
        paginationList.appendChild(createPageLink(totalPages));
        return;
    }

    if (currentPage === 3) {
        paginationList.appendChild(createPageLink(2));
        paginationList.appendChild(createPageLink(3));
        paginationList.appendChild(createPageLink(4));
        addEllipsis();
        paginationList.appendChild(createPageLink(totalPages));
        return;
    }

    if (currentPage > 3 && currentPage < totalPages - 2) {
        addEllipsis();
        paginationList.appendChild(createPageLink(currentPage - 1));
        paginationList.appendChild(createPageLink(currentPage));
        paginationList.appendChild(createPageLink(currentPage + 1));
        addEllipsis();
        paginationList.appendChild(createPageLink(totalPages));
        return;
    }

    if (currentPage >= totalPages - 2) {
        addEllipsis();
        for (let i = totalPages - 3; i <= totalPages; i++) {
            if (i > 1) paginationList.appendChild(createPageLink(i));
        }
    }
}


export function updateData(newUsers) {
    users = newUsers;
    currentPage = 1;
    renderPage();
}
