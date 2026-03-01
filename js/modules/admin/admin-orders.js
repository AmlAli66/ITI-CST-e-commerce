import { getAllOrders, updateOrderStatus, cancelOrderById } from "../../core/orders-service.js";
import { showToast } from "../../core/utils.js";

let ordersState = {
    currentPage: 1,
    rowsPerPage: 6,
    search: "",
    statusFilter: "all",
    sortField: null,
    sortDirection: "desc"
};

export function renderOrders() {
    const container = document.getElementById("adminOrders");
    container.classList.remove("hidden");

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold">Orders Management</h3>
            <div class="d-flex gap-2 align-items-center">
                <input id="orderSearch" class="form-control form-control-sm" placeholder="Search Order ID / User ID">
                <select id="sortSelect" class="form-select form-select-sm">
                    <option value="">Sort</option>
                    <option value="date-desc">Newest</option>
                    <option value="date-asc">Oldest</option>
                    <option value="price-desc">Highest Price</option>
                    <option value="price-asc">Lowest Price</option>
                </select>
                <select id="statusFilter" class="form-select form-select-sm">
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button id="resetFiltersBtn" class="btn btn-light btn-sm">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
            </div>
        </div>

        <div id="ordersStatusBadges" class="mb-3"></div>
        <div id="ordersDisplay"></div>
        <div id="ordersPagination" class="mt-4 d-flex justify-content-end"></div>
    `;

    attachFilters();
    initCancelModal();
    renderOrdersGrid();
}



function renderOrdersGrid() {
    const display = document.getElementById("ordersDisplay");
    const pagination = document.getElementById("ordersPagination");

    let orders = getAllOrders() || [];

    orders = orders.map(o => ({
        ...o,
        status: (o.status || "pending").toLowerCase().trim()
    }));

    renderStatusBadges(orders);

    if (ordersState.search) {
        orders = orders.filter(o =>
            o.id?.toString().includes(ordersState.search) ||
            o.userId?.toString().includes(ordersState.search)
        );
    }

    if (ordersState.statusFilter !== "all") {
        orders = orders.filter(o => o.status === ordersState.statusFilter);
    }

    if (ordersState.sortField) {
        orders.sort((a, b) => {
            let aValue, bValue;
            if (ordersState.sortField === "date") {
                aValue = new Date(a.orderDate);
                bValue = new Date(b.orderDate);
            }
            if (ordersState.sortField === "price") {
                aValue = a.totalPrice;
                bValue = b.totalPrice;
            }
            if (aValue < bValue) return ordersState.sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return ordersState.sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }

    if (!orders.length) {
        display.innerHTML = `<div class="empty-state"><i class="bi bi-cart-x fs-1"></i><p>No orders found</p></div>`;
        pagination.innerHTML = "";
        return;
    }

    const start = (ordersState.currentPage - 1) * ordersState.rowsPerPage;
    const paginated = orders.slice(start, start + ordersState.rowsPerPage);

    display.innerHTML = paginated.map(orderCard).join("");

    renderPagination(orders.length);
    attachOrderEvents();
}

// function orderCard(o) {
//     // Disable cancel button if status is already cancelled
//     const cancelDisabled = o.status === "cancelled" ? "disabled" : "";

//     return `
//         <div class="orderCard p-3 shadow-sm rounded-4 h-100">
//             <div class="d-flex justify-content-between align-items-center">
//                 <span class="orderCardId fw-bold">#${o.id.toString().slice(-6)}</span>
//                 <span class="badge bg-${getStatusColor(o.status)}">
//                     ${o.status}
//                 </span>
//             </div>
//             <div class="mt-2 small text-muted">User ID: ${o.userId}</div>
//             <div class="mt-2"><strong>Total:</strong> ${o.totalPrice} EGP</div>
//             <div class="mt-2 small"><strong>Date:</strong> ${new Date(o.orderDate).toLocaleString()}</div>
//             <div class="mt-3 d-flex gap-2 flex-wrap">
//                 <select class="form-select form-select-sm statusDropdown" data-id="${o.id}">
//                     <option value="pending" ${o.status === "pending" ? "selected" : ""}>Pending</option>
//                     <option value="shipped" ${o.status === "shipped" ? "selected" : ""}>Shipped</option>
//                     <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Delivered</option>
//                     <option value="cancelled" ${o.status === "cancelled" ? "selected" : ""}>Cancelled</option>
//                 </select>
//                 <button class="btn btn-sm btn-danger cancelBtn" data-id="${o.id}" ${cancelDisabled}>Cancel</button>
//             </div>
//         </div>
//     `;
// }

// function orderCard(o) {
//     const cancelDisabled = o.status === "cancelled" ? "disabled" : "";

//     return `
//         <div class="orderCard p-3 shadow-sm rounded-4 h-100">

//             <div class="d-flex justify-content-between align-items-center">
//                 <span class="orderCardId fw-bold">#${o.id.toString().slice(-6)}</span>
//                 <span class="badge bg-${getStatusColor(o.status)}">
//                     ${o.status}
//                 </span>
//             </div>

//             <div class="mt-2 small text-muted">User ID: ${o.userId}</div>
//             <div class="mt-2"><strong>Total:</strong> ${o.totalPrice} EGP</div>
//             <div class="mt-2 small">
//                 <strong>Date:</strong> ${new Date(o.orderDate).toLocaleString()}
//             </div>

//             <div class="mt-3 d-flex gap-2 flex-wrap">

//                 <button class="  viewDetailsBtn btn btn-sm  status-pending status-pending-hover" data-id="${o.id}">
//                     <i class="bi bi-eye"></i> View
//                 </button>

//                 <select class="form-select form-select-sm statusDropdown" data-id="${o.id}">
//                     <option value="pending" ${o.status === "pending" ? "selected" : ""}>Pending</option>
//                     <option value="shipped" ${o.status === "shipped" ? "selected" : ""}>Shipped</option>
//                     <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Delivered</option>
//                     <option value="cancelled" ${o.status === "cancelled" ? "selected" : ""}>Cancelled</option>
//                 </select>

//                 <button class="btn btn-sm status-rejected-hover status-rejected  cancelBtn " data-id="${o.id}" ${cancelDisabled}>
//                     Cancel
//                 </button>
//             </div>
//         </div>
//     `;
// }


function orderCard(o) {
    const cancelDisabled = o.status === "cancelled" ? "disabled" : "";

    return `
        <div class="orderCard">

            <!-- Header -->
            <div class="orderCard-header">
                <div>
                    <span class="orderCardId">#${o.id.toString().slice(-6)}</span>
                    <div class="orderDate">
                        ${new Date(o.orderDate).toLocaleDateString()}
                    </div>
                </div>

                <span class="status-badge status-${o.status}">
                    ${o.status}
                </span>
            </div>

            <!-- Body -->
            <div class="orderCard-body">
                <div class="orderMeta">
                    <div>
                        <span class="meta-label">User</span>
                        <span class="meta-value">${o.userId}</span>
                    </div>

                    <div>
                        <span class="meta-label">Total</span>
                        <span class="orderTotal">${o.totalPrice} EGP</span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="orderCard-footer">

                <button class="btn-soft btn-soft-primary viewDetailsBtn" data-id="${o.id}">
                    <i class="bi bi-eye"></i>
                    Details
                </button>

                <select class="statusDropdown" data-id="${o.id}">
                    <option value="pending" ${o.status === "pending" ? "selected" : ""}>Pending</option>
                    <option value="shipped" ${o.status === "shipped" ? "selected" : ""}>Shipped</option>
                    <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Delivered</option>
                    <option value="cancelled" ${o.status === "cancelled" ? "selected" : ""}>Cancelled</option>
                </select>

                <button class="btn-soft btn-soft-danger cancelBtn"
                    data-id="${o.id}" ${cancelDisabled}>
                    Cancel
                </button>

            </div>
        </div>
    `;
}


function attachOrderEvents() {

    // Status change
    document.querySelectorAll(".statusDropdown").forEach(dropdown => {
        dropdown.addEventListener("change", e => {
            const id = e.target.dataset.id;
            const newStatus = e.target.value.toLowerCase();
            const updated = updateOrderStatus(id, newStatus);
            if (!updated) return;

            // Show toast after status update
            showToast(`Order #${id} status updated to ${newStatus}`);

            if (ordersState.statusFilter !== "all" && ordersState.statusFilter !== newStatus) {
                e.target.closest(".orderCard").remove();
            } else {
                const badge = e.target.closest(".orderCard").querySelector(".badge");
                badge.className = `badge bg-${getStatusColor(newStatus)}`;
                badge.textContent = newStatus;
            }

            // Disable cancel button if cancelled
            const cancelBtn = e.target.closest(".orderCard").querySelector(".cancelBtn");
            cancelBtn.disabled = newStatus === "cancelled";

            renderStatusBadges(getAllOrders());
        });
    });

    // Cancel button
    let selectedOrderToCancel = null;
    document.querySelectorAll(".cancelBtn").forEach(btn => {
        btn.addEventListener("click", e => {
            selectedOrderToCancel = e.target.dataset.id;
            const modal = new bootstrap.Modal(document.getElementById("cancelOrderModal"));
            modal.show();
        });
    });


    // View details button
    document.querySelectorAll(".viewDetailsBtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            viewOrderDetails(id);
        });
    });

}


function getStatusColor(status) {
    switch (status) {
        case "pending": return "warning";
        case "shipped": return "primary";
        case "delivered": return "success";
        case "cancelled": return "danger";
        default: return "secondary";
    }
}


function attachFilters() {

    document.getElementById("orderSearch").addEventListener("input", e => {
        ordersState.search = e.target.value.toLowerCase();
        ordersState.currentPage = 1;
        renderOrdersGrid();
    });

    document.getElementById("statusFilter").addEventListener("change", e => {
        ordersState.statusFilter = e.target.value;
        ordersState.currentPage = 1;
        renderOrdersGrid();
    });

    document.getElementById("sortSelect").addEventListener("change", e => {

        const value = e.target.value;

        if (!value) {
            ordersState.sortField = null;
            return renderOrdersGrid();
        }

        const [field, direction] = value.split("-");
        ordersState.sortField = field;
        ordersState.sortDirection = direction;

        renderOrdersGrid();
    });

    document.getElementById("resetFiltersBtn").addEventListener("click", () => {

        ordersState = {
            currentPage: 1,
            rowsPerPage: 6,
            search: "",
            statusFilter: "all",
            sortField: null,
            sortDirection: "desc"
        };

        document.getElementById("orderSearch").value = "";
        document.getElementById("statusFilter").value = "all";
        document.getElementById("sortSelect").value = "";

        renderOrdersGrid();
    });

}

function renderStatusBadges(orders) {
    const container = document.getElementById("ordersStatusBadges");

    const counts = { pending: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });

    container.innerHTML = `
        <div class="d-flex gap-2 flex-wrap">
            <span class="badge statusBadge bg-warning-subtle text-warning px-3 py-2" data-status="pending">Pending ${counts.pending}</span>
            <span class="badge statusBadge bg-primary-subtle text-primary px-3 py-2" data-status="shipped">Shipped ${counts.shipped}</span>
            <span class="badge statusBadge bg-success-subtle text-success px-3 py-2" data-status="delivered">Delivered ${counts.delivered}</span>
            <span class="badge statusBadge bg-danger-subtle text-danger px-3 py-2" data-status="cancelled">Cancelled ${counts.cancelled}</span>
        </div>
    `;

    // Make badges clickable filters
    document.querySelectorAll(".statusBadge").forEach(badge => {
        badge.addEventListener("click", () => {
            ordersState.statusFilter = badge.dataset.status;
            document.getElementById("statusFilter").value = badge.dataset.status;
            ordersState.currentPage = 1;
            renderOrdersGrid();
        });
    });
}


function renderPagination(totalItems) {

    const container = document.getElementById("ordersPagination");
    const totalPages = Math.ceil(totalItems / ordersState.rowsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    let buttons = "";

    for (let i = 1; i <= totalPages; i++) {
        buttons += `
            <button class="page-btn ${i === ordersState.currentPage ? "active-page" : ""}"
                data-page="${i}">
                ${i}
            </button>
        `;
    }

    container.innerHTML = buttons;

    document.querySelectorAll(".page-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            ordersState.currentPage = Number(btn.dataset.page);
            renderOrdersGrid();
        });
    });
}


function initCancelModal() {

    const confirmBtn = document.getElementById("confirmCancelOrderBtn");

    confirmBtn.addEventListener("click", () => {

        if (!selectedOrderToCancel) return;

        cancelOrderById(selectedOrderToCancel);

        selectedOrderToCancel = null;

        const modalElement = document.getElementById("cancelOrderModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        renderOrdersGrid();
    });
}
// Redirect to order details page
function viewOrderDetails(orderId) {
    window.location.href = `../../../pages/profile/order-details.html?id=${orderId}`;
}
