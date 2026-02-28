export function renderActivityFeed() {

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const latest = orders.slice(-5).reverse();

    const container = document.getElementById("activityFeed");

    container.innerHTML = `
        <div class="activity-card">
            <h5>Recent Activity</h5>
            ${latest.map(order => `
                <div class="activity-item">
                    <span>Order #${order.id}</span>
                    <small>$${order.totalPrice}</small>
                </div>
            `).join("")}
        </div>
    `;
}
