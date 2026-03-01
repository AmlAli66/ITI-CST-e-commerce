

const form = document.getElementById("contactForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

// ===== Live validation on input ============

nameInput.addEventListener("input", () => {
    const namePattern = /^[A-Za-z\s]+$/;
    if (namePattern.test(nameInput.value.trim())) {
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
        nameInput.nextElementSibling.textContent = "";
    } else {
        nameInput.classList.remove("is-valid");
        nameInput.classList.add("is-invalid");
        nameInput.nextElementSibling.textContent = "Name must contain letters only";
    }
});

emailInput.addEventListener("input", () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;
    if (emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");
        emailInput.nextElementSibling.textContent = "";
    } else {
        emailInput.classList.remove("is-valid");
        emailInput.classList.add("is-invalid");
        emailInput.nextElementSibling.textContent = "Enter Valid Email";
    }
});

subjectInput.addEventListener("input", () => {
    if (subjectInput.value.trim() !== "") {
        subjectInput.classList.remove("is-invalid");
        subjectInput.classList.add("is-valid");
        subjectInput.nextElementSibling.textContent = "";
    } else {
        subjectInput.classList.remove("is-valid");
        subjectInput.classList.add("is-invalid");
        subjectInput.nextElementSibling.textContent = "Subject is required";
    }
});

messageInput.addEventListener("input", () => {
    if (messageInput.value.trim() !== "") {
        messageInput.classList.remove("is-invalid");
        messageInput.classList.add("is-valid");
        messageInput.nextElementSibling.textContent = "";
    } else {
        messageInput.classList.remove("is-valid");
        messageInput.classList.add("is-invalid");
        messageInput.nextElementSibling.textContent = "Message is required";
    }
});

// ===== Form Submit =====
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    // Reset classes
    nameInput.classList.remove("is-invalid", "is-valid");
    emailInput.classList.remove("is-invalid", "is-valid");
    subjectInput.classList.remove("is-invalid", "is-valid");
    messageInput.classList.remove("is-invalid", "is-valid");

    // ===== Name Validation =====
    const namePattern = /^[A-Za-z\s]+$/;
    if (name === "" || !namePattern.test(name)) {
        nameInput.classList.add("is-invalid");
        nameInput.nextElementSibling.textContent = "Name must contain letters only";
        isValid = false;
    } else {
        nameInput.classList.add("is-valid");
    }

    // ===== Email Validation =====
    const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;
    if (email === "" || !emailPattern.test(email)) {
        emailInput.classList.add("is-invalid");
        emailInput.nextElementSibling.textContent = "Enter Valid Email";
        isValid = false;
    } else {
        emailInput.classList.add("is-valid");
    }

    // ===== Subject Validation =====
    if (subject === "") {
        subjectInput.classList.add("is-invalid");
        subjectInput.nextElementSibling.textContent = "Subject is required";
        isValid = false;
    } else {
        subjectInput.classList.add("is-valid");
    }

    // ===== Message Validation =====
    if (message === "") {
        messageInput.classList.add("is-invalid");
        messageInput.nextElementSibling.textContent = "Message is required";
        isValid = false;
    } else {
        messageInput.classList.add("is-valid");
    }

    if (!isValid) return;

    // ===== Save to localStorage =====
    const formData = {
        id: "MSG-" + Date.now(),
        name,
        email,
        subject,
        message,
        date: new Date().toLocaleString()
    };

    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push(formData);
    localStorage.setItem("messages", JSON.stringify(messages));

    alert("We will get in touch with you shortly.");

    form.reset();

    // Remove validation classes after reset
    nameInput.classList.remove("is-valid", "is-invalid");
    emailInput.classList.remove("is-valid", "is-invalid");
    subjectInput.classList.remove("is-valid", "is-invalid");
    messageInput.classList.remove("is-valid", "is-invalid");
});