// AUTH GUARD
// Protect pages by role

export function requireRole(role) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== role) {
        window.location.href = "/pages/auth/login.html";
    }
}
