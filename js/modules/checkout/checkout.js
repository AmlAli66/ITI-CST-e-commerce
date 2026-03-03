


console.log("checkout module loaded");



// ===============================
// CHECK AUTH
// ===============================
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "../../index.html"; 
}
// ===============================
// SELECT ELEMENTS
// ===============================

const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
const visaSection = document.getElementById("visaDetails");
const placeOrderBtn = document.getElementById("placeOrder");

const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const address = document.getElementById("address");


const subTotalElement = document.getElementById("subTotal");
const shippingElement = document.getElementById("shipping");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");

const cardNumber = document.getElementById("cardNumber");
const expiry = document.getElementById("expiry");
const cvv = document.getElementById("cvv");



const shippingFee = 0;

// ===============================
// PAYMENT METHOD SHOW / HIDE
// ===============================
paymentMethods.forEach(method => {
    method.addEventListener("change", () => {
        if (method.value === "visa" || method.value === "MasterCard") {
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
    cardNumber.value = cardNumber.value.replace(/[^0-9]/g, "").slice(0,16); 
});
cvv.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/[^0-9]/g, "").slice(0,3); 
});
expiry.addEventListener("input", () => {
    expiry.value = expiry.value.replace(/[^0-9\/]/g, "").slice(0,5); 
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
// VALIDATE CARD DETAILS
// ===============================


function validateCardDetails() {
    let valid = true;

    // Card number: exactly 16 digits
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(cardNumber.value.trim())) {
        cardNumber.classList.add("is-invalid");
        valid = false;
    } else {
        cardNumber.classList.remove("is-invalid");
    }

    // CVV: exactly 3 digits
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv.value.trim())) {
        cvv.classList.add("is-invalid");
        valid = false;
    } else {
        cvv.classList.remove("is-invalid");
    }

    // Expiry: MM/YY format
    const expiryValue = expiry.value.trim();
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (!expiryRegex.test(expiryValue)) {
        expiry.classList.add("is-invalid");
        valid = false;
    } else {
        const [monthStr, yearStr] = expiryValue.split("/");
        const month = parseInt(monthStr);
        const year = parseInt(yearStr);

       
        if (year < 26) {
            expiry.classList.add("is-invalid");
            valid = false;
        } else {
            expiry.classList.remove("is-invalid");
        }
    }

    return valid;
}


// ===============================
// LOAD CART SUMMARY
// ===============================
async function loadCartSummary() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!currentUser) return;

    const userCart = cart.filter(item => item.userId === currentUser.id);
    if (userCart.length === 0) return;


    const products = JSON.parse(localStorage.getItem("products")) || [];

    let html = '';
    let subtotal = 0;

    userCart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;

        const hasDiscount = product.discount && product.discount > 0;
        const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
        const itemTotal = finalPrice * item.quantity;
        subtotal += itemTotal;

        html += `
            <div class="cart-item-modern" style="display:flex; align-items:center; margin-bottom:10px;">
                <img src="${product.image || '/assets/images/placeholder.jpg'}" 
                     alt="${product.name}" 
                     style="width:60px; height:60px; object-fit:cover; margin-right:10px;"
                     onerror="this.src='/assets/images/placeholder.jpg'">
                <div style="flex:1;">
                    <h6 style="margin:0; font-weight:bold;">${product.name}</h6>
                    ${hasDiscount ? `<div class="discount-badge small" style="color:green; font-weight:bold; font-size:0.8rem;">
                        <i class="fas fa-tag"></i> -${product.discount}% OFF
                    </div>` : ''}
                    <div>
                        <span class="cart-item-price" style="color:blue; font-weight:bold;"> $${finalPrice.toFixed(2)} </span>
                        ${hasDiscount ? `<span class="original-price" style="text-decoration:line-through; font-size:0.8rem; margin-left:5px;">$${product.price.toFixed(2)}</span>` : ''}
                    </div>
                </div>
                <div style="text-align:right;">
                    <span style="color:red;">Qty: ${item.quantity}</span><br/>
                    <span style="color:blue; font-weight:bold;">$${itemTotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    });

    document.getElementById("orderList").innerHTML = html;
    updateTotals(subtotal);
}

// ===============================
// UPDATE TOTALS
// ===============================
function updateTotals(subtotal) {
    const shippingCost = subtotal > 100 ? 0 : shippingFee;
    const tax = subtotal * 0.02;
    const total = subtotal + shippingCost + tax;

    subTotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// ===============================
// INIT and placeorder
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    loadCartSummary();

    const confirmModal = new bootstrap.Modal(
        document.getElementById('confirmOrderModal')
    );

    
    placeOrderBtn.addEventListener("click", () => {

        if (!validateForm()) return;

        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if ((selectedMethod === "visa" || selectedMethod === "MasterCard") && !validateCardDetails()) {
            alert("Enter valid card details:\n- Card Number: 16 digits\n- Expiry: MM/YY (M<=12,Y>=2026)\n- CVV: 3 digits");
            return;
        }

        confirmModal.show();
    });



document.getElementById("confirmOrderBtn").addEventListener("click", async () => {

    confirmModal.hide();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!currentUser) return;

    const userCart = cart.filter(item => item.userId === currentUser.id);
    if (!Array.isArray(userCart) || userCart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];

    let items = [];
    let subtotal = 0;
    let stockError = false;

    // ===============================
    // CHECK STOCK + BUILD ORDER
    // ===============================
    for (let item of userCart) {

        const product = products.find(p => p.id === item.productId);

        if (!product) {
            alert("Product not found");
            stockError = true;
            break;
        }

        if (product.stock < item.quantity) {
            alert(`Sorry, only ${product.stock} left in stock for ${product.name}`);
            stockError = true;
            break;
        }

        const hasDiscount = product.discount && product.discount > 0;
        const finalPrice = hasDiscount
            ? product.price * (1 - product.discount / 100)
            : product.price;

        const itemTotal = finalPrice * item.quantity;
        subtotal += itemTotal;

        product.stock -= item.quantity;

        items.push({
            productId: product.id,
            productName: product.name,
            price: finalPrice,
            quantity: item.quantity,
            sellerId: product.sellerId,
            total: itemTotal
        });
    }

    if (stockError) return;



    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    const shippingCost = subtotal > 100 ? 0 : shippingFee;
    const tax = subtotal * 0.02;
    const totalPrice = subtotal + shippingCost + tax;

    const newOrder = {
        id: Date.now(),
        userId: currentUser.id,
        fullName: fullName.value.trim(),
        phone: phone.value.trim(),
        address: address.value.trim(),
        items,
        subTotal: subtotal,
        shipping: shippingCost,
        tax,
        totalPrice,
        paymentMethod: selectedMethod,
        status: "pending",
        orderDate: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    const remainingCart = cart.filter(item => item.userId !== currentUser.id);
    localStorage.setItem("cart", JSON.stringify(remainingCart));

    // ===============================
    // RESET FORM
    // ===============================
    fullName.value = "";
    phone.value = "";
    address.value = "";
    cardNumber.value = "";
    expiry.value = "";
    cvv.value = "";

    fullName.classList.remove("is-invalid");
    phone.classList.remove("is-invalid");
    address.classList.remove("is-invalid");
    cardNumber.classList.remove("is-invalid");
    expiry.classList.remove("is-invalid");
    cvv.classList.remove("is-invalid");

    visaSection.classList.add("d-none");
    document.querySelector('input[name="paymentMethod"][value="cod"]').checked = true;

    subTotalElement.textContent = "$0";
    shippingElement.textContent = "$0";
    taxElement.textContent = "$0";
    totalElement.textContent = "$0";

    document.getElementById("orderList").innerHTML = "";

    alert("Order Placed Successfully");
    window.location.href = "../cart/cart.html";
});

 });