import { getAllProducts, saveProducts } from "../../core/products-service.js";
import { showToast } from "../../core/utils.js";

let productsState = {
    currentPage: 1,
    rowsPerPage: 6,
    search: "",
    statusFilter: "all"
};

export function renderProducts() {
    const container = document.getElementById("adminProducts");
    container.classList.remove("hidden");

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold">Products Moderation</h3>
            <div class="d-flex gap-2">
                <input id="productSearch" class="form-control form-control-sm" placeholder="Search product...">
                <select id="statusFilter" class="form-select form-select-sm">
                    <option value="all">All</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
        </div>

        <div id="productsGrid" class="row g-4"></div>

        <div id="productsPagination" class="mt-4 d-flex justify-content-end"></div>
    `;

    attachFilters();
    renderProductsGrid();
}

function attachFilters() {
    document.getElementById("productSearch").addEventListener("input", e => {
        productsState.search = e.target.value.toLowerCase();
        productsState.currentPage = 1;
        renderProductsGrid();
    });

    document.getElementById("statusFilter").addEventListener("change", e => {
        productsState.statusFilter = e.target.value;
        productsState.currentPage = 1;
        renderProductsGrid();
    });
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

    const start = (productsState.currentPage - 1) * productsState.rowsPerPage;
    const paginated = products.slice(start, start + productsState.rowsPerPage);

    grid.innerHTML = paginated.map(product => productCard(product)).join("");

    renderPagination(products.length);
    attachProductActions();
}


function productCard(product) {
    return `
        <div class="col-md-6 col-lg-4">
            <div class="user-card">
                <img src="${product.image}" 
                     class="img-fluid rounded-3 mb-2" 
                     style="height:180px; object-fit:cover;">

                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="fw-bold mb-0">${product.name}</h6>
                    <span class="badge ${statusBadge(product.status)}">
                        ${product.status}
                    </span>
                </div>

                <small class="text-muted">${product.category}</small>

                <div class="d-flex justify-content-between mt-2">
                    <span class="fw-bold text-success">${product.finalPrice} EGP</span>
                    <small>Stock: ${product.stock}</small>
                </div>

                <div class="d-flex gap-2 mt-3 flex-wrap">
                    <button class="btn btn-sm btn-success approve-btn" data-id="${product.id}">
                        Approve
                    </button>
                    <button class="btn btn-sm btn-warning reject-btn" data-id="${product.id}">
                        Reject
                    </button>
                    <button class="btn btn-sm btn-dark feature-btn" data-id="${product.id}">
                        ${product.featured ? "Unfeature" : "Feature"}
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

function statusBadge(status) {
    if (status === "approved") return "bg-success";
    if (status === "pending") return "bg-warning text-dark";
    if (status === "rejected") return "bg-danger";
    return "bg-secondary";
}
function attachProductActions() {
    document.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", () => updateStatus(btn.dataset.id, "approved"));
    });

    document.querySelectorAll(".reject-btn").forEach(btn => {
        btn.addEventListener("click", () => updateStatus(btn.dataset.id, "rejected"));
    });

    document.querySelectorAll(".feature-btn").forEach(btn => {
        btn.addEventListener("click", () => toggleFeature(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
    });
}


function updateStatus(id, newStatus) {
    const products = getAllProducts();
    const product = products.find(p => p.id === id);

    if (!product) return;

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

function deleteProduct(id) {
    let products = getAllProducts();
    products = products.filter(p => p.id !== id);

    saveProducts(products);
    showToast("Product deleted");
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
