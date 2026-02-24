// LOGIN MODULE
// Owner: Auth Dev

// TODO:
// - read form inputs
// - validate user
// - check JSON users data
// - store currentUser
// - redirect by role
// if He Is Sign In already
window.onload = function () {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    const user = JSON.parse(currentUser);
    redirectBasedOnRole(user.role);
  }
};
function redirectBasedOnRole(role) {
  if (role === "Customer") {
    window.location.href = "/index.html";
  } else if (role === "Seller") {
    window.location.href = "/pages/seller/seller-dashboard.html";
  } else if (role === "Admin") {
    window.location.href = "/pages/admin/admin-panel.html";
  }
}
///Redirect To Its Rule

const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    document.getElementById("error").innerText = "Invalid Email or Password";
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  if (user.role === "Customer") {
    window.location.href = "/index.html";
  } else if (user.role === "Seller") {
    window.location.href = "/index.html";
  } else if (user.role === "Admin") {
    window.location.href = "/index.html";
  }
});
