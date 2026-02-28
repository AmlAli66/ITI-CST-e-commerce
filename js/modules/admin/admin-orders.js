export function renderOrders(){
    const ordersContainer = document.getElementById("adminOrders");
    ordersContainer.classList.remove('hidden');
    const allOrders = JSON.parse(localStorage.getItem('orders'))||[];
ordersContainer.innerHTML = `
    <!-- Filters (shown ONCE) -->
    <div class="ordersFilters">
        <h3>Orders Management</h3>
        <input id="orderSearch" placeholder="Search">
        <select id="statusFilter">
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option> 
        </select>
    </div>
    
    <!-- Orders container -->
    <div id="ordersDisplay">
    </div>
`;
document.getElementById('orderSearch').addEventListener('input', displayOrders);
    document.getElementById('statusFilter').addEventListener('change', displayOrders);
    
    // Display orders for the first time
    displayOrders();

}

function displayOrders(){
    const ordersDisplay = document.getElementById("ordersDisplay");
    const searchBarInput = document.getElementById('orderSearch').value;
    const statusChoosen = document.getElementById('statusFilter').value;
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    let filteredOrders = allOrders;
    
    // Apply search filter
    if(searchBarInput){
        filteredOrders = filteredOrders.filter(o => 
        o.fullName.toLowerCase().includes(searchBarInput.toLowerCase()) ||
        o.id.toString().includes(searchBarInput));
    }
    
    // Apply status filter (skip if "all")
    if(statusChoosen !== "all"){
        filteredOrders = filteredOrders.filter(o => o.status === statusChoosen);
    }
    
    // Display filtered orders
    ordersDisplay.innerHTML = filteredOrders.map(o => `
        <div class="orderCard">
            <label class="orderCardId">#${o.id.toString().slice(-6)}</label>
            <label class="orderUserName">${o.fullName}</label>
            <label class="orderStatus">${o.status}</label>
            <label class="orderTotalPrice">$${o.totalPrice}</label>
            <button class="viewDetailsBtn">View Details</button>
            
            <select class="statusDropdown" data-order-id="${o.id}">
            <option value="" disabled selected>Change Status</option>
            <option value="Pending" ${o.status === 'Pending' ? 'disabled' : ''}>Pending</option>
            <option value="Shipped" ${o.status === 'Shipped' ? 'disabled' : ''}>Shipped</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'disabled' : ''}>Delivered</option>
            </select>
            
            <button class="cancelBtn"  data-order-id="${o.id}">Cancel</button>
        </div>
    `).join('');
// Attach cancel button events 
document.querySelectorAll('.cancelBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-order-id');
        if(confirm('Cancel this order?')) {
            cancelOrder(orderId);
        }
    });
});
document.querySelectorAll('.statusDropdown').forEach(dropdown => {
    dropdown.addEventListener('change', () => {
        const orderId = dropdown.getAttribute('data-order-id');
        const newStatus = dropdown.value;
        
        if(confirm(`Change status to ${newStatus}?`)) {
            changeOrderStatus(orderId, newStatus);
        } else {
            dropdown.value = ""; // Reset dropdown if cancelled
        }
    });
});
}// end of display orders




// Canceling Button
function cancelOrder(orderId){
    let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = allOrders.find(o => o.id == orderId);
    if(order){
        order.status = "Cancelled";
        
        // 4. Save back to localStorage
        localStorage.setItem('orders', JSON.stringify(allOrders));
        
        // 5. Show success message
        alert('Order cancelled!');
        
        // 6. Refresh display
        displayOrders();
    }

}
// Change order status
function changeOrderStatus(orderId, newStatus){
    let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    //console.log('Looking for order ID:', orderId);
    //console.log('All order IDs:', allOrders.map(o => o.id));
    const order = allOrders.find(o => o.id == orderId);
    //console.log('Found order:', order);
    
    if(order){
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(allOrders));
        alert(`Status changed to ${newStatus}!`);
        displayOrders();
    }else{
            console.log('ORDER NOT FOUND!');
    }
}

