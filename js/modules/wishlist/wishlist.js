
// Global variables
let allProducts = [];
let currentUser = null;
let wishlistItemToDelete = null;  // For single item deletion

// Load products from localStorage
function loadProducts() {
    allProducts = JSON.parse(localStorage.getItem('products')) || [];
    console.log('✅ Products loaded:', allProducts.length);
    return Promise.resolve(allProducts);
}

// Get product details by ID
function getProductDetails(productId) {
    return allProducts.find(p => p.id === productId) || null;
}

// Display wishlist items
function displayWishlist() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;

    currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // If not logged in, show login modal
    if (!currentUser) {
        showLoginModal();
        container.innerHTML = ''; // Clear container
        return;
    }

    // Get wishlist data
    let wishlistData = JSON.parse(localStorage.getItem('wishlist')) || {};
    let userWishlist = wishlistData[currentUser.id] || [];

    // If wishlist empty
    if (userWishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart"></i>
                <h4>Your wishlist is empty</h4>
                <p>Save your favorite items here!</p>
                <a href="/pages/shop/catalog.html" class="btn-shop-now">
                    <i class="fas fa-store me-2"></i>
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }

    let html = '';
    userWishlist.forEach(item => {
        const product = getProductDetails(item.productId);
        if (!product) return;

        const hasDiscount = product.discount && product.discount > 0;
        const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

        html += `
            <div class="wishlist-item-modern" data-product-id="${product.id}" 
                 onclick="goToProductDetails('${product.id}')" 
                 style="cursor: pointer;">
                <div class="row align-items-center">
                    <div class="col-md-2 col-3">
                        <img src="${product.image || '/assets/images/placeholder.jpg'}" 
                             class="wishlist-item-image" 
                             alt="${product.name}"
                             onerror="this.src='/assets/images/placeholder.jpg'">
                    </div>
                    
                    <div class="col-md-4 col-9">
                        <div class="wishlist-item-details">
                            <h6>${product.name}</h6>
                            ${hasDiscount ? `
                                <div class="discount-badge small">
                                    <i class="fas fa-tag"></i> -${product.discount}% OFF
                                </div>
                            ` : ''}
                            <div class="price-details">
                                <span class="wishlist-item-price">$${finalPrice.toFixed(2)}</span>
                                ${hasDiscount ? `
                                    <span class="original-price">$${product.price.toFixed(2)}</span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6 col-12 mt-3 mt-md-0">
                        <div class="wishlist-actions" onclick="event.stopPropagation()">
                            <button class="btn-add-to-cart" onclick="addToCartFromWishlist('${product.id}')">
                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                            </button>
                            <button class="btn-remove-wishlist" onclick="removeFromWishlist('${product.id}')">
                                <i class="fas fa-trash me-2"></i>Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateWishlistCount(); // Update navbar badge if you have it
}

// Go to product details
function goToProductDetails(productId) {
    window.location.href = `/pages/shop/product-details.html?id=${productId}`;
}

// Add to cart from wishlist
function addToCartFromWishlist(productId) {
    const product = getProductDetails(productId);
    if (!product) return;

    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showLoginModal();
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => 
        item.userId === currentUser.id && item.productId === productId
    );

    if (existingItem) {
        // Check stock
        if (existingItem.quantity + 1 > product.stock) {
            showToast(`Sorry, only ${product.stock} items available`, 'warning');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            userId: currentUser.id,
            productId: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    cartNotification();
    showToast('✅ Added to cart!', 'success');

    // Optionally remove from wishlist
    // if (confirm('Remove from wishlist as well?')) {
    //     removeFromWishlist(productId);
    // }
}

// Remove single item from wishlist with confirmation
function removeFromWishlist(productId) {
    wishlistItemToDelete = productId;
    
    // Update modal content for single delete
    const modalTitle = document.querySelector('#deleteConfirmModal .modal-title');
    const modalBody = document.querySelector('#deleteConfirmModal .modal-body');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    modalTitle.innerHTML = '<i class="fas fa-trash-alt text-danger me-2"></i> Remove Item';
    modalBody.innerHTML = `
        <div class="text-center">
            <div class="modal-icon-wrapper mb-3">
                <i class="fas fa-trash-alt text-danger" style="font-size: 3.5rem; opacity: 0.9;"></i>
            </div>
            <p class="mb-2 fw-bold">Remove this item from wishlist?</p>
            <p class="text-muted mb-0">It will be removed from your saved items.</p>
        </div>
    `;
    confirmBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Remove Item';
    
    const modalElement = document.getElementById('deleteConfirmModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Clear entire wishlist
function clearWishlist() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    let wishlistData = JSON.parse(localStorage.getItem('wishlist')) || {};
    let userWishlist = wishlistData[currentUser.id] || [];

    if (userWishlist.length === 0) {
        showToast('Wishlist is already empty', 'info');
        return;
    }

    // Update modal for clear all
    const modalTitle = document.querySelector('#deleteConfirmModal .modal-title');
    const modalBody = document.querySelector('#deleteConfirmModal .modal-body');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    modalTitle.innerHTML = '<i class="fas fa-trash-alt text-danger me-2"></i> Clear Wishlist';
    modalBody.innerHTML = `
        <div class="text-center">
            <div class="modal-icon-wrapper mb-3">
                <i class="fas fa-trash-alt text-danger" style="font-size: 3.5rem; opacity: 0.9;"></i>
            </div>
            <p class="mb-2 fw-bold">Clear your entire wishlist?</p>
            <p class="text-muted mb-1">You have <strong class="text-primary">${userWishlist.length}</strong> items in your wishlist.</p>
            <p class="text-muted small mb-0">All saved items will be removed.</p>
        </div>
    `;
    confirmBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Clear All Items';

    // Set a flag to indicate clear all mode
    window.isClearingAll = true;
    
    const modalElement = document.getElementById('deleteConfirmModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Handle modal confirmation
document.addEventListener('DOMContentLoaded', function() {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) return;

            let wishlistData = JSON.parse(localStorage.getItem('wishlist')) || {};

            if (window.isClearingAll) {
                // Clear all items
                wishlistData[currentUser.id] = [];
                localStorage.setItem('wishlist', JSON.stringify(wishlistData));
                showToast('🗑️ Wishlist cleared!', 'success');
            } else {
                // Delete single item
                if (wishlistItemToDelete) {
                    wishlistData[currentUser.id] = (wishlistData[currentUser.id] || []).filter(
                        item => item.productId !== wishlistItemToDelete
                    );
                    localStorage.setItem('wishlist', JSON.stringify(wishlistData));
                    showToast('Item removed from wishlist', 'success');
                    wishlistItemToDelete = null;
                }
            }

            // Refresh display
            displayWishlist();
            updateWishlistCount();

            // Close modal
            const modalElement = document.getElementById('deleteConfirmModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();

            // Reset flags
            window.isClearingAll = false;
        });
    }

    // Initialize page
    loadProducts().then(() => {
        displayWishlist();
    });

    // Add event listener to clear the flag when modal is hidden (optional)
    const modalElement = document.getElementById('deleteConfirmModal');
    modalElement.addEventListener('hidden.bs.modal', function() {
        window.isClearingAll = false;
        wishlistItemToDelete = null;
    });
});

// Show login modal
function showLoginModal() {
    const modalElement = document.getElementById('loginRequiredModal');
    if (!modalElement) {
        console.error('Modal not found!');
        return;
    }
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Show Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastMessage');
    const toastText = document.getElementById('toastText');
    const toastIcon = document.getElementById('toastIcon');
    
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
    
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update wishlist count in navbar (if you want)
function updateWishlistCount() {
    const wishlistLink = document.querySelector('.fa-heart')?.closest('a');
    if (!wishlistLink) return;

    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    let wishlistData = JSON.parse(localStorage.getItem('wishlist')) || {};
    let userWishlist = wishlistData[currentUser.id] || [];

    // Remove old badge
    let existingBadge = wishlistLink.querySelector('.wishlist-badge-modern');
    if (existingBadge) existingBadge.remove();

    if (userWishlist.length === 0) return;

    wishlistLink.style.position = 'relative';
    const badge = document.createElement('span');
    badge.classList.add('wishlist-badge-modern');
    badge.textContent = userWishlist.length;
    wishlistLink.appendChild(badge);
}

// Cart notification (if needed)
function cartNotification() {
    const cartIcon = document.querySelector('.fa-cart-shopping');
    if (!cartIcon) {
        setTimeout(cartNotification, 100);
        return;
    }
    
    const cartLink = cartIcon.closest('a');
    if (!cartLink) return;
    
    cartLink.style.position = "relative";
    
    let existingBadge = cartLink.querySelector('.cart-badge-modern');
    if (existingBadge) existingBadge.remove();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!currentUser) return;
    
    const userCartItems = cart.filter(item => item.userId === currentUser.id);
    const totalQuantity = userCartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalQuantity <= 0) return;
    
    const badge = document.createElement("span");
    badge.classList.add("cart-badge-modern");
    badge.textContent = totalQuantity;
    cartLink.appendChild(badge);
}

// Initialize cart notification on page load
document.addEventListener('DOMContentLoaded', function() {
    // Already have one from above, but add cartNotification after products load
    loadProducts().then(() => {
        cartNotification();
    });
});

// Make functions global
window.addToCartFromWishlist = addToCartFromWishlist;
window.removeFromWishlist = removeFromWishlist;
window.clearWishlist = clearWishlist;
window.goToProductDetails = goToProductDetails;