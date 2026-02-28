import { renderActivityFeed } from "./admin-activity.js";
export function renderDashboard() {

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const sellers = users.filter(u => u.role === "seller").length;
    const pending = products.filter(p => p.status === "pending").length;

    document.getElementById("adminDashboard").classList.remove("hidden");

    document.getElementById("adminDashboard").innerHTML = `
        <div class="admin-stats-grid">
            <div class="stat-card">
                <h6>Total Revenue</h6>
                <h2>$${revenue}</h2>
            </div>
            <div class="stat-card">
                <h6>Sellers</h6>
                <h2>${sellers}</h2>
            </div>
            <div class="stat-card">
                <h6>Pending Products</h6>
                <h2>${pending}</h2>
            </div>
        </div>

        <div id="activityFeed"></div>
    `;

    renderActivityFeed();
}

