// CART MODULE

// Global variables
let allProducts = [];              // Store all products from localStorage
let currentUser = null;             // Current logged in user
let userCart = [];                  // Current user's cart items
let productToDelete = null;         // Product ID to delete (for single item)
let isClearCartMode = false;        // Flag to differentiate between delete single vs delete all

// Load products from localStorage
function loadProducts() {
    // Fetch products from localStorage or initialize empty array
    allProducts = JSON.parse(localStorage.getItem('products')) || [];
    console.log('✅ Products loaded:', allProducts.length);
    return Promise.resolve(allProducts);
}

// Get product details by ID
function getProductDetails(productId) {
    return allProducts.find(p => p.id === productId) || null;
}

// // Display cart items in the UI
// function displayCart() {
//     const container = document.getElementById('cartItems');
//     const shippingProgress = document.getElementById('shippingProgress');
    
//     if (!container) return;
    
//     // Get current user and cart from localStorage
//     currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     userCart = JSON.parse(localStorage.getItem('cart')) || [];
    

//      if (!currentUser) {
//         showLoginModal();}


    
//     // Filter items for current user only
//     const userCartItems = userCart.filter(item => item.userId === currentUser?.id) || [];
    
//     // If cart is empty show empty cart message
//     if (userCartItems.length === 0) {
//         container.innerHTML = `
//             <div class="empty-cart-modern">
//                 <i class="fas fa-shopping-cart"></i>
//                 <h4>Your cart is empty</h4>
//                 <p>Looks like you haven't added anything to your cart yet.</p>
//                 <a href="/pages/shop/catalog.html" class="btn-shop-now">
//                     <i class="fas fa-store me-2"></i>
//                     Start Shopping
//                 </a>
//             </div>
//         `;
//         if (shippingProgress) shippingProgress.style.display = "none";
//         // document.getElementById('cartSummary').style.display = 'none';
//         return;
//     }

//     if (shippingProgress) shippingProgress.style.display = "block";
//     document.getElementById('cartSummary').style.display = 'block';

//     let html = '';
//     let subtotal = 0;
    
//     // Generate HTML for each cart item
//     userCartItems.forEach(item => {
//         const product = getProductDetails(item.productId);
//         if (!product) return;
        
//         const hasDiscount = product.discount && product.discount > 0;
//         const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
//         const itemTotal = finalPrice * item.quantity;
//         subtotal += itemTotal;

//         html += `
//             <div class="cart-item-modern" data-product-id="${product.id}">
//                 <div class="row align-items-center">
//                     <div class="col-md-2 col-3">
//                         <img src="${product.image || '/assets/images/placeholder.jpg'}" 
//                              class="cart-item-image" 
//                              alt="${product.name}"
//                              onerror="this.src='/assets/images/placeholder.jpg'">
//                     </div>
                    
//                     <div class="col-md-4 col-9">
//                         <div class="cart-item-details">
//                             <h6>${product.name}</h6>
//                             ${hasDiscount ? `
//                                 <div class="discount-badge small">
//                                     <i class="fas fa-tag"></i> -${product.discount}% OFF
//                                 </div>
//                             ` : ''}
//                             <div class="price-details">
//                                 <span class="cart-item-price">$${finalPrice.toFixed(2)}</span>
//                                 ${hasDiscount ? `
//                                     <span class="original-price">$${product.price.toFixed(2)}</span>
//                                 ` : ''}
//                             </div>
//                         </div>
//                     </div>
                    
//                     <div class="col-md-3 col-5 mt-3 mt-md-0">
//                         <div class="quantity-control-modern">
//                             <button class="quantity-btn-modern" onclick="updateQuantity('${product.id}', -1)">
//                                 <i class="fas fa-minus"></i>
//                             </button>
//                             <input type="text" class="quantity-input-modern" value="${item.quantity}" readonly>
//                             <button class="quantity-btn-modern" onclick="updateQuantity('${product.id}', 1)">
//                                 <i class="fas fa-plus"></i>
//                             </button>
//                         </div>
//                     </div>
                    
//                     <div class="col-md-2 col-4 mt-3 mt-md-0 text-center">
//                         <span class="item-total">$${itemTotal.toFixed(2)}</span>
//                     </div>
                    
//                     <div class="col-md-1 col-3 mt-3 mt-md-0 text-center">
//                         <button class="remove-btn-modern" onclick="removeFromCart('${product.id}')">
//                             <i class="fas fa-trash-alt"></i>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `;
//     });

//     container.innerHTML = html;
//     updateCartSummary(subtotal);
// }


// Display cart items in the UI
function displayCart() {
    const container = document.getElementById('cartItems');
    const shippingProgress = document.getElementById('shippingProgress');
    
    if (!container) return;
    
    // Get current user and cart from localStorage
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    userCart = JSON.parse(localStorage.getItem('cart')) || [];
    

    if (!currentUser) {
        showLoginModal();
        return; // مهم: نضيف return عشان يكملش تنفيذ
    }
    
    // Filter items for current user only
    const userCartItems = userCart.filter(item => item.userId === currentUser?.id) || [];
    
    // If cart is empty show empty cart message
    if (userCartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-modern">
                <i class="fas fa-shopping-cart"></i>
                <h4>Your cart is empty</h4>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="/pages/shop/catalog.html" class="btn-shop-now">
                    <i class="fas fa-store me-2"></i>
                    Start Shopping
                </a>
            </div>
        `;
        if (shippingProgress) shippingProgress.style.display = "none";
        document.getElementById('cartSummary').style.display = 'none';
        return;
    }

    if (shippingProgress) shippingProgress.style.display = "block";
    document.getElementById('cartSummary').style.display = 'block';

    let html = '';
    let subtotal = 0;
    
    // Generate HTML for each cart item
    userCartItems.forEach(item => {
        const product = getProductDetails(item.productId);
        if (!product) return;
        
        const hasDiscount = product.discount && product.discount > 0;
        const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
        const itemTotal = finalPrice * item.quantity;
        subtotal += itemTotal;

        html += `
            <div class="cart-item-modern" data-product-id="${product.id}" 
                 onclick="goToProductDetails('${product.id}')" 
                 style="cursor: pointer;">
                <div class="row align-items-center">
                    <div class="col-md-2 col-3">
                        <img src="${product.image || '/assets/images/placeholder.jpg'}" 
                             class="cart-item-image" 
                             alt="${product.name}"
                             onerror="this.src='/assets/images/placeholder.jpg'">
                    </div>
                    
                    <div class="col-md-4 col-9">
                        <div class="cart-item-details">
                            <h6>${product.name}</h6>
                            ${hasDiscount ? `
                                <div class="discount-badge small">
                                    <i class="fas fa-tag"></i> -${product.discount}% OFF
                                </div>
                            ` : ''}
                            <div class="price-details">
                                <span class="cart-item-price">$${finalPrice.toFixed(2)}</span>
                                ${hasDiscount ? `
                                    <span class="original-price">$${product.price.toFixed(2)}</span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-3 col-5 mt-3 mt-md-0">
                        <div class="quantity-control-modern" onclick="event.stopPropagation()">
                            <button class="quantity-btn-modern" onclick="updateQuantity('${product.id}', -1); event.stopPropagation();">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="text" class="quantity-input-modern" value="${item.quantity}" readonly>
                            <button class="quantity-btn-modern" onclick="updateQuantity('${product.id}', 1); event.stopPropagation();">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="col-md-2 col-4 mt-3 mt-md-0 text-center">
                        <span class="item-total">$${itemTotal.toFixed(2)}</span>
                    </div>
                    
                    <div class="col-md-1 col-3 mt-3 mt-md-0 text-center">
                        <button class="remove-btn-modern" onclick="removeFromCart('${product.id}'); event.stopPropagation();">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateCartSummary(subtotal);
}
// Go to product details page
function goToProductDetails(productId) {
    window.location.href = `/pages/shop/product-details.html?id=${productId}`;
}
// Update quantity when +/- buttons are clicked
function updateQuantity(productId, change) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the cart item index
    const cartItemIndex = cart.findIndex(item => item.productId === productId && item.userId === currentUser.id);
    
    if (cartItemIndex === -1) return;
    
    const product = allProducts.find(p => p.id === productId);
    const newQuantity = cart[cartItemIndex].quantity + change;
    
    // Check if quantity goes below 1 (remove item)
    if (newQuantity < 1) {
        removeFromCart(productId);
        cartNotification();
        return;
    }
    
    // Check if quantity exceeds available stock
    if (newQuantity > product.stock) {
        showToast(`Sorry, only ${product.stock} items available in stock`, 'warning');
        return;
    }
    
    // Update quantity and timestamp
    cart[cartItemIndex].quantity = newQuantity;
    cart[cartItemIndex].addedAt = new Date().toISOString();
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    cartNotification();
    showToast(`Quantity updated to ${newQuantity}`, 'success');
}

// Remove single item from cart with modal confirmation
function removeFromCart(productId) {
    productToDelete = productId;
    isClearCartMode = false; // Set mode to delete single item
    
    // Update modal content for delete operation
    updateModalContent('delete');
    
    const modalElement = document.getElementById('deleteConfirmModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Clear all items from cart
function clearCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showToast('Please login first', 'error');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const userCartItems = cart.filter(item => item.userId === currentUser.id);
    
    // Check if cart is already empty
    if (userCartItems.length === 0) {
        showToast('Cart is already empty', 'info');
        return;
    }
    
    isClearCartMode = true; // Set mode to clear all items
    
    // Update modal content for clear all operation
    updateModalContent('clear');
    
    const modalElement = document.getElementById('deleteConfirmModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Update modal content based on operation type (delete single vs clear all)
// Update modal content based on operation type (delete single vs clear all)
function updateModalContent(action) {
    const modalTitle = document.querySelector('#deleteConfirmModal .modal-title');
    const modalBody = document.querySelector('#deleteConfirmModal .modal-body');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    // Calculate number of items in cart for current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemCount = cart.filter(item => item.userId === currentUser?.id).length;
    
    if (action === 'delete') {
        // Delete single item mode
        modalTitle.innerHTML = '<i class="fas fa-trash-alt text-danger me-2"></i> Delete Item';
        modalBody.innerHTML = `
            <div class="text-center">
                <div class="modal-icon-wrapper mb-3">
                    <i class="fas fa-trash-alt text-danger" style="font-size: 3.5rem; opacity: 0.9;"></i>
                </div>
                <p class="mb-2 fw-bold">Remove this item?</p>
                <p class="text-muted mb-0">This item will be removed from your cart.</p>
            </div>
        `;
        confirmBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Delete Item';
        confirmBtn.className = 'btn btn-danger';
    } else {
        // Clear all items mode
        modalTitle.innerHTML = '<i class="fas fa-trash-alt text-danger me-2"></i> Clear Cart';
        modalBody.innerHTML = `
            <div class="text-center">
                <div class="modal-icon-wrapper mb-3">
                    <i class="fas fa-trash-alt text-danger" style="font-size: 3.5rem; opacity: 0.9;"></i>
                </div>
                <p class="mb-2 fw-bold">Clear your entire cart?</p>
                <p class="text-muted mb-1">You have <strong class="text-primary">${itemCount}</strong> items in your cart.</p>
                <p class="text-muted small mb-0">All products will be removed from your cart.</p>
            </div>
        `;
        confirmBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Clear All Items';
        confirmBtn.className = 'btn btn-danger';
    }
}

// Update cart summary with subtotal, shipping, tax and total
function updateCartSummary(subtotal) {
    // Free shipping for orders over $100
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    cartNotification();
}

// Direct to checkout page
function checkout() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/pages/auth/login.html';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const userCartItems = cart.filter(item => item.userId === currentUser.id);
    
    // Check if cart is empty
    if (userCartItems.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    showToast('Proceeding to checkout...', 'info');
    window.location.href = '/pages/order/checkout.html';
}



/// show login modal
// ========== LOGIN MODAL FUNCTIONS ==========
function showLoginModal() {
    const modalElement = document.getElementById('loginRequiredModal');
    if (!modalElement) {
        console.error('Modal not found!');
        return;
    }
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}



// Show Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastMessage');
    const toastText = document.getElementById('toastText');
    const toastIcon = document.getElementById('toastIcon');
    
    // Set icon based on toast type
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle';
    } else if (type === 'info') {
        toastIcon.className = 'fas fa-info-circle';
    }
    
    toast.className = `toast-simple ${type}`;
    toastText.textContent = message;
    toast.classList.add('show');
    
    // Clear previous timeout
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
    
    // Auto hide after 3 seconds
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update cart badge notification
function cartNotification() {
    const cartIcon = document.querySelector('.fa-cart-shopping');
    if (!cartIcon) {
        setTimeout(cartNotification, 100);
        return;
    }
    
    const cartLink = cartIcon.closest('a');
    if (!cartLink) return;
    
    cartLink.style.position = "relative";
    
    // Remove existing badge
    let existingBadge = cartLink.querySelector('.cart-badge-modern');
    if (existingBadge) existingBadge.remove();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!currentUser) return;
    
    // Calculate total quantity for current user
    const userCartItems = cart.filter(item => item.userId === currentUser.id);
    const totalQuantity = userCartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalQuantity <= 0) return;
    
    // Create and add badge
    const badge = document.createElement("span");
    badge.classList.add("cart-badge-modern");
    badge.textContent = totalQuantity;
    cartLink.appendChild(badge);
}

// Handle modal confirmation button click
document.addEventListener('DOMContentLoaded', function() {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) return;
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (isClearCartMode) {
                // Clear all items mode - remove all items for current user
                cart = cart.filter(item => item.userId !== currentUser.id);
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
                cartNotification();
                showToast('🗑️ Cart cleared successfully!', 'success');
            } else {
                // Delete single item mode
                if (productToDelete) {
                    cart = cart.filter(item => !(item.productId === productToDelete && item.userId === currentUser.id));
                    localStorage.setItem('cart', JSON.stringify(cart));
                    displayCart();
                    cartNotification();
                    showToast('Product removed from cart', 'success');
                    productToDelete = null;
                }
            }
            
            // Close modal
            const modalElement = document.getElementById('deleteConfirmModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
            
            // Reset mode flag
            isClearCartMode = false;
        });
    }
    
    // Initialize page
    loadProducts().then(() => {
        displayCart();
        cartNotification();
    });
});

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkout = checkout;
window.showToast = showToast;