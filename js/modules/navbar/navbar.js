// js/modules/navbar/navbar.js

const user = JSON.parse(localStorage.getItem("currentUser"));

// افترضي عندك عناصر خاصة بالـ role موجودة في navbar.html
// مثلاً <a id="admin-link" href="/pages/admin/admin-panel.html">Admin</a>

if (user?.role === "seller") {
    const sellerLink = document.querySelector("#seller-link");
    if (sellerLink) sellerLink.style.display = "inline";
}

if (user?.role === "admin") {
    const adminLink = document.querySelector("#admin-link");
    if (adminLink) adminLink.style.display = "inline";
}

console.log("navbar.js executed");
