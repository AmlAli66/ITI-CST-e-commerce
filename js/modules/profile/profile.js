const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser){
    window.location.href="/index.html"
}
const profileUserName= document.getElementById("profileUserName");
const profileEmail = document.getElementById("profileEmail");
const profileRole = document.getElementById("profileRole");
const proflieCreatedAt = document.getElementById("profileCreatedAt");
const profileStatus =document.getElementById("profileStatus");

//-- Displaying the header of profile with current user
function ProfileDetails(){
    if(currentUser){
        profileUserName.innerText= currentUser.name;
        profileEmail.innerText=currentUser.email;
        profileRole.innerText=currentUser.role;
        proflieCreatedAt.innerText=currentUser.dateCreated;
        profileStatus.innerText=currentUser.status;
        document.getElementById('profileAvatar').innerText = currentUser.name.slice(0, 2).toUpperCase();
    }
}
ProfileDetails();
// Displaying the profile info of the current user
const profileinfoName =document.getElementById("profileInfoName");
const profileInfoEmail =document.getElementById("profileInfoEmail");
const profileInfoPhone =document.getElementById("profileInfoPhone");
const profileInfoDate =document.getElementById("profileInfoDate");
const profileInfoAddress= document.getElementById("profileInfoAddress");
function ProfileDisplayInfo(){
    if(currentUser){
        profileinfoName.innerText=currentUser.name;
        profileInfoEmail.innerText=currentUser.email;
        profileInfoPhone.innerText=currentUser.phone;
        profileInfoDate.innerText=currentUser.dateCreated;
        profileInfoAddress.innerText=currentUser.address;
    }
}
ProfileDisplayInfo();
// Handling the edit modal
function  openEditModal(){
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editPhone').value = currentUser.phone;
    document.getElementById('editAddress').value = currentUser.address;
    new bootstrap.Modal(document.getElementById('editProfileModal')).show();
}
// Saving the editted 
function saveProfile(){
    // getting the new  values
    const newName = document.getElementById('editName').value.trim();
    const newPhone = document.getElementById('editPhone').value.trim();
    const newAddress = document.getElementById('editAddress').value.trim();
    // Validation
    if(!newName||!newPhone||!newAddress){
        alert("All Fields Are Required");
        return;
    }
    //-- add the validation spans here
    if(!isNaN(newName)|| !isNaN(newName[0])){
        alert("Name Can't be A number");
        return;
    }
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(!phoneRegex.test(newPhone)){
        alert("Enter Valid phone number")
        return;
    }
    ///
    // Assigning the new values to the currentUser
    currentUser.name = newName;
    currentUser.phone = newPhone;
    currentUser.address = newAddress;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    // Finding the Current user inside the original Array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = newName;
        users[userIndex].phone = newPhone;
        users[userIndex].address = newAddress;
        localStorage.setItem('users', JSON.stringify(users));
    }
    ProfileDetails();
    ProfileDisplayInfo();
    bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
    window.location.reload();

}
// Getting the orders from the local storage 
function displayProfileOrders(){
    const orders = JSON.parse(localStorage.getItem('orders'))||[];
    const userOrders = orders.filter(o=> o.userId==currentUser.id);
    const profileOrdersContainer = document.getElementById("profileOrderList");
    if(userOrders.length==0){
        profileOrdersContainer.innerHTML=`
        <div class='profileEmptyState'>
        <i class="fas fa-box-open"></i>
        <p> No Orders Yet</p>
        </div>
        
        `;
        return;
    }
    profileOrdersContainer.innerHTML=userOrders.map(order=>{
        const itemsCount = order.items.length;
        const firstProductName = order.items[0].productName;
        const summary = itemsCount>1 ? `${firstProductName}<span class="profileOrderMore">+${itemsCount-1} more</span>` :firstProductName;
        const date = new Date(order.orderDate).toLocaleString();
        
        return `
            <div class="profileOrderItem">
                <div class="profileOrderIcon"><i class="fas fa-box"></i></div>
                <div class="profileOrderDetails">
                    <div class="profileOrderName">${summary}</div>
                    <div class="profileOrderDate">${date} • ${itemsCount} item ${itemsCount>1 ? 's':''}</div>
                </div>
                <span class="profileOrderStatus status-${order.status.toLowerCase()}">${order.status}</span>
                <span class="profileOrderPrice">$${order.totalPrice.toFixed(2)}</span>
                <button class="profileOrderViewBtn" onclick="viewOrderDetails('${order.id}')"> View Details</button>
            </div>
        `


    }).join('');
    
    // end of mapping the orders 

}
displayProfileOrders();
if (currentUser.role === "admin") {
    document.getElementById("profileOrderList").parentElement.style.visibility = "hidden";
}
// start of Order Details Modal Showing 
function viewOrderDetails(orderId){
window.location.href = `order-details.html?id=${orderId}`;
}



//- end of order details modal