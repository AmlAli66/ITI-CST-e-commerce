import { renderActivityFeed } from "./admin-activity.js";

let revenueChartInstance = null;
let statusChartInstance = null;
let usersChartInstance = null;


export function renderDashboard() {

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const now = new Date();
    const last7 = new Date();
    last7.setDate(now.getDate() - 7);

    const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const revenueLast7 = orders
        .filter(o => new Date(o.orderDate) >= last7)
        .reduce((sum, o) => sum + o.totalPrice, 0);

    const ordersLast7 = orders.filter(o => new Date(o.orderDate) >= last7).length;

    const cancellationRate = orders.length
        ? ((orders.filter(o => o.status === "cancelled").length / orders.length) * 100).toFixed(1)
        : 0;

    document.getElementById("adminDashboard").classList.remove("hidden");

    document.getElementById("adminDashboard").innerHTML = `
        <div class="enterprise-dashboard">

            <!-- Executive Header -->
            <div class="dashboard-header">
                <div>
                    <h2>Executive Overview</h2>
                    <p>Operational intelligence & real-time metrics</p>
                </div>
                <div class="dashboard-actions">
                    <button class="btn-soft btn-soft-primary">Export Report</button>
                    <button class="btn-soft btn-soft-danger">System Audit</button>
                </div>
            </div>

            <!-- KPI ROW -->
            <div class="kpi-grid-advanced">

                ${advancedKPI("Revenue", revenue + " EGP", "+ " + revenueLast7 + " last 7d", "bi-cash-stack")}
                ${advancedKPI("Orders", orders.length, ordersLast7 + " last 7d", "bi-cart")}
                ${advancedKPI("Users", users.length, users.filter(u => new Date(u.dateCreated) >= last7).length + " new", "bi-people")}
                ${advancedKPI("Cancellation Rate", cancellationRate + "%", "Risk Indicator", "bi-exclamation-triangle")}

            </div>

            <!-- Analytics Section -->
            <div class="analytics-grid">

                <div class="analytics-card large">
                    <div class="card-header-flex">
                        <h5>Revenue Analytics</h5>
                        <div class="time-switch">
                            <button data-range="7" class="range-btn active">7D</button>
                            <button data-range="30" class="range-btn">30D</button>
                        </div>
                    </div>
                    <canvas id="revenueChart"></canvas>
                </div>

                <div class="analytics-card">
                    <h5>Order Status Distribution</h5>
                    <canvas id="ordersStatusChart"></canvas>
                </div>

                <div class="analytics-card">
                    <h5>User Growth</h5>
                    <canvas id="usersGrowthChart"></canvas>
                </div>

                <div class="analytics-card">
                    <h5>Top Revenue Products</h5>
                    <div id="topProductsList"></div>
                </div>

<div class="analytics-card highlight-card">
    <img id="topProductHeroImg" src="../../assets/images/top.avif" class="img-fluid rounded" alt="Top Product">
    <div class="mt-3 text-center">
        <small class="text-uppercase text-muted">Best Selling Now</small>
        <h5 id="topProductHeroName" class="mb-0">Top Revenue Product</h5>
    </div>
</div>
            </div>

            <div class="activity-section">
                <h5>System Activity Timeline</h5>
                <div id="activityFeed"></div>
            </div>

        </div>
    `;

    renderRevenueChart(orders, 7);
    document.querySelectorAll(".range-btn").forEach(btn => {
        btn.addEventListener("click", () => {

            document.querySelectorAll(".range-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            const days = Number(btn.dataset.range);
            renderRevenueChart(
                JSON.parse(localStorage.getItem("orders")) || [],
                days
            );
        });
    });

    renderOrdersStatusChart(orders);
    renderUsersGrowthChart(users);
    renderTopProducts(orders);
    renderActivityFeed();
}
function advancedKPI(title, value, subtitle, icon) {
    return `
        <div class="kpi-advanced">
            <div class="kpi-icon-advanced">
                <i class="bi ${icon}"></i>
            </div>
            <div class="kpi-content">
                <small>${title}</small>
                <h3>${value}</h3>
                <span>${subtitle}</span>
            </div>
        </div>
    `;
}


function renderUsersGrowthChart(users) {

    const last30 = {};
    const today = new Date();

    if (usersChartInstance) {
        usersChartInstance.destroy();
    }


    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        last30[d.toLocaleDateString()] = 0;
    }

    users.forEach(u => {
        const d = new Date(u.dateCreated).toLocaleDateString();
        if (last30[d] !== undefined) last30[d]++;
    });

    usersChartInstance = new Chart(document.getElementById("usersGrowthChart"), {
        type: "bar",
        data: {
            labels: Object.keys(last30),
            datasets: [{
                label: "New Users",
                data: Object.values(last30),
                backgroundColor: "#7c3aed"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}


function renderRevenueChart(orders, days = 7) {

    const canvas = document.getElementById("revenueChart");
    if (!canvas) return;

    //empty state check
    if (orders.length === 0) {
        canvas.parentElement.innerHTML = `
            <div class="card-header-flex"><h5>Revenue Analytics</h5></div>
            <div class="empty-state-container"><i class="bi bi-graph-up"></i><p>Start selling to see revenue trends</p></div>`;
        return;
    }

    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    const today = new Date();
    const data = {};

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        data[d.toLocaleDateString()] = 0;
    }

    orders.forEach(order => {
        const date = new Date(order.orderDate).toLocaleDateString();
        if (data[date] !== undefined) {
            data[date] += Number(order.totalPrice) || 0;
        }
    });

    revenueChartInstance = new Chart(canvas, {
        type: "line",
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: "Revenue",
                data: Object.values(data),
                borderColor: "#7c3aed",
                backgroundColor: "rgba(124,58,237,0.15)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderOrdersStatusChart(orders) {

    //empty state check
    const container = document.getElementById("ordersStatusChart").parentElement;

    if (orders.length === 0) {
        container.innerHTML = `<h5>Order Status</h5><div class="empty-state-container"><i class="bi bi-pie-chart"></i><p>No orders to analyze</p></div>`;
        return;
    }

    const statusCount = {
        pending: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };

    if (statusChartInstance) {
        statusChartInstance.destroy();
    }


    orders.forEach(o => {
        if (statusCount[o.status] !== undefined) {
            statusCount[o.status]++;
        }
    });

    statusChartInstance = new Chart(document.getElementById("ordersStatusChart"), {
        type: "doughnut",
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: ["#facc15", "#3b82f6", "#10b981", "#ef4444"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


function renderTopProducts(orders) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const revenueByProduct = {};
    const listContainer = document.getElementById("topProductsList");
    const heroImg = document.getElementById("topProductHeroImg");
    const heroName = document.getElementById("topProductHeroName");

    //collect data
    orders.forEach(order => {
        order.items?.forEach(item => {
            if (!revenueByProduct[item.productId]) {
                const productDetails = products.find(p => p.id === item.productId);
                revenueByProduct[item.productId] = {
                    name: item.productName,
                    revenue: 0,
                    image: productDetails ? productDetails.image : "../../assets/images/placeholder.png"
                };
            }
            revenueByProduct[item.productId].revenue += item.price * item.quantity;
        });
    });

    const sorted = Object.values(revenueByProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // empty state check
    if (sorted.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state-container">
                <i class="bi bi-box-seam"></i>
                <p>No sales data available yet</p>
            </div>`;
        heroImg.src = "../../assets/images/top.avif"; //  default image
        heroName.innerText = "Waiting for sales...";
        return;
    }

    // if it's not empty
    listContainer.innerHTML = sorted.map((p, index) => `
        <div class="top-product-row">
            <div class="top-product-info">
                <span class="product-rank">${index + 1}</span>
                <img src="${p.image}" class="top-product-img" onerror="this.src='../../assets/images/placeholder.png'"/>
                <div class="product-meta">
                    <span class="product-name text-truncate" style="max-width: 120px;">${p.name}</span>
                    <small class="product-sales">Top Performer</small>
                </div>
            </div>
            <div class="product-value"><strong>${p.revenue.toLocaleString()}</strong><small>EGP</small></div>
        </div>
    `).join("");

    heroImg.src = sorted[0].image;
    heroName.innerText = sorted[0].name;
}