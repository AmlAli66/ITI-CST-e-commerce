import { formatPrice, navigateToProductDetails } from "/js/core/utils.js";

const currentUser = JSON.parse(localStorage.getItem("currentUser"));


if (!currentUser || currentUser.role !== "seller") {

    window.location.href = "/index.html";
}


const CURRENT_SELLER_ID = currentUser ? +currentUser.id : null;



document.getElementById("backBtn")?.addEventListener("click", () => {
    window.history.back();
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/pages/auth/login.html";
});


const sidebar = document.getElementById("sidebar");
const mobileToggle = document.getElementById("mobileMenuToggle");
const closeSidebar = document.getElementById("closeSidebar");
let currentStatusFilter = "all";
let currentSortOrder = "newest";

const toggleSidebar = () => {
    sidebar.classList.toggle("active");
};

mobileToggle?.addEventListener("click", toggleSidebar);
closeSidebar?.addEventListener("click", toggleSidebar);

// Close sidebar when clicking a menu item on mobile
document.querySelectorAll(".nav .nav-item").forEach(item => {
    item.addEventListener("click", () => {
        if (window.innerWidth < 992) {
            sidebar.classList.remove("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {

    await bootstrapData();

    const products = getProducts();
    const orders = getOrders();

    renderStats(products, orders);
    renderProductsTable(products, orders);
    renderOrdersTable(orders);
    initCharts(orders);
    setupNavigation();
    setupAddProduct();
    updatePendingBadge(orders);

    renderTopProductWidget(products, orders);


    document.getElementById("orderStatusFilter").addEventListener("change", function () {
        currentStatusFilter = this.value;
        ordersCurrentPage = 1; // Reset to page 1
        applyOrderFilters();
    });

    document.getElementById("orderSortOrder").addEventListener("change", function () {
        currentSortOrder = this.value;
        applyOrderFilters();
    });

});


/* ===========================
   DATA LAYER (Standalone)
=========================== */

async function bootstrapData() {

    if (!localStorage.getItem("products")) {
        const res = await fetch("../../data/products.json");
        const data = await res.json();
        localStorage.setItem("products", JSON.stringify(data.products || data));
    }

    if (!localStorage.getItem("orders")) {
        localStorage.setItem("orders", JSON.stringify([]));
    }
}

function getProducts() {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    return allProducts.filter(p => +p.sellerId === CURRENT_SELLER_ID);
}


function getOrders() {

    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

    return allOrders.filter(order =>
        order.items.some(item => +item.sellerId === CURRENT_SELLER_ID)
    );
}



function generateTestOrder() {

    let allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];

    // نجيب أول منتج للسيلر
    const sellerProduct = allProducts.find(p => +p.sellerId === CURRENT_SELLER_ID);

    if (!sellerProduct) {
        alert("Add a product first to generate an order.");
        return;
    }

    const quantity = 2;
    const total = sellerProduct.price * quantity;

    const newOrder = {
        id: Date.now(),
        userId: 101,
        items: [
            {
                productId: sellerProduct.id,
                productName: sellerProduct.name,
                quantity: quantity,
                price: sellerProduct.price,
                sellerId: CURRENT_SELLER_ID,
                total: total
            }
        ],
        subtotal: total,
        tax: total * 0.1,
        shipping: 20,
        totalPrice: total + (total * 0.1) + 20,
        address: "Cairo, Egypt",
        paymentMethod: "Cash On Delivery",
        status: "pending",
        orderDate: new Date().toISOString()
    };

    allOrders.push(newOrder);

    localStorage.setItem("orders", JSON.stringify(allOrders));

    showToast("Test order generated successfully 🧪");

    renderAll();
}

/* ===========================
   UI LOGIC
=========================== */

function setupNavigation() {
    const links = document.querySelectorAll(".seller-sidebar .nav-link");

    links.forEach(link => {
        link.addEventListener("click", () => {
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const section = link.dataset.section;

            document.querySelectorAll("main section")
                .forEach(sec => sec.classList.add("d-none"));

            document.getElementById(section + "Section")
                .classList.remove("d-none");
        });
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                document.querySelector('.seller-sidebar').classList.remove('active');
            }
        });
    });
}


/* ===========================
   RENDER STATS
=========================== */

function renderStats(products, orders) {

    const totalRevenue = calculateSellerRevenue(orders);

    const totalOrders = orders.length;
    const activeProducts = products.filter(p => p.stock > 0).length;

    document.getElementById("statsCards").innerHTML = `
<div class="col-xl-4 col-md-6">
    <div class="stat-card card h-100 p-4">
        <div class="d-flex justify-content-between">
            <div>
                <h6>Total Revenue</h6>
                <h3>${formatPrice(totalRevenue)}</h3>
            </div>
            <div class="icon-circle bg-soft-info ">
                <i class="bi bi-currency-dollar"></i>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-4 col-md-6">
    <div class="stat-card card h-100 p-4">
        <div class="d-flex justify-content-between">
            <div>
                <h6>Total Orders</h6>
                <h3>${totalOrders}</h3>
            </div>
            <div class="icon-circle bg-soft-success">
                <i class="bi bi-cart-check"></i>
            </div>
        </div>
    </div>
</div>

<div class="col-xl-4 col-md-12">
    <div class="stat-card card h-100 p-4">
        <div class="d-flex justify-content-between">
            <div>
                <h6>Active Products</h6>
                <h3>${activeProducts}</h3>
            </div>
            <div class="icon-circle bg-soft-warning">
                <i class="bi bi-box-seam"></i>
            </div>
        </div>
    </div>
</div>
`;

}

/* ===========================
   PAGINATION SETTINGS
=========================== */
let productsCurrentPage = 1;
const productsPerPage = 6; // Shows 6 products per page (2 rows of 3)

let ordersCurrentPage = 1;
const ordersPerPage = 8;

/* ===========================
   PRODUCTS TABLE WITH PAGINATION
=========================== */
function renderProductsTable(products, orders) {
    const container = document.getElementById("productsTable");
    const paginationContainer = document.getElementById("productsPagination");

    if (!products.length) {
        container.innerHTML = `<div class="col-12 text-center py-5"><h5>No Products Found</h5></div>`;
        paginationContainer.innerHTML = "";
        return;
    }

    // Pagination Logic
    const totalPages = Math.ceil(products.length / productsPerPage);
    if (productsCurrentPage > totalPages) productsCurrentPage = totalPages;
    const start = (productsCurrentPage - 1) * productsPerPage;
    const paginatedProducts = products.slice(start, start + productsPerPage);

    container.innerHTML = paginatedProducts.map(p => {
        const revenue = getRevenueForProduct(p.id, orders);
        const isLowStock = p.stock < 5;

        return `
            <div class="col-12 col-md-6 col-xl-4">
                <div class="card product-card border-0 h-100">
                    <div class="product-img-container">
                        <img src="${p.image || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${p.name}">
                        ${isLowStock ? '<span class="stock-badge badge-low">Low Stock</span>' : '<span class="stock-badge badge-instock">In Stock</span>'}
                        <div class="product-price-tag">${formatPrice(p.price)}</div>
                    </div>
                    <div class="card-body p-4">
                        <h5 class="card-title fw-bold mb-1 text-truncate">${p.name}</h5>
                        <div class="row g-2 mb-4">
                            <div class="col-6 text-center border-end">
                                <span class="d-block fw-bold">${p.stock}</span>
                                <small class="text-muted">Units Left</small>
                            </div>
                            <div class="col-6 text-center">
                                <span class="d-block fw-bold text-success">${formatPrice(revenue)}</span>
                                <small class="text-muted">Earnings</small>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-action btn-edit flex-grow-1 edit-btn" data-id="${p.id}">Edit</button>
                            <button class="btn btn-action btn-delete delete-btn" data-id="${p.id}"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join("");

    // Render Products Pagination
    renderPagination(totalPages, productsCurrentPage, paginationContainer, (newPage) => {
        productsCurrentPage = newPage;
        renderProductsTable(getProducts(), getOrders());
    });

    attachActionEvents();
}

function getRevenueForProduct(productId, orders) {
    return orders
        .flatMap(o => o.items)
        .filter(i => +i.productId === +productId && +i.sellerId === CURRENT_SELLER_ID)
        .reduce((sum, i) => sum + Number(i.total || 0), 0);
}



/* ===========================
   Orders TABLE with Pagination
=========================== */
function renderOrdersTable(orders) {
    const container = document.getElementById("ordersCardsContainer");
    const paginationContainer = document.getElementById("ordersPagination");

    if (!orders.length) {
        container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="mb-3"><i class="bi bi-bag-x" style="font-size:40px;color:#9ca3af;"></i></div>
            <h5 class="mb-2">No Orders Yet</h5>
            <p class="text-muted">Orders will appear here once customers purchase your products.</p>
        </div>`;
        paginationContainer.innerHTML = "";
        return;
    }

    // Pagination
    const totalPages = Math.ceil(orders.length / ordersPerPage);
    if (ordersCurrentPage > totalPages) ordersCurrentPage = totalPages;
    const start = (ordersCurrentPage - 1) * ordersPerPage;
    const paginatedOrders = orders.slice(start, start + ordersPerPage);

    container.innerHTML = paginatedOrders.map(order => {
        const sellerTotal = order.items
            .filter(i => +i.sellerId === CURRENT_SELLER_ID)
            .reduce((sum, i) => sum + Number(i.total || 0), 0);

        const date = new Date(order.orderDate);

        return `
        <div class="col-12 col-md-6 col-xl-4">
            <div class="order-card p-4 h-100 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="order-id-badge">#${order.id}</span>
                    <span class="badge rounded-pill px-3 py-2 bg-soft-${getStatusColor(order.status)} text-capitalize">
                        ${order.status}
                    </span>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-6">
                        <div class="label">Date</div>
                        <div class="fw-bold text-dark small">${date.toLocaleDateString()}</div>
                        <div class="text-muted" style="font-size: 11px;">${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div class="col-6 text-end">
                        <div class="label">Your Earnings</div>
                        <div class="fw-bold text-primary fs-5">${formatPrice(sellerTotal)}</div>
                    </div>
                </div>

                <div class="mt-auto pt-3 border-top">
                    <button class="btn btn-light w-100 rounded-3 view-order" data-id="${order.id}">
                        <i class="bi bi-eye-fill me-2"></i> View Order Details
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join("");

    renderPagination(totalPages, ordersCurrentPage, paginationContainer, (newPage) => {
        ordersCurrentPage = newPage;
        // renderOrdersTable(getOrders());
        applyOrderFilters();
    });
    // Render Pagination
    // renderPagination(totalPages, paginationContainer);
    attachViewOrderEvents();
}


function applyOrderFilters() {
    let filteredOrders = getOrders();

    // 1. Filter by Status
    if (currentStatusFilter !== "all") {
        filteredOrders = filteredOrders.filter(o => o.status.toLowerCase() === currentStatusFilter);
    }

    // 2. Sort by Date
    filteredOrders.sort((a, b) => {
        const dateA = new Date(a.orderDate);
        const dateB = new Date(b.orderDate);
        return currentSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    renderOrdersTable(filteredOrders);
}
/* ===========================
   GENERIC PAGINATION RENDERER
=========================== */
function renderPagination(totalPages, current, container, onPageChange) {
    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="page-btn ${i === current ? 'active-page' : ''}" data-page="${i}">
                ${i}
            </button>`;
    }
    container.innerHTML = html;

    container.querySelectorAll(".page-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const newPage = parseInt(this.dataset.page);
            onPageChange(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}
/* ===========================
   CHART
=========================== */
let salesChartInstance = null;

function initCharts(orders) {

    const ctx = document.getElementById("salesChart");

    if (salesChartInstance) {
        salesChartInstance.destroy();
    }

    // نحسب revenue لكل شهر
    const monthlyRevenue = Array(12).fill(0);

    orders.forEach(order => {

        const month = new Date(order.orderDate).getMonth();

        order.items.forEach(item => {
            if (+item.sellerId === CURRENT_SELLER_ID) {
                monthlyRevenue[month] += Number(item.total || 0);
            }
        });

    });

    salesChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ],
            datasets: [{
                label: "Monthly Revenue",
                data: monthlyRevenue,
                borderColor: "#0d6efd",
                backgroundColor: "rgba(13,110,253,0.1)",
                fill: true,
                tension: 0.3
            }]
        }
    });
}


/* ===========================
    TOP PRODUCT WIDGET
=========================== */
function renderTopProductWidget(products, orders) {

    const salesMap = {};

    orders.forEach(order => {
        order.items.forEach(item => {

            if (+item.sellerId === CURRENT_SELLER_ID) {

                if (!salesMap[item.productId]) {
                    salesMap[item.productId] = 0;
                }

                salesMap[item.productId] += item.quantity;
            }

        });
    });

    let topProductId = null;
    let maxSales = 0;

    for (let id in salesMap) {
        if (salesMap[id] > maxSales) {
            maxSales = salesMap[id];
            topProductId = id;
        }
    }

    const topProduct = products.find(p => +p.id === +topProductId);
    // const topProduct = 0;


    const container = document.getElementById("topProductWidget");

    if (!topProduct) {
        container.innerHTML = `
            <h6 class="">Top Product</h6>
            <div class=" text-center  py-4">
            <img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/icons/emoji-frown.svg" alt="No Sales" width="50">
            <p class="text-muted">No sales yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
    <div class="d-flex flex-column h-100">
        <h6 class="text-muted mb-3">Top Product</h6>

        <div class="text-center mb-3">
            <div class="top-product-img-wrapper mx-auto">
                <img src="${topProduct.image || 'https://via.placeholder.com/150'}"
                     alt="${topProduct.name}">
            </div>
        </div>

        <h5 class="fw-bold text-center">${topProduct.name}</h5>

        <p class="text-muted text-center mb-1">
            ${maxSales} units sold
        </p>

        <div class="mt-auto text-center">
            <span class="badge bg-soft-success px-3 py-2">
                Best Seller
            </span>
        </div>
    </div>
`;

}


function renderAll() {
    const products = getProducts();
    const orders = getOrders();

    renderStats(products, orders);
    renderProductsTable(products, orders);
    // renderOrdersTable(orders);
    applyOrderFilters();
    initCharts(orders);
}


let editingProductId = null;

let imageFile = null;

/* ===========================
   PRODUCT ACTIONS (Fixed)
=========================== */

let mainImageBase64 = null;
let galleryImagesBase64 = [];

// Helper to convert File to Base64 (Promise-based to prevent logic errors)
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

document.getElementById("productImage").addEventListener("change", async function () {
    if (this.files[0]) mainImageBase64 = await toBase64(this.files[0]);
});

document.getElementById("productGallery").addEventListener("change", async function () {
    galleryImagesBase64 = [];
    const files = Array.from(this.files);
    for (const file of files) {
        const base64 = await toBase64(file);
        galleryImagesBase64.push(base64);
    }
});

function setupAddProduct() {
    const form = document.getElementById("addProductForm");
    const modalElement = document.getElementById("addProductModal");

    // Listen for the modal opening
    modalElement.addEventListener('show.bs.modal', function (event) {
        // event.relatedTarget is the button that clicked to open the modal
        const button = event.relatedTarget;

        if (button && !button.classList.contains('edit-btn')) {
            resetProductForm();
        }
    });

    resetProductForm();
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("productName").value.trim();
        const price = parseFloat(document.getElementById("productPrice").value);
        const stock = parseInt(document.getElementById("productStock").value);
        const description = document.getElementById("productDescription").value.trim();
        const category = document.getElementById("productCategory").value;
        const brand = document.getElementById("productBrand").value.trim(); // FIXED: Defined brand
        const discount = parseFloat(document.getElementById("productDiscount").value) || 0;

        // Validation
        if (!name || name.length < 3) return alert("Valid name required");
        if (isNaN(price) || price <= 0) return alert("Price must be > 0");
        if (isNaN(stock) || stock < 0) return alert("Stock cannot be negative");
        if (!category) return alert("Select a category");
        if (!editingProductId && !mainImageBase64) return alert("Upload a main image");

        const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
        let allProducts = JSON.parse(localStorage.getItem("products")) || [];

        if (editingProductId) {
            const index = allProducts.findIndex(p => String(p.id) === String(editingProductId));
            if (index !== -1) {
                allProducts[index] = {
                    ...allProducts[index],
                    name,
                    description,
                    price,
                    discount,
                    finalPrice,
                    stock,
                    category,
                    brand,
                    image: mainImageBase64 || allProducts[index].image,
                    detailImages: galleryImagesBase64.length > 0 ? galleryImagesBase64 : allProducts[index].detailImages
                };
                showToast("Product updated successfully ✏");
            }
        } else {
            const newProduct = {
                id: String(Date.now()),
                name,
                description,
                price,
                discount,
                finalPrice,
                image: mainImageBase64 || "",
                detailImages: galleryImagesBase64,
                category,
                brand, // FIXED: Now defined
                sellerId: String(CURRENT_SELLER_ID),
                sellerName: currentUser.name || "Seller",
                stock,
                rating: 0,
                reviewCount: 0,
                status: "approved",
                dateAdded: new Date().toISOString().split("T")[0],
                featured: false
            };
            allProducts.push(newProduct);
            showToast("Product added successfully 🎉");
        }

        localStorage.setItem("products", JSON.stringify(allProducts));

        // Reset state
        editingProductId = null;
        mainImageBase64 = null;
        galleryImagesBase64 = [];
        form.reset();
        document.querySelector("#addProductModal .modal-title").textContent = "Add New Product";

        bootstrap.Modal.getInstance(document.getElementById("addProductModal")).hide();
        renderAll();
    });
}

function editProduct(id) {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    const product = allProducts.find(p => String(p.id) === String(id));

    if (!product) return;

    editingProductId = id;

    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("productDescription").value = product.description || "";
    document.getElementById("productDiscount").value = product.discount || 0; // Fixed key name
    document.getElementById("productCategory").value = product.category || "";
    document.getElementById("productBrand").value = product.brand || "";

    document.querySelector("#addProductModal .modal-title").textContent = "Edit Product";

    const modal = new bootstrap.Modal(document.getElementById("addProductModal"));
    modal.show();
}

function resetProductForm() {
    const form = document.getElementById("addProductForm");
    form.reset();

    editingProductId = null;
    mainImageBase64 = null;
    galleryImagesBase64 = [];

    // Clear file inputs manually as form.reset() sometimes misses data variables
    document.getElementById("productImage").value = "";
    document.getElementById("productGallery").value = "";

    document.querySelector("#addProductModal .modal-title").textContent = "Add New Product";
}


// عند الضغط على Delete في المودال
document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
    if (productToDelete) {
        let allProducts = JSON.parse(localStorage.getItem("products")) || [];
        allProducts = allProducts.filter(p => +p.id !== +productToDelete);
        localStorage.setItem("products", JSON.stringify(allProducts));
        renderAll();
        showToast("Product deleted successfully 🗑");
        productToDelete = null;

        const modal = bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal"));
        modal.hide();
    }
});


// Calculate total revenue for the current seller based on orders data
function calculateSellerRevenue(orders) {

    let revenue = 0;

    orders.forEach(order => {

        order.items.forEach(item => {

            if (+item.sellerId === CURRENT_SELLER_ID) {
                revenue += Number(item.total || 0);
            }

        });

    });

    return revenue;
}

function updatePendingBadge(orders) {

    const pendingCount = orders.filter(o => o.status === "pending").length;
    const badge = document.getElementById("pendingBadge");

    if (pendingCount > 0) {
        badge.textContent = pendingCount;
        badge.classList.remove("d-none");
    } else {
        badge.classList.add("d-none");
    }
}


function showToast(message) {
    const toastEl = document.getElementById("liveToast");
    document.getElementById("toastMessage").textContent = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Search functionality
document.getElementById("productSearch").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const allProducts = getProducts();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    renderProductsTable(filtered);
});


let productToDelete = null;

function attachActionEvents() {

    document.querySelectorAll(".view-product-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const id = this.dataset.id;
            navigateToProductDetails(id);
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const id = this.dataset.id;
            editProduct(id);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            productToDelete = this.dataset.id;
            const modal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));
            modal.show();
        });
    });
}


function attachStatusEvents() {

    document.querySelectorAll(".status-select").forEach(select => {

        select.addEventListener("change", function () {

            const orderId = this.dataset.id;
            const newStatus = this.value;

            let allOrders = JSON.parse(localStorage.getItem("orders")) || [];

            const orderIndex = allOrders.findIndex(o => +o.id === +orderId);

            if (orderIndex !== -1) {

                allOrders[orderIndex].status = newStatus;

                localStorage.setItem("orders", JSON.stringify(allOrders));

                showToast("Order status updated successfully 🚚");

                renderAll();
            }
        });

    });
}


function attachViewOrderEvents() {
    document.querySelectorAll(".view-order").forEach(btn => {
        btn.addEventListener("click", function () {
            const orderId = this.dataset.id;
            const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
            const allProducts = JSON.parse(localStorage.getItem("products")) || [];
            const order = allOrders.find(o => +o.id === +orderId);

            if (!order) return;

            // Filter items belonging to this seller
            const sellerItems = order.items.filter(i => +i.sellerId === CURRENT_SELLER_ID);

            document.getElementById("orderDetailsBody").innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-3">
                    <div>
                        <small class="text-muted d-block">Order Date</small>
                        <span class="fw-bold">${new Date(order.orderDate).toLocaleDateString()} ${new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="text-end">
                        <small class="text-muted d-block">Status</small>
                        <span class="badge bg-soft-${getStatusColor(order.status)} text-capitalize p-2 px-3">${order.status}</span>
                    </div>
                </div>

                <h6 class="fw-bold mb-3">Products in this Order</h6>
                <div class="order-items-list">
                    ${sellerItems.map(item => {
                // Find the actual product to get the image
                const productData = allProducts.find(p => +p.id === +item.productId);
                const imgUrl = productData?.image || 'https://via.placeholder.com/60';

                return `
                            <div class="d-flex align-items-center mb-3 p-2 border rounded-3">
                                <img src="${imgUrl}" class="rounded-2 me-3" style="width: 60px; height: 60px; object-fit: cover;">
                                <div class="flex-grow-1">
                                    <h6 class="mb-0 fw-bold small">${item.productName}</h6>
                                    <small class="text-muted">Qty: ${item.quantity} × ${formatPrice(item.price)}</small>
                                </div>
                                <div class="text-end">
                                    <span class="fw-bold text-primary">${formatPrice(item.total)}</span>
                                </div>
                            </div>
                        `;
            }).join("")}
                </div>

                <div class="mt-4 pt-3 border-top">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted">Subtotal for your items:</span>
                        <span class="fw-bold">${formatPrice(sellerItems.reduce((sum, i) => sum + i.total, 0))}</span>
                    </div>
                    <div class="p-3 rounded-3 bg-soft-primary mt-3">
                        <small class="d-block text-muted">Shipping Address</small>
                        <p class="mb-0 small fw-medium text-dark"><i class="bi bi-geo-alt-fill me-1"></i> ${order.address || 'No address provided'}</p>
                    </div>
                </div>
            `;

            const modal = new bootstrap.Modal(document.getElementById("orderDetailsModal"));
            modal.show();
        });
    });
}

function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'warning';
        case 'shipped':
        case 'delivered':
            return 'success';
        case 'cancelled':
        case 'rejected':
            return 'danger';
        case 'processing':
            return 'info';
        default:
            return 'primary';
    }
}
// Update Search to reset page to 1
document.getElementById("productSearch").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const allProducts = getProducts();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    productsCurrentPage = 1; // Reset to first page on search
    renderProductsTable(filtered, getOrders());
});

