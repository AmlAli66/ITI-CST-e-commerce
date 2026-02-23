// js/modules/navbar/navbar.js

//const user = JSON.parse(localStorage.getItem("currentUser"));

//const navUserName = document.getElementById("navUserName");


function updateNavbar() {
    const user = getCurrentUser();
    const navUserName = document.getElementById("navUserName");
    const sellerDashboard=document.getElementById("navSellerDashboard");
    const adminDashboard =document.getElementById("navAdminPanel");
    if(navUserName) {
        navUserName.innerText = user ? `Welcome ${user.name}` : "";
    }
    if(user &&user.role=="admin"){
        adminDashboard.style.display="block"
    }
    if(user && user.role=="seller"){
        sellerDashboard.style.display="block"
    }
}
updateNavbar();
//updateNavbar();
/*if(user){
    navUserName.innerText="Welcome "+user.name;
}
if(!user){
    navUserName.innerText="";
}*/















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
