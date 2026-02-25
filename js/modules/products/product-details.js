// read id
// fetch products.json
// show product

// addToCartBtn.onclick = () => {
//   addToCart(product);
// };



// const params = new URLSearchParams(window.location.search);
// const productId = params.get("id");


// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Global variables
let currentProduct = null;
let allProducts = [];
let selectedRating = 0;
let allReviews = {};

// Quantity Functions
// function increaseQuantity() {
//     const input = document.getElementById('quantity');
//     if (parseInt(input.value) < currentProduct.stock) {
//         input.value = parseInt(input.value) + 1;
//     }
// }
// Quantity Functions with login check
function increaseQuantity() {
    // Check if user is logged in first
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Show login modal if not logged in
        showLoginModal();
        return;
    }
    
    const input = document.getElementById('quantity');
    if (parseInt(input.value) < currentProduct.stock) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseQuantity() {
    // Check if user is logged in first
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Show login modal if not logged in
        showLoginModal();
        return;
    }
    
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// function decreaseQuantity() {
//     const input = document.getElementById('quantity');
//     if (parseInt(input.value) > 1) {
//         input.value = parseInt(input.value) - 1;
//     }
// }

// // Load product data from JSON
// function loadProduct() {
//     fetch('/data/products.json')
//         .then(res => res.json())
//         .then(products => {
//             allProducts = products;
//             const productId = new URLSearchParams(window.location.search).get('id');
//             currentProduct = products.find(p => p.id === productId);
//             displayProduct();
//         })
//         .catch(err => console.error('Error loading JSON:', err));
// }
// Load product from localStorage
function loadProduct() {
    allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const productId = new URLSearchParams(window.location.search).get('id');
    currentProduct = allProducts.find(p => p.id === productId);
    displayProduct();
}





// Display Product Details
function displayProduct() {
    if (!currentProduct) return;

    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('mainImage').src = currentProduct.image;
    document.getElementById('productBreadcrumb').textContent = currentProduct.name;

    updateProductRatingFromReviews();

    if (currentProduct.discount > 0) {
        const originalPrice = currentProduct.price;
        const finalPrice = originalPrice * (1 - currentProduct.discount / 100);
        document.getElementById('NewPrice').textContent = `$${finalPrice.toFixed(0)}`;
        document.getElementById('originalPrice').textContent = `$${originalPrice.toFixed(0)}`;
        document.getElementById('discountPrice').textContent = `${currentProduct.discount}% OFF`;
    } else {
        document.getElementById('NewPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
        document.getElementById('discountPrice').style.display = 'none';
    }
    
    document.getElementById('productDescription').textContent = currentProduct.description.split(' ').slice(0, 10).join(' ');
    document.getElementById('productCategory').textContent = currentProduct.category;
    document.getElementById('productBrand').textContent = currentProduct.brand;
    document.getElementById('productSku').textContent = currentProduct.id;

    // Product description
    document.getElementById('fullDescription').innerHTML = `
        <div class="product-overview">
            <h6 class="overview-title">
                <i class="fas fa-info-circle me-2"></i>
                Product Overview
            </h6>
            <ul class="description-list">
                ${currentProduct.description.split(/[،,]\s*/).map(item => item.trim()).filter(item => item).map(item => `
                    <li>
                        <i class="fas fa-check-circle me-2"></i>
                        <span>${item}</span>
                    </li>
                `).join('')}
            </ul>
        </div>`;

    countInStock();
    displaylistofimgs();
    displayRelatedProducts();
}

// Count in stock and display availability
function countInStock() {
    if (!currentProduct) return;

    const stockElement = document.getElementById('stockStatus');
    if (currentProduct.stock === 0) {
        stockElement.textContent = "Not Available";
        stockElement.style.color = "red";
    } else {
        stockElement.textContent = `In Stock (${currentProduct.stock} items)`;
        stockElement.style.color = "green";
    }
}

// // Display Related Products
// function displayRelatedProducts() {
//     const container = document.getElementById('relatedProducts');
//     if (!container || !currentProduct || !allProducts) return;

//     const data = JSON.parse(localStorage.getItem('ecommerce_app')) || {};
//     const allReviews = data.reviews || {};

//     const related = allProducts
//         .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
//         .slice(0, 4);

//     if (related.length === 0) {
//         container.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">No related products found</p></div>';
//         return;
//     }

//     container.innerHTML = related.map(product => {
//         const hasDiscount = product.discount && product.discount > 0;
//         const finalPrice = hasDiscount
//             ? product.price * (1 - product.discount / 100)
//             : product.price;

//         const productReviews = allReviews[product.id] || [];
//         const reviewCount = productReviews.length;
//         const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
//         const avg = productReviews.length > 0 ? total / productReviews.length : 0;

//         return `
//             <div class="col-md-3 col-6">
//                 <div class="related-product-card" onclick="viewProduct('${product.id}')">
//                     <div class="related-product-image-wrapper" style="position: relative; overflow: hidden;">
//                         <img src="${product.image}" class="related-product-image" alt="${product.name}" 
//                             onerror="this.src='/assets/images/placeholder.jpg'">
                        
//                         ${hasDiscount ? `
//                             <div class="discount-badge" style="
//                                 position: absolute;
//                                 top: 12px;
//                                 right: 12px;
//                                 background: linear-gradient(135deg, var(--danger), #ff6b6b);
//                                 color: white;
//                                 padding: 8px 12px;
//                                 border-radius: 30px;
//                                 font-size: 0.9rem;
//                                 font-weight: 700;
//                                 box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4);
//                                 z-index: 10;
//                                 display: flex;
//                                 align-items: center;
//                                 gap: 5px;
//                                 animation: pulseDiscount 2s infinite;
//                             ">
//                                 <i class="fas fa-tag"></i>
//                                 <span>-${product.discount}%</span>
//                             </div>
//                         ` : ''}
//                     </div>
                    
//                     <div class="related-product-body">
//                         <h6 class="related-product-title">${product.name}</h6>
//                         <div class="stars small mb-2">
//                             ${generateStarsFromAvg(avg)}
//                             <span class="rating-count ms-1">(${reviewCount})</span>
//                         </div>
                        
//                         <div class="d-flex align-items-center flex-wrap gap-2">
//                             <span class="related-product-price" style="
//                                 color: var(--primary);
//                                 font-weight: 700;
//                                 font-size: 1.2rem;
//                             ">
//                                 $${finalPrice.toFixed(2)}
//                             </span>
                            
//                             ${hasDiscount ? `
//                                 <span class="original-price" style="
//                                     color: var(--secondary);
//                                     text-decoration: line-through;
//                                     font-size: 0.9rem;
//                                 ">
//                                     $${product.price.toFixed(0)}
//                                 </span>
                                
//                                 <span class="save-badge" style="
//                                     background: var(--success);
//                                     color: white;
//                                     padding: 3px 8px;
//                                     border-radius: 20px;
//                                     font-size: 0.7rem;
//                                     font-weight: 600;
//                                     white-space: nowrap;
//                                 ">
//                                     Save $${(product.price - finalPrice).toFixed(0)}
//                                 </span>
//                             ` : ''}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }).join('');
// }



function displayRelatedProducts() {
    const container = document.getElementById('relatedProducts');
    if (!container || !currentProduct || !allProducts) return;

    const allReviews = JSON.parse(localStorage.getItem('reviews')) || {};

    const related = allProducts
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    if (related.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">No related products found</p></div>';
        return;
    }

    container.innerHTML = related.map(product => {
        const hasDiscount = product.discount && product.discount > 0;
        const finalPrice = hasDiscount
            ? product.price * (1 - product.discount / 100)
            : product.price;

        const productReviews = allReviews[product.id] || [];
        const reviewCount = productReviews.length;
        const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = productReviews.length > 0 ? total / productReviews.length : 0;

        return `
            <div class="col-md-3 col-6">
                <div class="related-product-card" onclick="viewProduct('${product.id}')">
                    <div class="related-product-image-wrapper" style="position: relative; overflow: hidden;">
                        <img src="${product.image}" class="related-product-image" alt="${product.name}" 
                            onerror="this.src='/assets/images/placeholder.jpg'">
                        
                        ${hasDiscount ? `
                            <div class="discount-badge" style="
                                position: absolute;
                                top: 12px;
                                right: 12px;
                                background: linear-gradient(135deg, var(--danger), #ff6b6b);
                                color: white;
                                padding: 8px 12px;
                                border-radius: 30px;
                                font-size: 0.9rem;
                                font-weight: 700;
                                box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4);
                                z-index: 10;
                                display: flex;
                                align-items: center;
                                gap: 5px;
                                animation: pulseDiscount 2s infinite;
                            ">
                                <i class="fas fa-tag"></i>
                                <span>-${product.discount}%</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="related-product-body">
                        <h6 class="related-product-title">${product.name}</h6>
                        <div class="stars small mb-2">
                            ${generateStarsFromAvg(avg)}
                            <span class="rating-count ms-1">(${reviewCount})</span>
                        </div>
                        
                        <div class="d-flex align-items-center flex-wrap gap-2">
                            <span class="related-product-price" style="
                                color: var(--primary);
                                font-weight: 700;
                                font-size: 1.2rem;
                            ">
                                $${finalPrice.toFixed(2)}
                            </span>
                            
                            ${hasDiscount ? `
                                <span class="original-price" style="
                                    color: var(--secondary);
                                    text-decoration: line-through;
                                    font-size: 0.9rem;
                                ">
                                    $${product.price.toFixed(0)}
                                </span>
                                
                                <span class="save-badge" style="
                                    background: var(--success);
                                    color: white;
                                    padding: 3px 8px;
                                    border-radius: 20px;
                                    font-size: 0.7rem;
                                    font-weight: 600;
                                    white-space: nowrap;
                                ">
                                    Save $${(product.price - finalPrice).toFixed(0)}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
// Related item click
function viewProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Generate star rating for reviews
function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Generate stars from average rating
function generateStarsFromAvg(avg) {
    let stars = '';
    const fullStars = Math.floor(avg);
    const hasHalfStar = avg % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Display thumbnails
function displaylistofimgs() {
    if (!currentProduct) return;
    const container = document.getElementById('listofimgs');
    const allImages = [currentProduct.image, ...currentProduct.detailImages];
    container.innerHTML = allImages.map((img, index) => `
        <img src="${img}" class="listofimgs ${index === 0 ? 'active' : ''}" 
            onclick="changeMainImage('${img}', this)" alt="Thumbnail ${index + 1}">
    `).join('');
}

// Change main image on thumbnail click
function changeMainImage(src, thumb) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.listofimgs').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

// // Add to cart button
// function addToCart() {
//     let ecommerceData = JSON.parse(localStorage.getItem('ecommerce_app'));
//     // if (!ecommerceData || !ecommerceData.users || !ecommerceData.users.currentUser) {
//     //     showToast('You must login first', 'error');
//     //     window.location.href = '/auth/login.html';
//     //     return;
//     // }
//     const quantity = parseInt(document.getElementById('quantity').value);
//     const userId = ecommerceData.users.currentUser.id;

//     if (!ecommerceData.carts) {
//         ecommerceData.carts = {};
//     }
//     if (!ecommerceData.carts[userId]) {
//         ecommerceData.carts[userId] = [];
//     }
//     const existingItem = ecommerceData.carts[userId].find(
//         item => item.productId === currentProduct.id);

//     if (existingItem) {
//         existingItem.quantity += quantity;
//         existingItem.addedAt = new Date().toISOString();
//         showToast(`✅ Updated quantity of ${currentProduct.name} in cart`, 'success');
//     } else {
//         ecommerceData.carts[userId].push({
//             productId: currentProduct.id,
//             quantity: quantity,
//             addedAt: new Date().toISOString()
//         });
//         showToast(`✅ Added ${currentProduct.name} to cart`, 'success');
//     }
//     localStorage.setItem('ecommerce_app', JSON.stringify(ecommerceData));
//     cartNotification();
// }



// Add to cart button
// function addToCart() {
//     //fetch data from localStorage
//     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     let products = JSON.parse(localStorage.getItem('products')) || [];
//     let users = JSON.parse(localStorage.getItem('users')) || [];
//     //fetch cart from localStorage or initialize empty array    
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];

//     //check if user is logged in
//     if (!currentUser) {
//         showToast('You must login first', 'error');
//         window.location.href = '/auth/login.html';
//         return;
//     }
    
//     const quantity = parseInt(document.getElementById('quantity').value);
//     //search for existing cart item for this product and user    
//     const existingItemIndex = cart.findIndex(
//         item => item.productId === currentProduct.id && item.userId === currentUser.id
//     );

//     if (existingItemIndex !== -1) {
//         //update quantity and timestamp of existing item
//         cart[existingItemIndex].quantity += quantity;
//         cart[existingItemIndex].addedAt = new Date().toISOString();
//         showToast(`✅ Updated quantity of ${currentProduct.name} in cart ${cart[existingItemIndex].quantity}`, 'success');
//     } else {
//    //add new item to cart with userId, productId, quantity, and timestamp
//       cart.push({
//             userId: currentUser.id,
//             productId: currentProduct.id,
//             quantity: quantity,
//             addedAt: new Date().toISOString()
//         });
//         showToast(`✅ Added ${currentProduct.name} to cart`, 'success');
//     }
//    //save updated cart back to localStorage    
//     localStorage.setItem('cart', JSON.stringify(cart));
//     cartNotification();
// }

// // Buy Now
// function buyNow() {
//     addToCart();
//     setTimeout(() => {
//         window.location.href = '/pages/cart/cart.html';
//     }, 500);
//     cartNotification();
// }




// Add to cart button
function addToCart() {
    //fetch data from localStorage
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    //check if user is logged in
    if (!currentUser) {
        // Show login required modal instead of redirect
        showLoginModal();
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Check if quantity exceeds available stock
    if (quantity > currentProduct.stock) {
        showToast(`Sorry, only ${currentProduct.stock} items available`, 'warning');
        return;
    }
    
    //search for existing cart item for this product and user    
    const existingItemIndex = cart.findIndex(
        item => item.productId === currentProduct.id && item.userId === currentUser.id
    );

    if (existingItemIndex !== -1) {
        // Check total quantity against stock
        const newTotal = cart[existingItemIndex].quantity + quantity;
        if (newTotal > currentProduct.stock) {
            showToast(`Sorry, only ${currentProduct.stock} items available total`, 'warning');
            return;
        }
        
        //update quantity and timestamp of existing item
        cart[existingItemIndex].quantity = newTotal;
        cart[existingItemIndex].addedAt = new Date().toISOString();
        showToast(`✅ Updated quantity: ${currentProduct.name} (${newTotal})`, 'success');
    } else {
        //add new item to cart with userId, productId, quantity, and timestamp
        cart.push({
            userId: currentUser.id,
            productId: currentProduct.id,
            quantity: quantity,
            addedAt: new Date().toISOString(),
            productName: currentProduct.name,
            productImage: currentProduct.image,
            productPrice: currentProduct.discount > 0 
                ? currentProduct.price * (1 - currentProduct.discount / 100) 
                : currentProduct.price
        });
        showToast(`✅ Added ${currentProduct.name} to cart`, 'success');
    }
    
    //save updated cart back to localStorage    
    localStorage.setItem('cart', JSON.stringify(cart));
    cartNotification();
}

// Buy Now
function buyNow() {
    // Check if user is logged in first
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Show login required modal
        showLoginModal();
        return;
    }
    
    // If logged in, proceed with add to cart and redirect
    addToCart();
    setTimeout(() => {
        window.location.href = '/pages/cart/cart.html';
    }, 500);
}

// Show login required modal
// function showLoginModal() {
//     const modalElement = document.getElementById('loginRequiredModal');
//     const modal = new bootstrap.Modal(modalElement);
//     modal.show();
// }


// Show login required modal
function showLoginModal() {
    const modalElement = document.getElementById('loginRequiredModal');
    
    // Add custom message based on what user tried to do
    const modalBody = modalElement.querySelector('.modal-body p.mb-2.fw-bold');
    const originalText = modalBody.textContent;
    
    // You can customize the message here if needed
    // modalBody.textContent = 'You need to login first!';
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // Reset message when modal is closed (optional)
    modalElement.addEventListener('hidden.bs.modal', function() {
        modalBody.textContent = originalText;
    }, { once: true });
}

// Handle login now button
document.addEventListener('DOMContentLoaded', function() {
    const loginNowBtn = document.getElementById('loginNowBtn');
    if (loginNowBtn) {
        loginNowBtn.addEventListener('click', function() {
            window.location.href = '/pages/auth/login.html';
        });
    }
    
    // Initialize page
    loadProduct();
    cartNotification();
});
// Show Tab
function showTab(e, tab) {
    document.querySelectorAll('.custom-tab')
        .forEach(t => t.classList.remove('active'));

    e.currentTarget.classList.add('active');

    document.getElementById('descriptionTab').style.display =
        tab === 'description' ? 'block' : 'none';

    document.getElementById('reviewsTab').style.display =
        tab === 'reviews' ? 'block' : 'none';

    if (tab === 'reviews') {
        loadReviews();
    }
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

// Cart notification
// function cartNotification() {
//     const cartIcon = document.querySelector('.fa-cart-shopping');
//     if (!cartIcon) {
//         setTimeout(cartNotification, 100);
//         return;
//     }
    
//     const cartLink = cartIcon.closest('a');
//     if (!cartLink) return;
    
//     cartLink.style.position = "relative";
//     let existingBadge = cartLink.querySelector('.cart-badge-modern');
//     if (existingBadge) existingBadge.remove();
    
//     const badge = document.createElement("span");
//     badge.classList.add("cart-badge-modern");
    
//     const data = JSON.parse(localStorage.getItem('ecommerce_app'));
//     const currentUser = data?.users?.currentUser;
//     const cartItems = data?.carts?.[currentUser?.id] || [];
//     const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
//     if (totalQuantity <= 0) return;
    
//     badge.textContent = totalQuantity;
//     cartLink.appendChild(badge);
// }




// Cart notification
function cartNotification() {
    const cartIcon = document.querySelector('.fa-cart-shopping');
    if (!cartIcon) {
        setTimeout(cartNotification, 100);
        return;
    }
    
    const cartLink = cartIcon.closest('a');
    if (!cartLink) return;
    
    cartLink.style.position = "relative";
    //  remove num old    
    let existingBadge = cartLink.querySelector('.cart-badge-modern');
    if (existingBadge) existingBadge.remove();
   //fetch currentuser and cart    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!currentUser) return;
    //Calculate quantity    
    const userCartItems = cart.filter(item => item.userId === currentUser.id);
    const totalQuantity = userCartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity <= 0) return;
    const badge = document.createElement("span");
    badge.classList.add("cart-badge-modern");
    badge.textContent = totalQuantity;
    cartLink.appendChild(badge);
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

// // Load reviews
// function loadReviews() {
//     if (!currentProduct) return;

//     const data = JSON.parse(localStorage.getItem('ecommerce_app')) || {};
//     const productReviews = data.reviews?.[currentProduct.id] || [];

//     displayReviews(productReviews);
//     updateProductRatingFromReviews();
// }
// Load reviews
function loadReviews() {
    if (!currentProduct) return;
    let allReviews = JSON.parse(localStorage.getItem('reviews')) || {};
    const productReviews = allReviews[currentProduct.id] || [];
    displayReviews(productReviews);
    updateProductRatingFromReviews();
}

// Display reviews
function displayReviews(reviews) {
    const container = document.getElementById('reviewsList');
    if (!container) return;

    if (!document.querySelector('.review-summary')) {
        addReviewSummary();
    }

    let html = '';
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(review => {
        const stars = generateStars(review.rating);

        html += `
            <div class="review-item">
                <div class="review-avatar">
                    <img src="${review.userAvatar || 'https://randomuser.me/api/portraits/men/1.jpg'}" 
                        alt="${review.userName}"
                        onerror="this.src='https://randomuser.me/api/portraits/men/1.jpg'">
                </div>
                <div class="review-content">
                    <div class="review-header">
                        <span class="reviewer-name">${review.userName}</span>
                    </div>
                    <div class="review-date">${formatDate(review.date)}</div>
                    <div class="review-stars">${stars}</div>
                    <p class="review-text">${review.comment}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateReviewSummary(reviews);
}
// Submit review form with login check
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Check if user is logged in first
            const currentUser = getCurrentUser();
            if (!currentUser) {
                // Show login modal if not logged in
                showLoginModal();
                return;
            }

            const rating = document.getElementById('reviewRating').value;
            const comment = document.getElementById('reviewComment').value.trim();
            
            if (!rating || rating === '0') {
                showToast('Please select a rating', 'warning');
                return;
            }

            if (!comment) {
                showToast('Please write your review', 'warning');
                return;
            }

            const newReview = {
                reviewId: 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                userId: currentUser.id,
                userName: currentUser.name,
                userAvatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
                date: new Date().toISOString().split('T')[0],
                rating: parseInt(rating),
                comment: comment
            };

            let allReviews = JSON.parse(localStorage.getItem('reviews')) || {};

            if (!allReviews[currentProduct.id]) {
                allReviews[currentProduct.id] = [];
            }

            allReviews[currentProduct.id].push(newReview);
            localStorage.setItem('reviews', JSON.stringify(allReviews));

            showToast('Review submitted successfully!', 'success');

            document.getElementById('reviewComment').value = '';
            setRating(0);

            loadReviews();
            updateProductRatingFromReviews();
        });
    }
});
// Add review summary section
function addReviewSummary() {
    const reviewsTab = document.getElementById('reviewsTab');
    if (!reviewsTab) return;
    
    if (document.querySelector('.review-summary')) return;
    
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    const summaryHTML = `
        <div class="review-summary">
            <div class="summary-left">
                <span class="avg-rating">0.0</span>
                <div class="stars-display">
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                </div>
                <span class="review-count">0 reviews</span>
            </div>
        </div>
    `;

    reviewsList.insertAdjacentHTML('beforebegin', summaryHTML);
}

// Update review summary
function updateReviewSummary(reviews) {
    const avgEl = document.querySelector('.avg-rating');
    const starsEl = document.querySelector('.stars-display');
    const countEl = document.querySelector('.review-count');

    if (!avgEl || !starsEl || !countEl) return;

    if (reviews.length === 0) {
        avgEl.textContent = '0.0';
        starsEl.innerHTML = `
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
        `;
        countEl.textContent = '0 reviews';
        return;
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = (total / reviews.length).toFixed(1);

    let starsHtml = '';
    const avgValue = parseFloat(avg);

    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(avgValue)) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i < Math.ceil(avgValue) && avgValue % 1 !== 0) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }

    avgEl.textContent = avg;
    starsEl.innerHTML = starsHtml;
    countEl.textContent = `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`;
}

// Update product rating based on reviews
// function updateProductRatingFromReviews() {
//     if (!currentProduct) return;

//     const data = JSON.parse(localStorage.getItem('ecommerce_app')) || {};
//     const productReviews = data.reviews?.[currentProduct.id] || [];

//     if (productReviews.length === 0) {
//         document.getElementById('productRating').innerHTML = generateStars(0);
//         document.getElementById('reviewsCount').textContent = '(0 reviews)';
//         return;
//     }

//     const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
//     const avg = total / productReviews.length;

//     document.getElementById('productRating').innerHTML = generateStarsFromAvg(avg);
//     document.getElementById('reviewsCount').textContent = `(${productReviews.length} reviews)`;
// }

// Update product rating based on reviews
function updateProductRatingFromReviews() {
    if (!currentProduct) return;

    let allReviews = JSON.parse(localStorage.getItem('reviews')) || {};
    const productReviews = allReviews[currentProduct.id] || [];

    if (productReviews.length === 0) {
        document.getElementById('productRating').innerHTML = generateStars(0);
        document.getElementById('reviewsCount').textContent = '(0 reviews)';
        return;
    }

    const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = total / productReviews.length;

    document.getElementById('productRating').innerHTML = generateStarsFromAvg(avg);
    document.getElementById('reviewsCount').textContent = `(${productReviews.length} reviews)`;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Set rating
function setRating(rating) {
    selectedRating = rating;
    document.getElementById('reviewRating').value = rating;

    const stars = document.querySelectorAll('.rating-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// // Submit review form
// document.addEventListener('DOMContentLoaded', function() {
//     const reviewForm = document.getElementById('reviewForm');
//     if (reviewForm) {
//         reviewForm.addEventListener('submit', function(e) {
//             e.preventDefault();

//             const rating = document.getElementById('reviewRating').value;
//             const comment = document.getElementById('reviewComment').value.trim();

//             const currentUser = getCurrentUser();
//             if (!currentUser) {
//                 showToast('Please login first', 'error');
//                 setTimeout(() => window.location.href = '/auth/login.html', 1500);
//                 return;
//             }
            
//             if (!rating || rating === '0') {
//                 showToast('Please select a rating', 'warning');
//                 return;
//             }

//             if (!comment) {
//                 showToast('Please write your review', 'warning');
//                 return;
//             }

//             const newReview = {
//                 reviewId: 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
//                 userId: currentUser.id,
//                 userName: currentUser.name,
//                 userAvatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
//                 date: new Date().toISOString().split('T')[0],
//                 rating: parseInt(rating),
//                 comment: comment
//             };

//             const data = JSON.parse(localStorage.getItem('ecommerce_app')) || {};

//             if (!data.reviews) {
//                 data.reviews = {};
//             }

//             if (!data.reviews[currentProduct.id]) {
//                 data.reviews[currentProduct.id] = [];
//             }

//             data.reviews[currentProduct.id].push(newReview);
//             localStorage.setItem('ecommerce_app', JSON.stringify(data));

//             showToast('Review submitted successfully!', 'success');

//             document.getElementById('reviewComment').value = '';
//             setRating(0);

//             loadReviews();
//             updateProductRatingFromReviews();
//         });
//     }
// });














/** share model */
// Share product function
function shareProduct() {
    // Get product details
    const productName = currentProduct.name;
    const productPrice = currentProduct.discount > 0 
        ? (currentProduct.price * (1 - currentProduct.discount / 100)).toFixed(2) 
        : currentProduct.price.toFixed(2);
    const productUrl = window.location.href;
    const productImage = currentProduct.image;
    
    // Check if Web Share API is supported (for mobile)
    if (navigator.share) {
        navigator.share({
            title: productName,
            text: `Check out this product: ${productName} - $${productPrice}`,
            url: productUrl,
        })
        .catch((error) => {
            console.log('Error sharing:', error);
            // Fallback to custom modal if sharing failed or cancelled
            showShareModal(productName, productPrice, productUrl, productImage);
        });
    } else {
        // Fallback for desktop - show custom share modal
        showShareModal(productName, productPrice, productUrl, productImage);
    }
}

// Show custom share modal
function showShareModal(productName, productPrice, productUrl, productImage) {
    // Create modal HTML if it doesn't exist
    let shareModal = document.getElementById('shareModal');
    
    if (!shareModal) {
        // Create modal element
        shareModal = document.createElement('div');
        shareModal.className = 'modal fade';
        shareModal.id = 'shareModal';
        shareModal.setAttribute('tabindex', '-1');
        shareModal.setAttribute('aria-hidden', 'true');
        
        shareModal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-share-alt text-primary me-2"></i>
                            Share Product
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <img src="" id="shareProductImage" class="img-fluid rounded" style="max-height: 150px; object-fit: contain;">
                            <h6 class="mt-3" id="shareProductName"></h6>
                            <p class="text-primary fw-bold" id="shareProductPrice"></p>
                        </div>
                        
                        <div class="share-buttons">
                            <div class="row g-3">
                                <div class="col-6">
                                    <button class="btn btn-outline-primary w-100" onclick="shareVia('facebook')">
                                        <i class="fab fa-facebook-f me-2"></i>Facebook
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-outline-info w-100" onclick="shareVia('twitter')">
                                        <i class="fab fa-twitter me-2"></i>Twitter
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-outline-success w-100" onclick="shareVia('whatsapp')">
                                        <i class="fab fa-whatsapp me-2"></i>WhatsApp
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-outline-danger w-100" onclick="shareVia('pinterest')">
                                        <i class="fab fa-pinterest me-2"></i>Pinterest
                                    </button>
                                </div>
                            </div>
                            
                            <hr class="my-4">
                            
                            <div class="copy-link-section">
                                <label class="form-label fw-bold">Copy Link</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="shareLink" value="${productUrl}" readonly>
                                    <button class="btn btn-primary" onclick="copyShareLink()">
                                        <i class="fas fa-copy me-2"></i>Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(shareModal);
    }
    
    // Update modal content with current product
    document.getElementById('shareProductImage').src = productImage;
    document.getElementById('shareProductName').textContent = productName;
    document.getElementById('shareProductPrice').textContent = `$${productPrice}`;
    document.getElementById('shareLink').value = productUrl;
    
    // Show modal
    const modal = new bootstrap.Modal(shareModal);
    modal.show();
}

// Share via social media
function shareVia(platform) {
    const productName = currentProduct.name;
    const productUrl = window.location.href;
    const productPrice = currentProduct.discount > 0 
        ? (currentProduct.price * (1 - currentProduct.discount / 100)).toFixed(2) 
        : currentProduct.price.toFixed(2);
    
    let shareUrl = '';
    const text = `Check out ${productName} - $${productPrice}`;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + productUrl)}`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&description=${encodeURIComponent(text)}`;
            break;
    }
    
    // Open share window
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    // Close modal
    const modalElement = document.getElementById('shareModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
    
    showToast('Opening share window...', 'info');
}

// Copy share link to clipboard
function copyShareLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    shareLink.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(shareLink.value).then(() => {
        showToast('Link copied to clipboard!', 'success');
    }).catch(err => {
        showToast('Failed to copy link', 'error');
    });
}


// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProduct();
    cartNotification();
});

// Make functions globally available
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.showTab = showTab;
window.addToCart = addToCart;
window.buyNow = buyNow;
window.setRating = setRating;
window.viewProduct = viewProduct;
window.changeMainImage = changeMainImage;