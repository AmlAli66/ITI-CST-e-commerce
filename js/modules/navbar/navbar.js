// js/modules/navbar/navbar.js

//const user = JSON.parse(localStorage.getItem("currentUser"));

//const navUserName = document.getElementById("navUserName");


// Getting Current User
function getCurrentUser(){
    const userStr= localStorage.getItem('currentUser');
    return userStr? JSON.parse(userStr) : null;
}

// Logic Of Logout with redirection
const navLogout= document.getElementById("navLogout");
navLogout.addEventListener('click',logout)
function logout(){
    console.log("🚪 LOGOUT FUNCTION STARTED");
    console.log("📦 Before remove:", localStorage.getItem('currentUser'));
    localStorage.removeItem("currentUser");
    //updateNavbar();
    console.log("📦 After remove:", localStorage.getItem('currentUser'));
    console.log("🔄 About to redirect...");
    
    window.location.href = "";
}
// logic of login and redirection 
    const navLogin= document.getElementById("navLogin");
    // navLogin.addEventListener("click",goToLoginPage)
    // function goToLoginPage(){
    //     window.localStorage.href=`./pages/auth/login.html`
    // }
//-------------------------------------
// updating the navbar
function updateNavbar() {
    const user = getCurrentUser();
    const navUserName = document.getElementById("navUserName");
    const sellerDashboard=document.getElementById("navSellerDashboard");
    const adminDashboard =document.getElementById("navAdminPanel");
    const navLogin= document.getElementById("navLogin");
    const navLogout =document.getElementById("navLogout")
    if(navUserName) {
        navUserName.innerText = user ? `Welcome ${user.name}` : "";
    }
    if(user &&user.role=="admin"){
        adminDashboard.style.display="block"
    }
    if(user && user.role=="seller"){
        sellerDashboard.style.display="block"
    }
    if(user){
        navLogin.style.display="none";
    }
    if(!user){
        navLogout.style.display="none";
    }
}
updateNavbar();
 // creating mock for now 

 function createMockUser(){
    if(!localStorage.getItem('currentUser')){
    const mockUser ={
    id:"4",
    name:"Freeze",
    email:"freeze@icemart.com",
    password:"123456",
    role:"customer",
    phone:"01234567896",
    address : "789 try later, try again , egy",
    status:"active",
    dateCreated:"2026-02-22"

    }
    localStorage.setItem('currentUser',JSON.stringify(mockUser))

}
else {
        console.log("ℹ️ User already exists, skipping mock creation");
    }

}






// trying to adjust /// Tries to adjust with product details
// trying add to cart
function navAddToCart(productId) {
    // 1. Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    // 2. Get the product
    const product = getAllProducts().find(p => p.id === productId);
    if (!product) return;

    // 3. Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 4. Check if this user already has this product in cart
    const existingItem = cart.find(item => item.productId === productId && item.userId === currentUser.id);

    if (existingItem) {
        // Already in cart → increase quantity
        if (existingItem.quantity >= product.stock) {
            alert('No more stock available');
            return;
        }
        existingItem.quantity += 1;
    } else {
        // New item → push to array
        cart.push({
            productId: productId,
            userId: currentUser.id,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }

    // 5. Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
    cartNotification();
}
// Notification on the cart simpol 
function cartNotification() {
    // 1. Find the cart icon in the navbar
    const cartIcon = document.querySelector('.fa-cart-shopping');
    if (!cartIcon) {
        setTimeout(cartNotification, 100); // retry if navbar hasn't loaded yet
        return;
    }

    // 2. Get the <a> tag wrapping the icon
    const cartLink = cartIcon.closest('a');
    cartLink.style.position = "relative"; // needed so the badge positions correctly

    // 3. Remove any existing badge (to avoid duplicates)
    let existingBadge = cartLink.querySelector('.cart-badge-modern');
    if (existingBadge) existingBadge.remove();

    // 4. Count this user's items
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const userCartItems = cart.filter(item => item.userId === currentUser.id);
    const totalQuantity = userCartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity <= 0) return; // no badge if cart is empty

    // 5. Create the badge element and append it
    const badge = document.createElement("span");
    badge.classList.add("cart-badge-modern");
    badge.textContent = totalQuantity;
    cartLink.appendChild(badge);
}


const currentPage = window.location.pathname;
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});
cartNotification();

window.navAddToCart = navAddToCart;
window.cartNotification = cartNotification;


// افترضي عندك عناصر خاصة بالـ role موجودة في navbar.html
// مثلاً <a id="admin-link" href="/pages/admin/admin-panel.html">Admin</a>

/*if (user?.role === "seller") {
    const sellerLink = document.querySelector("#seller-link");
    if (sellerLink) sellerLink.style.display = "inline";
}

if (user?.role === "admin") {
    const adminLink = document.querySelector("#admin-link");
    if (adminLink) adminLink.style.display = "inline";
}

console.log("navbar.js executed");*/
