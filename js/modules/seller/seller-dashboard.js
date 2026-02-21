import { formatPrice } from "/js/core/utils.js";
const CURRENT_SELLER_ID = 1;


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
        shippingAddress: "Cairo, Egypt",
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
            <div class="icon-circle bg-primary">
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
            <div class="icon-circle bg-success">
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
            <div class="icon-circle bg-warning">
                <i class="bi bi-box-seam"></i>
            </div>
        </div>
    </div>
</div>
`;

}


/* ===========================
   PRODUCTS TABLE
=========================== */
let currentPage = 1;
const productsPerPage = 5;

function renderProductsTable(products, orders) {
    const totalPages = Math.ceil(products.length / productsPerPage);
    const start = (currentPage - 1) * productsPerPage;
    const paginatedProducts = products.slice(start, start + productsPerPage);

    if (!products.length) {
        document.getElementById("productsTable").innerHTML = `
            <div class="text-center py-5">
                <h5 class="mb-3">No Products Yet</h5>
                <p class="text-muted">Start by adding your first product 🚀</p>
                <button class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#addProductModal">
                    + Add Product
                </button>
            </div>
        `;
        return;
    }

    let tableHTML = `
        <table class="table table-hover align-middle">
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Revenue</th>
                <th class="text-end">Actions</th>
            </tr>
        </thead>
        <tbody>
        ${paginatedProducts.map(p => {
        const revenue = getRevenueForProduct(p.id, orders);
        return `
            <tr>
                <td>${p.image ? `<img src="${p.image}" alt="${p.name}" width="50" class="rounded">` : `<div class="bg-secondary rounded text-light d-flex justify-content-center align-items-center" style="width:50px;height:70px">No</div>`}</td>
                <td>${p.name}</td>
                <td>${formatPrice(p.price)}</td>
                <td>${p.stock} ${p.stock < 5 ? '<span class="badge bg-warning ms-2">Low Stock</span>' : ''}</td>
                <td>${formatPrice(revenue)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${p.id}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${p.id}">Delete</button>
                </td>
            </tr>
            `;
    }).join("")}
        </tbody>
        </table>
    `;

    // Pagination controls
    if (totalPages > 1) {
        tableHTML += `<nav class="px-3" ><ul class="pagination">`;
        for (let i = 1; i <= totalPages; i++) {
            tableHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
        }
        tableHTML += `</ul></nav>`;
    }

    document.getElementById("productsTable").innerHTML = tableHTML;

    // Attach pagination and action events
    document.querySelectorAll(".pagination .page-link").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            currentPage = +this.textContent;
            renderProductsTable(products, orders);
        });
    });

    attachActionEvents();
}

// وظيفة منفصلة لحساب الريڤينيو لكل منتج
function getRevenueForProduct(productId, orders) {
    return orders
        .flatMap(o => o.items)
        .filter(i => +i.productId === +productId && +i.sellerId === CURRENT_SELLER_ID)
        .reduce((sum, i) => sum + Number(i.total || 0), 0);
}



/* ===========================
   Orders TABLE
=========================== */


function renderOrdersTable(orders) {
    if (!orders.length) {
        document.getElementById("ordersTable").innerHTML = `
        <div class="text-center py-5">
            <div class="mb-3">
                <i class="bi bi-bag-x" style="font-size:40px;color:#9ca3af;"></i>
            </div>
            <h5 class="mb-2">No Orders Yet</h5>
            <p class="text-muted">
                Orders will appear here once customers purchase your products.
            </p>
            <button class="btn btn-outline-primary btn-sm" id="generateTestOrderBtn">
                Generate Test Order
            </button>
        </div>
    `;

        document.getElementById("generateTestOrderBtn")
            .addEventListener("click", generateTestOrder);

        return;
    }

    document.getElementById("ordersTable").innerHTML = `
        <table class="table table-hover align-middle">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total (Your Part)</th>
                    <th>Status</th>
                    <th>Update</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => {

        const sellerTotal = order.items
            .filter(i => +i.sellerId === CURRENT_SELLER_ID)
            .reduce((sum, i) => sum + Number(i.total || 0), 0);

        return `
                        <tr>
                            <td>
    <button class="btn btn-link view-order"
        data-id="${order.id}">
        #${order.id}
    </button>
</td>

                            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>${formatPrice(sellerTotal)}</td>
                            <td>
                                <span class="badge bg-${getStatusColor(order.status)}">
                                    ${order.status}
                                </span>
                            </td>
                            <td>
                                <select class="form-select form-select-sm status-select"
                                    data-id="${order.id}">
                                    ${renderStatusOptions(order.status)}
                                </select>
                            </td>
                        </tr>
                    `;

    }).join("")}
            </tbody>
        </table>
    `;

    attachStatusEvents();
    attachViewOrderEvents();

}


function renderStatusOptions(currentStatus) {

    const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    return statuses.map(status => `
        <option value="${status}" ${status === currentStatus ? "selected" : ""}>
            ${status}
        </option>
    `).join("");
}

function getStatusColor(status) {

    switch (status) {
        case "pending": return "secondary";
        case "processing": return "warning";
        case "shipped": return "info";
        case "delivered": return "success";
        case "cancelled": return "danger";
        default: return "secondary";
    }
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
            <span class="badge bg-success px-3 py-2">
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
    renderOrdersTable(orders);
    initCharts(orders);
}


let editingProductId = null;

let imageFile = null;

let mainImageBase64 = null;
let galleryImagesBase64 = [];


document.getElementById("productImage").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        mainImageBase64 = reader.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById("productGallery").addEventListener("change", function () {

    galleryImagesBase64 = [];

    const files = Array.from(this.files);

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
            galleryImagesBase64.push(reader.result);
        };
        reader.readAsDataURL(file);
    });
});


function setupAddProduct() {

    const form = document.getElementById("addProductForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("productName").value;
        const price = parseFloat(document.getElementById("productPrice").value);
        const stock = parseInt(document.getElementById("productStock").value);

        const description = document.getElementById("productDescription").value;
        const discount = parseFloat(document.getElementById("productDiscount").value) || 0;
        const category = document.getElementById("productCategory").value;
        const brand = document.getElementById("productBrand").value;

        const finalPrice = discount > 0
            ? price - (price * discount / 100)
            : null;

        let allProducts = JSON.parse(localStorage.getItem("products")) || [];

        if (editingProductId) {
            // UPDATE
            const index = allProducts.findIndex(p => +p.id === +editingProductId);

            allProducts[index].name = name;
            allProducts[index].price = price;
            allProducts[index].stock = stock;
            allProducts[index].image = imageFile || allProducts[index].image;


            showToast("Product updated successfully ✏");
        } else {
            // CREATE
            const newProduct = {
                id: Date.now(),
                name,
                description,
                price,
                discount,
                finalPrice,
                image: mainImageBase64 || "",
                detailImages: galleryImagesBase64 || [],
                category,
                brand,
                sellerId: CURRENT_SELLER_ID,
                sellerName: "Seller",
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

        editingProductId = null;
        form.reset();

        mainImageBase64 = null;
        galleryImagesBase64 = [];


        const modal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
        modal.hide();

        renderAll();
    });
}


function editProduct(id) {

    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    const product = allProducts.find(p => +p.id === +id);

    editingProductId = +id;

    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;

    const modal = new bootstrap.Modal(document.getElementById("addProductModal"));
    modal.show();
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
// Attach edit/delete events to the buttons after rendering the table (needed for dynamic content) 
//when  type="module" the event listeners are not working because the script is deferred and runs after the DOM is loaded, so we need to attach the events after rendering the table.
function attachActionEvents() {

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
            const order = allOrders.find(o => +o.id === +orderId);

            if (!order) return;

            const sellerItems = order.items
                .filter(i => +i.sellerId === CURRENT_SELLER_ID);

            document.getElementById("orderDetailsBody").innerHTML = `
                <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <hr>
                ${sellerItems.map(item => `
                    <div class="mb-2">
                        <strong>${item.productName}</strong><br>
                        Quantity: ${item.quantity}<br>
                        Total: ${formatPrice(item.total)}
                    </div>
                `).join("")}
            `;

            const modal = new bootstrap.Modal(
                document.getElementById("orderDetailsModal")
            );

            modal.show();
        });

    });
}
