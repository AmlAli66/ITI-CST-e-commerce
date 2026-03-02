import { updateUsersBadge } from "./admin-panel.js";
import { resetUserPassword } from "../../core/users-service.js";
import { logAdminAction } from "../../core/users-service.js";
import { showToast } from "../../core/utils.js";

let deleteUserId = null;
let resetUserId = null;

let tableState = {
    currentPage: 1,
    rowsPerPage: 8,
    sortField: null,
    sortDirection: "asc",
    search: "",
    role: "all"
};




export function renderUsers() {
    const section = document.getElementById("adminUsers");
    section.classList.remove("hidden");

    section.innerHTML = `
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
            <h3 class="fw-bold">Users Management</h3>
            <div class="d-flex gap-2 w-100 w-md-auto">
                <input type="text" id="userSearch" class="form-control" placeholder="Search users...">
                <select id="roleFilter" class="form-select">
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                    <option value="customer">Customer</option>
                </select>
            </div>
        </div>
        <div id="usersContainer" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3"></div>
        <div id="pagination" class="d-flex justify-content-end mt-3"></div>
    `;

    attachEvents();
    renderTable();
}

function renderTable() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const search = tableState.search;
    const roleFilter = tableState.role;

    let filtered = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const userContainer = document.getElementById("usersContainer");

    if (filtered.length === 0) {
        userContainer.innerHTML = `
            <div class="col-12 text-center py-5 text-muted">
                <i class="bi bi-search fs-1"></i>
                <h5>No Results Found</h5>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        document.getElementById("pagination").innerHTML = "";
        return;
    }

    // Pagination Logic
    const totalPages = Math.ceil(filtered.length / tableState.rowsPerPage);
    const start = (tableState.currentPage - 1) * tableState.rowsPerPage;
    const paginated = filtered.slice(start, start + tableState.rowsPerPage);

    userContainer.innerHTML = paginated.map(user => `
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3"> 
            <div class="user-card h-100"> 
                <div class="user-header">
                    <h6 class="mb-0 text-truncate fw-bold" style="max-width: 120px; color: #1e293b;">${user.name}</h6>
                    <span class="role-badge ${getRoleClass(user.role)}">${user.role}</span>
                </div>
                <div class="small text-muted text-truncate mt-1">
                    <i class="bi bi-envelope me-1"></i>${user.email}
                </div>
                <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-light">
                    <div class="form-check form-switch mb-0">
                        <input class="form-check-input status-toggle" type="checkbox" data-id="${user.id}" ${user.status === "active" ? "checked" : ""}>
                    </div>
                    <div class="user-actions">
                        ${renderActions(user)}
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    renderPagination(totalPages);
    attachRowEvents();
    attachViewUserEvents();
}


function getRoleClass(role) {
    return {
        admin: "status-rejected",
        seller: "status-pending",
        customer: "status-approved"
    }[role] || "bg-light text-dark";
}


function renderActions(user) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (user.email === currentUser.email) return `<button class="btn btn-sm btn-soft btn-soft-primary" disabled><i class="bi bi-person-badge"></i></button>`;
    if (user.role === "admin" && user.isMain) return `<button class="btn btn-sm btn-soft btn-soft-primary" disabled><i class="bi bi-lock-fill"></i></button>`;

    return `
        <button class="btn btn-sm btn-soft btn-soft-primary view-user" data-id="${user.id}">
            <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-soft btn-soft-primary reset-password" data-id="${user.id}">
            <i class="bi bi-key"></i>
        </button>
        <button class="btn btn-sm btn-soft btn-soft-danger delete-user" data-id="${user.id}">
            <i class="bi bi-trash"></i>
        </button>
    `;
}

function renderPagination(totalPages) {
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        container.innerHTML += `
            <button class="page-btn ${i === tableState.currentPage ? "active-page" : ""}" 
                data-page="${i}">
                ${i}
            </button>
        `;
    }

    document.querySelectorAll(".page-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            tableState.currentPage = parseInt(btn.dataset.page);
            renderTable();
        });
    });
}


function attachEvents() {
    document.getElementById("userSearch").addEventListener("input", (e) => {
        tableState.search = e.target.value.toLowerCase().trim();
        tableState.currentPage = 1;
        renderTable();
    });

    document.getElementById("roleFilter").addEventListener("change", (e) => {
        tableState.role = e.target.value;
        tableState.currentPage = 1;
        renderTable();
    });


}



function attachRowEvents() {
    document.querySelectorAll(".status-toggle").forEach(toggle => {
        toggle.addEventListener("change", () => {
            const id = toggle.dataset.id;
            let users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.id == id);
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if (user.email === currentUser.email) {
                showToast("You cannot change your own status!");
                toggle.checked = user.status === "active";
                return;
            }

            user.status = toggle.checked ? "active" : "inactive";
            localStorage.setItem("users", JSON.stringify(users));
            showToast("User status updated");
        });
    });

    document.querySelectorAll(".delete-user").forEach(btn => {
        btn.addEventListener("click", () => {
            deleteUserId = btn.dataset.id;
            const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
            modal.show();
        });
    });

    document.querySelectorAll(".reset-password").forEach(btn => {
        btn.addEventListener("click", () => {
            resetUserId = btn.dataset.id;
            const modal = new bootstrap.Modal(document.getElementById("resetModal"));
            document.getElementById("newPasswordBox").classList.add("d-none");
            document.getElementById("confirmResetBtn").disabled = false;
            modal.show();
        });
    });

    document.getElementById("confirmResetBtn").addEventListener("click", handleResetConfirm);
}

function attachViewUserEvents() {
    document.querySelectorAll(".view-user").forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = btn.dataset.id;
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.id == userId);
            if (!user) return;

            document.getElementById("viewUserName").textContent = user.name;
            document.getElementById("viewUserEmail").textContent = user.email;
            document.getElementById("viewUserPhone").textContent = user.phone;
            document.getElementById("viewUserAddress").textContent = user.address;
            document.getElementById("viewUserDate").textContent = user.dateCreated;
            document.getElementById("userRoleBadge").textContent = user.role;
            document.getElementById("viewUserLastReset").textContent = getLastReset(user.email);

            // Store name only for seller
            if (user.role === "seller" && user.storeName) {
                document.getElementById("viewUserStore").textContent = user.storeName;
                document.getElementById("viewUserStoreRow").style.display = "flex";
            } else {
                document.getElementById("viewUserStoreRow").style.display = "none";
            }

            const modal = new bootstrap.Modal(document.getElementById("viewUserModal"));
            modal.show();

            attachUserModalEvents(user);
        });
    });


}

function getLastReset(userEmail) {
    const logs = JSON.parse(localStorage.getItem("adminLogs")) || [];
    const resetLogs = logs.filter(log => log.action === "Reset Password" && log.target === userEmail);
    if (resetLogs.length === 0) return "Never";
    return new Date(resetLogs[0].date).toLocaleString();
}


function attachUserModalEvents(user) {
    const statusToggle = document.getElementById("modalStatusToggle");
    const statusText = document.getElementById("modalStatusText");
    const resetBtn = document.getElementById("modalResetPasswordBtn");
    // const newPasswordBox = document.getElementById("modalNewPasswordBox");

    // set initial status
    statusToggle.checked = user.status === "active";
    statusText.textContent = user.status;

    //update status 
    statusToggle.addEventListener("change", () => {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (user.email === currentUser.email) {
            showToast("You cannot change your own status!");
            statusToggle.checked = user.status === "active";
            return;
        }

        // update the status in the users list
        users = users.map(u => u.id == user.id ? { ...u, status: statusToggle.checked ? "active" : "inactive" } : u);

        localStorage.setItem("users", JSON.stringify(users));

        statusText.textContent = statusToggle.checked ? "active" : "inactive";

        // update the status in the main table
        const mainToggle = document.querySelector(`.status-toggle[data-id="${user.id}"]`);
        if (mainToggle) mainToggle.checked = statusToggle.checked;

        showToast("User status updated");
    });

    // Reset password inside modal
    resetBtn.onclick = () => {
        resetUserId = user.id;
        const modal = new bootstrap.Modal(document.getElementById("resetModal"));
        document.getElementById("newPasswordBox").classList.add("d-none");
        document.getElementById("confirmResetBtn").disabled = false;
        modal.show();
    };

}




function handleResetConfirm() {
    const result = resetUserPassword(resetUserId);

    if (!result) return;

    const { user, newPassword } = result;

    // present the new password
    const passwordBox = document.getElementById("newPasswordBox");
    passwordBox.innerHTML = `
        <strong>New Password:</strong> ${newPassword}
        <br>
        <small class="text-muted">
            Please send it securely to ${user.email}
        </small>
    `;
    passwordBox.classList.remove("d-none");

    // Disable the button so admin can't click again immediately
    document.getElementById("confirmResetBtn").disabled = true;


    // updateUsersBadge();
    renderTable();

    //update the date in the modal if it's opened
    const modalEmail = document.getElementById("viewUserEmail")?.textContent;
    if (modalEmail && modalEmail === user.email) {
        document.getElementById("viewUserLastReset").textContent = getLastReset(user.email);
    }

    showToast(`Password for ${user.name} has been reset`);
}


// function showToast(message) {

//     const toast = document.createElement("div");
//     toast.className = "custom-toast";
//     toast.innerText = message;

//     document.body.appendChild(toast);

//     setTimeout(() => toast.classList.add("show"), 100);

//     setTimeout(() => {
//         toast.classList.remove("show");
//         setTimeout(() => toast.remove(), 300);
//     }, 2500);
// }

document.addEventListener("click", function (e) {
    if (e.target.id === "confirmDeleteBtn") {
        handleDeleteConfirm();
    }
});


function handleDeleteConfirm() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter(u => u.id != deleteUserId);
    localStorage.setItem("users", JSON.stringify(users));

    // to calc the new count of pages
    const totalPages = Math.ceil(users.length / tableState.rowsPerPage);

    // if the current page bigger than the last one
    if (tableState.currentPage > totalPages) {
        tableState.currentPage = totalPages || 1;
    }

    bootstrap.Modal
        .getInstance(document.getElementById('deleteModal'))
        .hide();

    showToast("User deleted successfully");
    updateUsersBadge();
    renderTable();

    const deletedUser = users.find(u => u.id == deleteUserId);
    logAdminAction("Delete User", deletedUser);
}

