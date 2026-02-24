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
  if (role === "customer") {
    window.location.href = "/index.html";
  } else if (role === "seller") {
    window.location.href = "/pages/seller/seller-dashboard.html";
  } else if (role === "admin") {
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

  if (user.role === "customer") {
    window.location.href = "/index.html";
  } else if (user.role === "seller") {
    window.location.href = "/index.html";
  } else if (user.role === "admin") {
    window.location.href = "/index.html";
  }
});
//----------------------//---- Initilaizing the users
async function initilaizeUsers() {
  const existingUser = localStorage.getItem("users");
  if (!existingUser) {
    console.log("Loading User into localStorage...");

    try {
      // Fetch from JSON
      const userResponse = await fetch("/data/users.json");
      const users = await userResponse.json();

      // Store in localStorage
      localStorage.setItem("users", JSON.stringify(users));

      console.log("users loaded successfully:", users.length);
    } catch (error) {
      console.error(" Error loading users:", error);
    }
  } else {
    console.log("✅ Products already in localStorage");
  }
}
initilaizeUsers();
