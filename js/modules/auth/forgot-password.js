// FORGOT PASSWORD MODULE

// DOM Elements
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const forgotForm = document.getElementById("forgotPasswordForm");
const verifyForm = document.getElementById("verifyCodeForm");
const newPasswordForm = document.getElementById("newPasswordForm");
const errorDiv = document.getElementById("error");
const successDiv = document.getElementById("success");
const error2 = document.getElementById("error2");
const success2 = document.getElementById("success2");
const error3 = document.getElementById("error3");
const success3 = document.getElementById("success3");
const sendCodeBtn = document.getElementById("sendCodeBtn");
const btnText = document.getElementById("btnText");
const btnSpinner = document.getElementById("btnSpinner");
const resendLink = document.getElementById("resendCode");

// Store reset data temporarily
let resetData = {
  email: "",
  code: "",
  timestamp: null,
};

const EMAILJS_CONFIG = {
  publicKey: "52ezPX8gmVOGfRN8a",
  serviceId: "service_ir1p0pc",
  templateId: "template_jkgpxgn",
};
// Generate random 6-digit code
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send reset code (simulated)
function sendResetCode(email) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email);
  const foundUserName = user?.name || " ";
  if (!user) {
    return { success: false, message: "Email not found" };
  }

  // Generate code
  const code = generateResetCode();
  resetData = {
    email: email,
    code: code,
    timestamp: Date.now(),
  };
  sessionStorage.setItem("resetData", JSON.stringify(resetData));

  // Send email via EmailJS
  emailjs
    .send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        email: email,
        code: code,
        username: foundUserName,
        from_name: "Ice Mart",
      },
      EMAILJS_CONFIG.publicKey,
    )
    .then(
      function (response) {
        console.log("Email sent successfully!", response);
      },
      function (error) {
        console.log("Failed to send email:", error);
      },
    );

  return {
    success: true,
    message: `Reset code sent to ${email}`,
  };
}

// Step 1: Request reset code
forgotForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("resetEmail").value;

  // Show loading
  sendCodeBtn.disabled = true;
  btnText.classList.add("d-none");
  btnSpinner.classList.remove("d-none");
  errorDiv.innerText = "";
  successDiv.innerText = "";

  // Simulate API call
  setTimeout(() => {
    const result = sendResetCode(email);

    // Hide loading
    sendCodeBtn.disabled = false;
    btnText.classList.remove("d-none");
    btnSpinner.classList.add("d-none");

    if (result.success) {
      successDiv.innerText = result.message;
      // Move to step 2 after short delay
      setTimeout(() => {
        step1.classList.add("d-none");
        step2.classList.remove("d-none");
        errorDiv.innerText = "";
        successDiv.innerText = "";
      }, 2000);
    } else {
      errorDiv.innerText = result.message;
    }
  }, 1500);
});

// Step 2: Verify code
verifyForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const enteredCode = document.getElementById("verificationCode").value;
  const storedData = JSON.parse(sessionStorage.getItem("resetData"));

  if (!storedData) {
    error2.innerText = "Session expired. Please request a new code.";
    return;
  }

  // Check if code is expired (10 minutes)
  const now = Date.now();
  const codeAge = now - storedData.timestamp;
  if (codeAge > 10 * 60 * 1000) {
    // 10 minutes
    error2.innerText = "Code expired. Please request a new one.";
    sessionStorage.removeItem("resetData");
    return;
  }

  if (enteredCode === storedData.code) {
    // Code is correct
    step2.classList.add("d-none");
    step3.classList.remove("d-none");
    error2.innerText = "";
  } else {
    error2.innerText = "Invalid verification code";
  }
});

// Resend code
resendLink.addEventListener("click", function (e) {
  e.preventDefault();

  const storedData = JSON.parse(sessionStorage.getItem("resetData"));
  if (storedData && storedData.email) {
    // Go back to step 1
    step2.classList.add("d-none");
    step1.classList.remove("d-none");
    document.getElementById("resetEmail").value = storedData.email;
    successDiv.innerText = "Request a new code";
  }
});

// Step 3: Set new password
newPasswordForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const storedData = JSON.parse(sessionStorage.getItem("resetData"));
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
  // Validate passwords
  if (newPassword !== confirmPassword) {
    error3.innerText = "Passwords don't match";
    return;
  }

  if (!passwordRegex.test(newPassword)) {
    error3.innerText =
      "Password must contain 1 capital letter and 1 number And One Special Char And More Than 6 Letters.";
    return;
  }

  // Update user password
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.email === storedData.email);

  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    // Clear reset data
    sessionStorage.removeItem("resetData");

    // Show success and redirect to login
    success3.innerText = "Password reset successfully! Redirecting to login...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } else {
    error3.innerText = "User not found";
  }
});
