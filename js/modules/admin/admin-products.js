import { getAllProducts, saveProducts } from "../../core/products-service.js";
import { showToast } from "../../core/utils.js";
import { navigateToProductDetails } from "../../core/utils.js";

let deleteProductId = null;
let selectedProducts = new Set();
let pendingBulkStatus = null;
let bulkModalInstance = null;


let productsState = {
    currentPage: 1,
    rowsPerPage: 6,
    search: "",
    statusFilter: "all",
    categoryFilter: "all",
    sellerFilter: "all",
    sortField: null,
    sortDirection: "asc"
};



export function renderProducts() {
    const container = document.getElementById("adminProducts");
    container.classList.remove("hidden");

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold">Products Moderation</h3>
<div class="d-flex gap-2 align-items-center">

    <input id="productSearch" 
           class="form-control form-control-sm" 
           placeholder="Search product...">

    <button class="btn btn-outline-dark btn-sm"
            data-bs-toggle="offcanvas"
            data-bs-target="#productsFilterDrawer">
        <i class="bi bi-sliders"></i> Filters
    </button>

</div>

        </div>
<div id="bulkToolbar" class="bulk-toolbar hidden">
    <div class="bulk-content">

        <!-- Left side -->
        <div class="bulk-left">
            <div class="bulk-counter">
                <span id="selectedCount">0</span>
                <small>Selected</small>
            </div>

            <button id="deselectAllBtn" class="btn btn-sm btn-light">
                <i class="bi bi-x-circle"></i> Clear
            </button>
        </div>

        <!-- Divider -->
        <div class="bulk-divider"></div>

        <!-- Right side -->
        <div class="bulk-actions">
            <button id="bulkApproveBtn" class="btn status-approved status-approved-hover  btn-sm">
                <i class="bi bi-check-circle"></i> Approve
            </button>

            <button id="bulkRejectBtn" class="btn status-rejected status-pending-hover btn-sm">
                <i class="bi bi-x-circle"></i> Reject
            </button>
        </div>
    </div>
</div>


<div class="bulk-select-bar mb-3 d-flex align-items-center gap-3">

    <div class="form-check">
        <input class="form-check-input" type="checkbox" id="selectPageCheckbox">
        <label class="form-check-label fw-semibold">
            Select Page
        </label>
    </div>

    <button id="selectFilteredBtn" class="btn btn-sm btn-outline-primary">
        Select All Filtered
    </button>

    <button id="clearSelectionBtn" class="btn btn-sm btn-outline-secondary">
        Clear Selection
    </button>

</div>


        <div id="productsGrid" class="row g-4"></div>

        <div id="productsPagination" class="mt-4 d-flex justify-content-end"></div>

        <div class="offcanvas offcanvas-end" 
     tabindex="-1" 
     id="productsFilterDrawer">

  <div class="offcanvas-header border-bottom">
    <h5 class="offcanvas-title fw-bold">
        <i class="bi bi-sliders me-2"></i>
        Filters
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
  </div>

  <div class="offcanvas-body">

    <!-- Sort -->
    <div class="mb-4">
        <label class="form-label fw-semibold">Sort By</label>
        <select id="sortSelect" class="form-select">
            <option value="">Default</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
        </select>
    </div>

    <!-- Status -->
    <div class="mb-4">
        <label class="form-label fw-semibold">Status</label>
        <select id="statusFilter" class="form-select">
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
        </select>
    </div>

    <!-- Category -->
    <div class="mb-4">
        <label class="form-label fw-semibold">Category</label>
        <select id="categoryFilter" class="form-select">
            <option value="all">All Categories</option>
        </select>
    </div>

    <!-- Seller -->
    <div class="mb-4">
        <label class="form-label fw-semibold">Seller</label>
        <select id="sellerFilter" class="form-select">
            <option value="all">All Sellers</option>
        </select>
    </div>

    <hr>

    <button id="resetFiltersBtn" class="btn btn-light w-100">
        Reset Filters
    </button>

  </div>
</div>

    `;

    bulkModalInstance = new bootstrap.Modal(
        document.getElementById("bulkConfirmModal")
    );


    attachFilters();
    populateDynamicFilters(getAllProducts());
    renderProductsGrid();
}

function attachFilters() {
    //search
    document.getElementById("productSearch").addEventListener("input", e => {
        productsState.search = e.target.value.toLowerCase();
        productsState.currentPage = 1;
        renderProductsGrid();
    });

    //status filter
    document.getElementById("statusFilter").addEventListener("change", e => {
        productsState.statusFilter = e.target.value;
        productsState.currentPage = 1;
        renderProductsGrid();
    });

    //sorting
    document.getElementById("sortSelect").addEventListener("change", e => {
        const value = e.target.value;

        if (!value) {
            productsState.sortField = null;
            return renderProductsGrid();
        }

        const [field, direction] = value.split("-");
        productsState.sortField = field;
        productsState.sortDirection = direction;

        renderProductsGrid();
    });

    //category filter
    document.getElementById("categoryFilter").addEventListener("change", e => {
        productsState.categoryFilter = e.target.value;
        productsState.currentPage = 1;
        renderProductsGrid();
    });

    //seller filter
    document.getElementById("sellerFilter").addEventListener("change", e => {
        productsState.sellerFilter = e.target.value;
        productsState.currentPage = 1;
        renderProductsGrid();
    });

    //reset filters
    document.getElementById("resetFiltersBtn").addEventListener("click", () => {
        productsState.statusFilter = "all";
        productsState.categoryFilter = "all";
        productsState.sellerFilter = "all";
        productsState.sortField = null;
        productsState.search = "";

        document.getElementById("statusFilter").value = "all";
        document.getElementById("categoryFilter").value = "all";
        document.getElementById("sellerFilter").value = "all";
        document.getElementById("sortSelect").value = "";
        document.getElementById("productSearch").value = "";

        renderProductsGrid();
    });


}

function populateDynamicFilters(products) {
    const categorySelect = document.getElementById("categoryFilter");
    const sellerSelect = document.getElementById("sellerFilter");

    const categories = [...new Set(products.map(p => p.category))];
    const sellers = [...new Set(products.map(p => p.sellerName))];

    categorySelect.innerHTML = `
        <option value="all">All Categories</option>
        ${categories.map(c => `<option value="${c}">${c}</option>`).join("")}
    `;

    sellerSelect.innerHTML = `
        <option value="all">All Sellers</option>
        ${sellers.map(s => `<option value="${s}">${s}</option>`).join("")}
    `;
}

function renderProductsGrid() {
    const grid = document.getElementById("productsGrid");
    const pagination = document.getElementById("productsPagination");

    let products = getAllProducts();

    // Search
    if (productsState.search) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(productsState.search)
        );
    }

    // Status filter
    if (productsState.statusFilter !== "all") {
        products = products.filter(p =>
            p.status === productsState.statusFilter
        );
    }

    // Category filter
    if (productsState.categoryFilter !== "all") {
        products = products.filter(p =>
            p.category === productsState.categoryFilter
        );
    }

    // Seller filter
    if (productsState.sellerFilter !== "all") {
        products = products.filter(p =>
            p.sellerName === productsState.sellerFilter
        );
    }

    // Sorting
    if (productsState.sortField) {
        products.sort((a, b) => {
            let aValue, bValue;

            if (productsState.sortField === "price") {
                aValue = a.finalPrice;
                bValue = b.finalPrice;
            }

            if (productsState.sortField === "date") {
                aValue = new Date(a.dateAdded || a.date || 0);
                bValue = new Date(b.dateAdded || b.date || 0);
            }

            if (aValue < bValue)
                return productsState.sortDirection === "asc" ? -1 : 1;

            if (aValue > bValue)
                return productsState.sortDirection === "asc" ? 1 : -1;

            return 0;
        });
    }

    const currentIds = new Set(products.map(p => p.id));
    selectedProducts = new Set(
        [...selectedProducts].filter(id => currentIds.has(id))
    );



    if (!products.length) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-box fs-1"></i>
                <p>No products found</p>
            </div>
        `;
        pagination.innerHTML = "";
        return;
    }



    //Pagination
    const start = (productsState.currentPage - 1) * productsState.rowsPerPage;
    const paginated = products.slice(start, start + productsState.rowsPerPage);

    grid.innerHTML = paginated.map(product => productCard(product)).join("");

    renderPagination(products.length);
    attachProductActions();
}


function productCard(product) {
    return `
        <div class="col-md-6 col-lg-4">
            <div class="product-card position-relative ${selectedProducts.has(product.id) ? "selected-card" : ""}">
                
                <div class="form-check position-absolute top-0 start-0 m-3 z-1">
                    <input class="form-check-input product-checkbox" 
                           type="checkbox" 
                           data-id="${product.id}" 
                           ${selectedProducts.has(product.id) ? "checked" : ""}>
                </div>

                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div class="product-info">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="product-category">${product.category}</div>
                            <h6 class="product-title">${product.name}</h6>
                        </div>
                        <span class="status-badge ${statusBadge(product.status)}">
                            ${product.status}
                        </span>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="product-price text-success">${product.finalPrice} EGP</span>
                        <small class="text-muted">Stock: ${product.stock}</small>
                    </div>
                </div>

                <div class="product-actions">
                    <button class="btn btn-soft btn-soft-primary view-btn" data-id="${product.id}">
                        View
                    </button>

                    <button 
                        class="btn btn-soft btn-soft-primary approve-btn ${product.status === "approved" ? "disabled opacity-75" : ""}" 
                        data-id="${product.id}"
                        ${product.status === "approved" ? "disabled" : ""}>
                        ${product.status === "approved" ? "Approved" : "Approve"}
                    </button>

                    <button 
                        class="btn btn-soft btn-soft-danger reject-btn ${product.status === "rejected" ? "disabled opacity-75" : ""}" 
                        data-id="${product.id}"
                        ${product.status === "rejected" ? "disabled" : ""}>
                        ${product.status === "rejected" ? "Rejected" : "Reject"}
                    </button>

                    <button class="btn btn-soft btn-soft-primary feature-btn" data-id="${product.id}">
                        ${product.featured ? "Unfeature" : "Feature"}
                    </button>
                    
                    <button class="btn btn-soft btn-soft-danger delete-btn" data-id="${product.id}">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

function statusBadge(status) {
    if (status === "approved") return "status-approved";
    if (status === "pending") return "status-pending";
    if (status === "rejected") return "status-rejected";
    return "bg-secondary text-white"; // Fallback
}



function attachProductActions() {
    attachCardDelegation();
    attachSelectionControls();
    attachBulkActions();
}
function attachCardDelegation() {
    const grid = document.getElementById("productsGrid");

    grid.addEventListener("click", e => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const id = btn.dataset.id;
        if (!id) return;

        if (btn.classList.contains("view-btn")) {
            navigateToProductDetails(id);
        }


        if (btn.classList.contains("approve-btn")) {
            updateStatus(id, "approved");
        }

        if (btn.classList.contains("reject-btn")) {
            updateStatus(id, "rejected");
        }

        if (btn.classList.contains("feature-btn")) {
            toggleFeature(id);
        }

        if (btn.classList.contains("delete-btn")) {
            deleteProductId = id;
            new bootstrap.Modal(
                document.getElementById("deleteModal")
            ).show();
        }

    });

    // checkbox delegation
    grid.addEventListener("change", e => {
        if (!e.target.classList.contains("product-checkbox")) return;

        const id = e.target.dataset.id;

        if (e.target.checked) {
            selectedProducts.add(id);
        } else {
            selectedProducts.delete(id);
        }

        refreshSelectionUI();
    });
}


function attachSelectionControls() {

    // Select page
    document.getElementById("selectPageCheckbox")
        ?.addEventListener("change", e => {

            const isChecked = e.target.checked;

            document.querySelectorAll(".product-checkbox").forEach(cb => {
                cb.checked = isChecked;

                if (isChecked) {
                    selectedProducts.add(cb.dataset.id);
                } else {
                    selectedProducts.delete(cb.dataset.id);
                }
            });

            refreshSelectionUI();
        });

    // Select filtered
    document.getElementById("selectFilteredBtn")
        ?.addEventListener("click", () => {

            const filtered = applyCurrentFilters();
            filtered.forEach(p => selectedProducts.add(p.id));

            refreshSelectionUI();
        });

    // Clear selection (single handler for both buttons)
    ["deselectAllBtn", "clearSelectionBtn"].forEach(id => {
        document.getElementById(id)
            ?.addEventListener("click", () => {
                selectedProducts.clear();
                refreshSelectionUI();
            });
    });
}


function attachBulkActions() {

    document.getElementById("bulkApproveBtn")
        ?.addEventListener("click", () => {
            openBulkConfirm("approved");
        });

    document.getElementById("bulkRejectBtn")
        ?.addEventListener("click", () => {
            openBulkConfirm("rejected");
        });
}


function updateStatus(id, newStatus) {
    const products = getAllProducts();
    const product = products.find(p => p.id === id);

    if (!product) return;

    // Prevent redundant update
    if (product.status === newStatus) {
        showToast(`Already ${newStatus}`);
        return;
    }

    product.status = newStatus;

    saveProducts(products);
    showToast(`Product ${newStatus}`);
    renderProductsGrid();
}


function toggleFeature(id) {
    const products = getAllProducts();
    const product = products.find(p => p.id === id);

    product.featured = !product.featured;

    saveProducts(products);
    showToast("Feature updated");
    renderProductsGrid();
}

function handleDeleteConfirm() {
    if (!deleteProductId) return;

    let products = getAllProducts();
    products = products.filter(p => p.id !== deleteProductId);

    saveProducts(products);

    // Fix pagination edge case
    const totalPages = Math.ceil(products.length / productsState.rowsPerPage);
    if (productsState.currentPage > totalPages) {
        productsState.currentPage = totalPages || 1;
    }

    bootstrap.Modal
        .getInstance(document.getElementById("deleteModal"))
        .hide();

    showToast("Product deleted successfully");

    deleteProductId = null;

    renderProductsGrid();
}

function renderPagination(totalItems) {
    const container = document.getElementById("productsPagination");
    const totalPages = Math.ceil(totalItems / productsState.rowsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    let buttons = "";

    for (let i = 1; i <= totalPages; i++) {
        buttons += `
            <button class="page-btn ${i === productsState.currentPage ? "active-page" : ""}"
                data-page="${i}">
                ${i}
            </button>
        `;
    }

    container.innerHTML = buttons;

    document.querySelectorAll(".page-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            productsState.currentPage = Number(btn.dataset.page);
            renderProductsGrid();
        });
    });
}

function updateBulkToolbar() {
    const toolbar = document.getElementById("bulkToolbar");
    const countElement = document.getElementById("selectedCount");

    const count = selectedProducts.size;
    countElement.textContent = count;

    if (count > 0) {
        toolbar.classList.remove("hidden");
        setTimeout(() => {
            toolbar.classList.add("show");
        }, 10);
    } else {
        toolbar.classList.remove("show");
        setTimeout(() => {
            toolbar.classList.add("hidden");
        }, 300);
    }
}


function bulkUpdateStatus(newStatus) {
    if (selectedProducts.size === 0) return;

    const products = getAllProducts();

    products.forEach(p => {
        if (selectedProducts.has(p.id)) {
            p.status = newStatus;
        }
    });

    saveProducts(products);

    showToast(`${selectedProducts.size} products ${newStatus}`);

    selectedProducts.clear();

    renderProductsGrid();
}

function refreshSelectionUI() {
    updateBulkToolbar();
    renderProductsGrid();
}


//reusable filter (helper func)
function applyCurrentFilters() {
    let products = getAllProducts();

    if (productsState.search) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(productsState.search)
        );
    }

    if (productsState.statusFilter !== "all") {
        products = products.filter(p =>
            p.status === productsState.statusFilter
        );
    }

    if (productsState.categoryFilter !== "all") {
        products = products.filter(p =>
            p.category === productsState.categoryFilter
        );
    }

    if (productsState.sellerFilter !== "all") {
        products = products.filter(p =>
            p.sellerName === productsState.sellerFilter
        );
    }

    return products;
}


function syncSelectAllCheckbox() {
    const selectAll = document.getElementById("selectAllProducts");
    if (!selectAll) return;

    const pageCheckboxes = document.querySelectorAll(".product-checkbox");

    const allChecked = [...pageCheckboxes].every(cb =>
        selectedProducts.has(cb.dataset.id)
    );

    const noneChecked = [...pageCheckboxes].every(cb =>
        !selectedProducts.has(cb.dataset.id)
    );

    selectAll.checked = allChecked;
    selectAll.indeterminate = !allChecked && !noneChecked;
}


function openBulkConfirm(status) {
    pendingBulkStatus = status;

    document.getElementById("bulkConfirmTitle").textContent =
        status === "approved" ? "Approve Products?" : "Reject Products?";

    document.getElementById("bulkConfirmText").textContent =
        `This will update ${selectedProducts.size} selected products.`;

    bulkModalInstance.show();
}


document.getElementById("confirmBulkBtn")
    ?.addEventListener("click", () => {

        if (!pendingBulkStatus) return;

        bulkUpdateStatus(pendingBulkStatus);

        bootstrap.Modal
            .getInstance(document.getElementById("bulkConfirmModal"))
            .hide();

        pendingBulkStatus = null;
    });


document.addEventListener("click", function (e) {
    if (e.target.id === "confirmDeleteBtn") {
        handleDeleteConfirm();
    }
});



