const ORDERS_KEY = "orders";

export function getAllOrders() {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}

export function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateOrderStatus(orderId, newStatus) {
    const orders = getAllOrders();
    const order = orders.find(o => o.id == orderId);
    if (!order) return false;

    order.status = newStatus.toLowerCase();
    saveOrders(orders);
    return true;
}

export function cancelOrderById(orderId) {
    return updateOrderStatus(orderId, "cancelled");
}
