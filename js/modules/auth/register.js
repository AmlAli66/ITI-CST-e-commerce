const form = document.getElementById("registerForm");
const message = document.getElementById("message");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const address = document.getElementById("address").value.trim();
  const role = document.getElementById("role").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value;

  const nameRegex = /^[\u0600-ۿA-Za-z\s]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
  const addressRegex = /^[\u0600-ۿA-Za-z0-9\s]{3,}$/;
  if (!nameRegex.test(fullName)) {
    showError("Full Name must be at least 3 letters.");
    return;
  }

  if (!emailRegex.test(email)) {
    showError("Invalid email format.");
    return;
  }

  if (!passwordRegex.test(password)) {
    showError(
      "Password must contain 1 capital letter and 1 number And One Special Char And More Than 6 Letters.",
    );
    return;
  }
  if (password !== confirmPassword) {
    showError("Passwords do not match!");
    return;
  }
  if (!iti.isValidNumber()) {
    showError("Enter Valid Phone Number");
    return;
  }
  if (!addressRegex.test(address)) {
    showError("Address must start with a letter.");
    return;
  }
  if (!role) {
    showError("Please Chose Role.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExists = users.some((user) => user.email === email);

  if (emailExists) {
    showError("This email is already registered!");
    return;
  }
  let maxId = users.reduce((max, user) => Math.max(max, parseInt(user.id)), 0);
  let newId = maxId + 1;
  const newUser = {
    id: newId,
    name: fullName,
    email: email,
    password: password,
    role: role,
    phone: iti.getNumber(),
    address: address,
    status: "active",
    createdAt: new Date().toLocaleDateString("en-CA"),
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  showSuccess(" Registration successful! Redirecting to login page...");
  errorMsg.innerHTML = "";
  setTimeout(function () {
    window.location.href = "/pages/auth/login.html";
  }, 2000);
  form.reset();
  form.classList.remove("was-validated");
}); //End Of Form

function showError(msg) {
  message.textContent = msg;
  message.className = "text-danger text-center mb-3 fw-bold";
}

function showSuccess(msg) {
  message.textContent = msg;
  message.className = "text-success text-center mb-3 fw-bold";
  if (document.getElementById("phoneError")) {
    document.getElementById("phoneError").innerHTML = "";
  }
}
//Validation Of Phone Number
const input = document.querySelector("#phone");
const errorMsg = document.getElementById("phoneError");

const iti = window.intlTelInput(input, {
  initialCountry: "eg",
  preferredCountries: ["eg", "sa", "ae"],
  separateDialCode: true,
  utilsScript:
    "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
});

input.addEventListener("blur", function () {
  if (input.value.trim()) {
    if (iti.isValidNumber()) {
      errorMsg.innerHTML = "";
    } else {
      errorMsg.innerHTML = "Invalid Number";
    }
  }
});
//  End Of Validation Of Phone Number
