export function renderActivityFeed() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const container = document.getElementById("activityFeed");

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state-container">
                <i class="bi bi-lightning-charge"></i>
                <p>No recent activities found</p>
            </div>`;
        return;
    }

    const latest = [...orders]
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 5);


    container.innerHTML = `
        <div class="modern-timeline">
            ${latest.map(order => {
        const date = new Date(order.orderDate);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // update icon and color based on order status
        const statusConfig = {
            pending: { icon: 'bi-clock-history', color: 'warning' },
            delivered: { icon: 'bi-check-circle-fill', color: 'success' },
            cancelled: { icon: 'bi-x-circle-fill', color: 'danger' },
            shipped: { icon: 'bi-truck', color: 'primary' }
        };
        const config = statusConfig[order.status] || statusConfig.pending;

        return `
                <div class="timeline-entry">
                    <div class="timeline-aside">
                        <span class="timeline-time">${timeStr}</span>
                        <div class="timeline-dot-wrapper">
                            <div class="timeline-dot bg-${config.color}"></div>
                            <div class="timeline-line"></div>
                        </div>
                    </div>
                    <div class="timeline-content-box">
                        <div class="entry-header">
                            <span class="entry-title">New Order <strong>#${order.id.toString().slice(-6)}</strong></span>
                            <span class="status-badge badge-${config.color}">${order.status}</span>
                        </div>
                        <p class="entry-details">Customer <strong>${order.fullName}</strong> placed an order for ${order.totalPrice.toLocaleString()} EGP</p>
                    </div>
                </div>
                `;
    }).join("")}
        </div>
    `;
}