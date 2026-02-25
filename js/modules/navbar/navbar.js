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
