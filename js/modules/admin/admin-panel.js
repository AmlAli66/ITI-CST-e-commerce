// ===============================
// ADMIN STATE
// ===============================

const AdminState = {
    users: [],
    filteredUsers: [],
    currentPage: 1,
    rowsPerPage: 5
};


document.addEventListener("DOMContentLoaded", async () => {

    await bootstrapUsers();

    setupAdminNavigation();
    loadSection("overview"); // default

});

function setupAdminNavigation() {

    const links = document.querySelectorAll(".admin-sidebar .nav-link");

    links.forEach(link => {
        link.addEventListener("click", () => {

            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const section = link.getAttribute("data-section");
            loadSection(section);

        });
    });

}


async function bootstrapUsers() {
    if (!localStorage.getItem("users")) {
        const res = await fetch("../../data/users.json");
        const data = await res.json();
        localStorage.setItem("users", JSON.stringify(data));
    }

    AdminState.users = JSON.parse(localStorage.getItem("users")) || [];
    AdminState.filteredUsers = [...AdminState.users];
}

function loadSection(section) {

    const container = document.getElementById("admin-section-container");

    if (section === "overview") {
        container.innerHTML = renderOverviewSection();
        renderAdminStats();
        renderUsersChart();

    }

    if (section === "users") {
        container.innerHTML = renderUsersSection();
        renderUsersTable();
        attachUsersEvents();
    }

    if (section === "products") {
        container.innerHTML = `<h4>Products Management (Coming Next)</h4>`;
    }

    if (section === "orders") {
        container.innerHTML = `<h4>Orders Management (Coming Next)</h4>`;
    }

}

function renderOverviewSection() {
    return `
        <div class="row g-4 mb-4" id="adminStats"></div>

        <div class="admin-card p-4">
            <h5>User Roles Distribution</h5>
            <canvas id="usersChart"></canvas>
        </div>
    `;
}


function renderAdminStats() {

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalUsers = users.length;
    const sellers = users.filter(u => u.role === "seller").length;
    const pendingProducts = products.filter(p => p.status === "pending").length;

    document.getElementById("adminStats").innerHTML = `
        <div class="col-md-3">
            <div class="stat-card p-4">
                <h6>Total Revenue</h6>
                <h3>$${totalRevenue}</h3>
            </div>
        </div>

        <div class="col-md-3">
            <div class="stat-card p-4">
                <h6>Total Users</h6>
                <h3>${totalUsers}</h3>
            </div>
        </div>

        <div class="col-md-3">
            <div class="stat-card p-4">
                <h6>Sellers</h6>
                <h3>${sellers}</h3>
            </div>
        </div>

        <div class="col-md-3">
            <div class="stat-card p-4 text-danger">
                <h6>Pending Products</h6>
                <h3>${pendingProducts}</h3>
            </div>
        </div>
    `;
}

function renderUsersChart() {

    const roleCounts = {
        admin: 0,
        seller: 0,
        customer: 0
    };

    AdminState.users.forEach(u => {
        roleCounts[u.role]++
    });

    new Chart(document.getElementById("usersChart"), {
        type: 'doughnut',
        data: {
            labels: Object.keys(roleCounts),
            datasets: [{
                data: Object.values(roleCounts)
            }]
        }
    });
}


function renderUsersSection() {
    return `
        <div class="admin-card p-4">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold">Users Management</h4>
                <button class="btn addUser-btn text-light" id="addUserBtn">
                    <i class="bi bi-plus-circle"></i> Add User
                </button>
            </div>

            <div class="row mb-3 g-3">
                <div class="col-md-4">
                    <input type="text" id="userSearch"
                        class="form-control"
                        placeholder="Search by name or email">
                </div>

                <div class="col-md-3">
                    <select id="roleFilter" class="form-select">
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="seller">Seller</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>
            </div>

            <div id="usersTable"></div>

        </div>
    `;
}
function renderUsersTable() {

    const start = (AdminState.currentPage - 1) * AdminState.rowsPerPage;
    const end = start + AdminState.rowsPerPage;

    const paginatedUsers = AdminState.filteredUsers.slice(start, end);

    document.getElementById("usersTable").innerHTML = `
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th class="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${paginatedUsers.map(user => `
                    <tr>
                        <td class="fw-semibold">${user.name}</td>
                        <td>${user.email}</td>
                        <td><span class="badge bg-secondary">${user.role}</span></td>
                        <td>
                            <span class="badge bg-${user.status === 'active' ? 'success' : 'danger'}">
                                ${user.status}
                            </span>
                        </td>
<td class="text-end">
    <button class="btn btn-sm btn-outline-primary edit-user"
        data-id="${user.id}">
        Edit
    </button>

    <button class="btn btn-sm btn-outline-warning toggle-status"
        data-id="${user.id}">
        Toggle
    </button>

    <button class="btn btn-sm btn-outline-danger delete-user"
        data-id="${user.id}">
        Delete
    </button>
</td>

                    </tr>
                `).join("")}
            </tbody>
        </table>

        <div class="d-flex justify-content-end mt-3">
            ${renderPagination()}
        </div>
    `;

    attachUsersEvents();
}

document.querySelectorAll(".edit-user")
    .forEach(btn => {
        btn.addEventListener("click", () => openEditUserModal(btn.dataset.id));
    });


function approveProduct(id) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const index = products.findIndex(p => +p.id === +id);
    products[index].status = "approved";
    localStorage.setItem("products", JSON.stringify(products));
    renderProductsModeration();
}

function attachUsersEvents() {

    document.getElementById("userSearch")
        ?.addEventListener("input", applyUserFilters);

    document.getElementById("roleFilter")
        ?.addEventListener("change", applyUserFilters);

    document.querySelectorAll(".page-btn")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                AdminState.currentPage = +btn.dataset.page;
                renderUsersTable();
            });
        });

    document.querySelectorAll(".toggle-status")
        .forEach(btn => {
            btn.addEventListener("click", () => toggleUserStatus(btn.dataset.id));
        });

    document.querySelectorAll(".delete-user")
        .forEach(btn => {
            btn.addEventListener("click", () => deleteUser(btn.dataset.id));
        });

    document.getElementById("addUserBtn")
        ?.addEventListener("click", openAddUserModal);
}


function toggleUserStatus(id) {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => +u.id === +id);

    user.status = user.status === "active" ? "blocked" : "active";

    localStorage.setItem("users", JSON.stringify(users));

    renderUsersTable();
    attachUsersEvents();
}

function deleteUser(id) {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.filter(u => +u.id !== +id);

    localStorage.setItem("users", JSON.stringify(users));

    renderUsersTable();
    attachUsersEvents();
}


function renderPagination() {

    const totalPages = Math.ceil(AdminState.filteredUsers.length / AdminState.rowsPerPage);

    let buttons = "";

    for (let i = 1; i <= totalPages; i++) {
        buttons += `
            <button class="btn btn-sm ${i === AdminState.currentPage ? 'btn-danger' : 'btn-outline-secondary'} page-btn"
                data-page="${i}">
                ${i}
            </button>
        `;
    }

    return buttons;
}
function applyUserFilters() {

    const search = document.getElementById("userSearch").value.toLowerCase();
    const role = document.getElementById("roleFilter").value;

    AdminState.filteredUsers = AdminState.users.filter(u => {

        const matchesSearch =
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search);

        const matchesRole =
            role === "all" || u.role === role;

        return matchesSearch && matchesRole;

    });

    AdminState.currentPage = 1;
    renderUsersTable();
}



function openAddUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    modal.show();

    document.getElementById("saveUserBtn")
        .addEventListener("click", saveNewUser);
}

function saveNewUser() {

    const name = document.getElementById("newUserName").value;
    const email = document.getElementById("newUserEmail").value;
    const role = document.getElementById("newUserRole").value;

    const newUser = {
        id: Date.now(),
        name,
        email,
        role,
        status: "active"
    };

    AdminState.users.push(newUser);
    localStorage.setItem("users", JSON.stringify(AdminState.users));

    applyUserFilters();

    bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
}


function openEditUserModal(id) {

    const user = AdminState.users.find(u => +u.id === +id);

    document.getElementById("editUserId").value = user.id;
    document.getElementById("editUserName").value = user.name;
    document.getElementById("editUserEmail").value = user.email;
    document.getElementById("editUserRole").value = user.role;

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();

    document.getElementById("updateUserBtn")
        .onclick = updateUser;
}

function updateUser() {

    const id = +document.getElementById("editUserId").value;
    const name = document.getElementById("editUserName").value;
    const email = document.getElementById("editUserEmail").value;
    const role = document.getElementById("editUserRole").value;

    const user = AdminState.users.find(u => u.id === id);

    user.name = name;
    user.email = email;
    user.role = role;

    localStorage.setItem("users", JSON.stringify(AdminState.users));

    applyUserFilters();

    bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
}
