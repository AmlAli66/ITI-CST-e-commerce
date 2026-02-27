const params =new URLSearchParams(window.location.search);
const orderId=params.get('id');
const orders = JSON.parse(localStorage.getItem('orders'))||[];
const order =orders.find(o=>o.id==orderId);
if(!order){
    document.getElementById("orderInfo").innerHTML=`
    <div class="profileEmptyStats">
        <i class="fas fa-box-open"></i>
            <p>Order not found</p>
            <a href="profile.html">Back to Profile</a>
    </div>
    `
    
}
function getProductImage(productId){
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id == productId);
    return product ? product.image : '';
}
const orderInfo =document.getElementById('orderInfo');
orderInfo.innerHTML=`
            <h2>Order Details</h2>
            <label class="orderInfoIdLabel" id="orderInfoIdLabel">Order :# ${order.id}</label>
            <label class="orderUserNameLabel" id="orderUserNameLabel">Name : ${order.fullName}</label>
            <label class="orderPhoneLabel" id="orderPhoneLabel">Phone : ${order.phone}</label>
            <label class="orderAdressLabel" id="orderAddressLabel"> Address : ${order.address}</label>
            <label class="orderDateLabel" id="orderDateLabel">Date : ${new Date(order.orderDate).toLocaleDateString()}</label>
            <label class="orderStatusLabel" id="orderStatusLabel">Status : ${order.status}</label>
            <label class="orderPaymentMethodLabel" id="orderPaymentMethodLabel">Payment : ${order.paymentMethod}</label>
`;
const orderItemsContainer = document.getElementById("orderItems");
const  items = order.items;
orderItemsContainer.innerHTML=items.map(i=>{
return `
        <div class="orderItemRow" data-product-id="${i.productId}">
            <img src="${getProductImage(i.productId)}" alt="${i.productName}">
            <span>${i.productName}</span>
            <span>x${i.quantity}</span>
            <span>$${i.total.toFixed(2)}</span>
        </div>
`

}).join('');
const orderTotals=document.createElement('div');
orderTotals.className='orderTotals';
orderTotals.innerHTML=`
 <div class="orderTotalRow">
        <span>Subtotal:</span>
        <span>$${order.subTotal.toFixed(2)}</span>
    </div>
    <div class="orderTotalRow">
        <span>Tax:</span>
        <span>$${order.tax.toFixed(2)}</span>
    </div>
    <div class="orderTotalRow">
        <span>Shipping:</span>
        <span>${order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)}</span>
    </div>
    <div class="orderTotalRow orderTotalFinal">
        <span>Total:</span>
        <span>$${order.totalPrice.toFixed(2)}</span>
    </div>
`
const orderRows =document.querySelectorAll('.orderItemRow');
orderRows.forEach(row=>{
row.addEventListener('click', function(){
const productId=this.getAttribute('data-product-id');
    window.location.href = `../shop/product-details.html?id=${productId}`;
})// end of event click 

})// end of clicking divs
orderItemsContainer.appendChild(orderTotals);
const backBtn = document.createElement('a');
backBtn.href = 'profile.html';
backBtn.className = 'orderBackBtn';
backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Profile';
document.getElementById('orderDetailsContainer').appendChild(backBtn);