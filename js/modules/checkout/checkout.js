console.log("checkout module loaded");


// read cart
// create order
// save to orders.json or localStorage
// ===============================
// SELECT ELEMENTS
// ===============================

const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
const visaSection = document.getElementById("visaDetails");
const placeOrderBtn = document.getElementById("placeOrder");


const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const address = document.getElementById("address");

const cardNumber = document.getElementById("cardNumber");
const expiry = document.getElementById("expiry");
const cvv = document.getElementById("cvv");

const subTotalElement = document.getElementById("subTotal");
const totalElement = document.getElementById("total");

const shipping = 10;


// ===============================
// PAYMENT METHOD SHOW / HIDE
// ===============================

paymentMethods.forEach(method => {
    method.addEventListener("change", () => {
        if (method.value === "visa") {
            visaSection.classList.remove("d-none");
        } else {
            visaSection.classList.add("d-none");
        }
    });
});


// ===============================
// INPUT RESTRICTIONS
// ===============================

fullName.addEventListener("input", () => {
    fullName.value = fullName.value.replace(/[^A-Za-z\u0600-\u06FF\s]/g, "");
});

phone.addEventListener("input", () => {
    phone.value = phone.value.replace(/[^0-9]/g, "");
});

cardNumber.addEventListener("input", () => {
    cardNumber.value = cardNumber.value.replace(/[^0-9]/g, "");
});

cvv.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/[^0-9]/g, "");
});


// ===============================
// VALIDATION
// ===============================

const nameRegex = /^[A-Za-z\u0600-\u06FF\s]+$/;
const phoneRegex = /^01[0-9]{9}$/;

function validateForm() {

    let valid = true;

    if (!nameRegex.test(fullName.value.trim())) {
        fullName.classList.add("is-invalid");
        valid = false;
    } else {
        fullName.classList.remove("is-invalid");
    }

    if (!phoneRegex.test(phone.value.trim())) {
        phone.classList.add("is-invalid");
        valid = false;
    } else {
        phone.classList.remove("is-invalid");
    }

    if (address.value.trim() === "") {
        address.classList.add("is-invalid");
        valid = false;
    } else {
        address.classList.remove("is-invalid");
    }

    return valid;
}


// ===============================
// LOAD CART & CALCULATE TOTALS
// ===============================

// async function loadCartSummary() {

//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     const carts = JSON.parse(localStorage.getItem("carts")) || {};

//     if (!currentUser || !carts[currentUser.id]) return;

//     const response = await fetch("../../data/products.json");
//     const products = await response.json();

//     const userCart = carts[currentUser.id];

//     let subTotal = 0;

//     userCart.forEach(cartItem => {

//         const product = products.find(p => p.id === cartItem.productId);

//         if (product) {
//             subTotal += product.price * cartItem.quantity;
//         }
//     });

//     subTotalElement.textContent = `$${subTotal}`;
//     totalElement.textContent = `$${subTotal + shipping}`;
// }

// loadCartSummary();


// ===============================
// PLACE ORDER
// ===============================

placeOrderBtn.addEventListener("click", async () => {

    if (!validateForm()) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const carts = JSON.parse(localStorage.getItem("carts")) || {};

    if (!currentUser) {
        alert("User not logged in");
        return;
    }

    const userCart = carts[currentUser.id];

    // if (!userCart || userCart.length === 0) {
    //     alert("Cart is empty");
    //     return;
    // }
    if (!Array.isArray(userCart) || userCart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const response = await fetch("../../data/products.json");
    const products = await response.json();

    let items = [];
    let subTotal = 0;

    userCart.forEach(cartItem => {

        const product = products.find(p => p.id === cartItem.productId);

        if (product) {

            const itemTotal = product.price * cartItem.quantity;
            subTotal += itemTotal;

            items.push({
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                sellerId: product.sellerId,
                total: itemTotal
            });
        }
    });
/////////////////////////////////////////////
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // if (selectedMethod === "visa") {
    //     if (
    //         cardNumber.value.trim() === "" ||
    //         expiry.value.trim() === "" ||
    //         cvv.value.trim() === ""
    //     ) {
    //         alert("Enter visa details");
    //         return;
    //     }
    // }

    if (selectedMethod === "visa") {
        let visaValid = true;
    
        if (cardNumber.value.trim() === "") {
            cardNumber.classList.add("is-invalid");
            visaValid = false;
        } else {
            cardNumber.classList.remove("is-invalid");
        }
    
        if (expiry.value.trim() === "") {
            expiry.classList.add("is-invalid");
            visaValid = false;
        } else {
            expiry.classList.remove("is-invalid");
        }
    
        if (cvv.value.trim() === "") {
            cvv.classList.add("is-invalid");
            visaValid = false;
        } else {
            cvv.classList.remove("is-invalid");
        }
    
        if (!visaValid) {
            return; // يمنع عمل Place Order لو فيه بيانات ناقصة
        }
    }

    const totalPrice = subTotal + shipping;

    const newOrder = {
        id: Date.now(),
        userId: currentUser.id,
        fullName: fullName.value.trim(),    
        phone: phone.value.trim(),          
        address: address.value.trim(),
        items,
        subTotal,
        shipping,
        totalPrice,
        paymentMethod: selectedMethod,
        status: selectedMethod === "visa" ? "Paid" : "Pending",
        orderDate: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    delete carts[currentUser.id];
    localStorage.setItem("carts", JSON.stringify(carts));

    alert("Order Placed Successfully");

    window.location.href = "../shop/home.html";
});

// ===============================
// LOAD CART & CALCULATE TOTALS + DISPLAY ITEMS
// ===============================

async function loadCartSummary() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const carts = JSON.parse(localStorage.getItem("carts")) || {};

    if (!currentUser || !carts[currentUser.id]) return;

    const response = await fetch("../../data/products.json");
    const products = await response.json();

    const userCart = carts[currentUser.id];

    let subTotal = 0;

    const orderList = document.getElementById("orderList");
    orderList.innerHTML = ""; // افراغ الـ list قبل العرض

    userCart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);

        if (product) {
            const itemTotal = product.price * cartItem.quantity;
            subTotal += itemTotal;

            // انشاء li لكل منتج
            const li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            li.innerHTML = `
                ${product.name} x ${cartItem.quantity}
                <span>$${itemTotal}</span>
            `;
            orderList.appendChild(li);
        }
    });

    // تحديث totals
    subTotalElement.textContent = `$${subTotal}`;
    totalElement.textContent = `$${subTotal + shipping}`;
}

loadCartSummary();