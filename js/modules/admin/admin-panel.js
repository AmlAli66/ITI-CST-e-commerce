import { renderDashboard } from "./admin-dashboard.js";
import { renderUsers } from "./admin-users.js";
import { renderProducts } from "./admin-products.js";
import { renderOrders } from "./admin-orders.js";
import { renderActivityFeed } from "./admin-activity.js";
import { initUsers } from "../../core/users-service.js";
import { initProducts } from "../../core/products-service.js";


(async function () {

    await initUsers();
    await initProducts();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {
        window.location.href = "/pages/auth/login.html";
        return;
    }

    updateUsersBadge();
    renderDashboard();



    const sidebar = document.getElementById("sidebar");
    const mobileToggle = document.getElementById("mobileMenuToggle");
    const closeSidebar = document.getElementById("closeSidebar");

    const toggleSidebar = () => {
        sidebar.classList.toggle("active");
    };

    mobileToggle?.addEventListener("click", toggleSidebar);
    closeSidebar?.addEventListener("click", toggleSidebar);

    // Close sidebar when clicking a menu item on mobile
    document.querySelectorAll(".sidebar-menu li").forEach(item => {
        item.addEventListener("click", () => {
            if (window.innerWidth < 992) {
                sidebar.classList.remove("active");
            }
        });
    });
})();


document.getElementById("backBtn")?.addEventListener("click", () => {
    window.history.back();
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/pages/auth/login.html";
});


const sections = document.querySelectorAll(".sidebar-menu li");

sections.forEach(item => {
    item.addEventListener("click", () => {

        document.querySelector(".sidebar-menu li.active")?.classList.remove("active");
        item.classList.add("active");

        const section = item.dataset.section;
        switchSection(section);
    });
});

export function updateUsersBadge() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const badge = document.getElementById("usersCountBadge");
    if (badge) badge.innerText = users.length;
}



function switchSection(section) {
    document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));

    if (section === "dashboard") renderDashboard();
    if (section === "users") renderUsers();
    if (section === "products") renderProducts();
    if (section === "orders") renderOrders();
}




