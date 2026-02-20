

console.log("App started");

        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❅';
            snowflake.style.left = Math.random() * window.innerWidth + 'px';
            snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            
            // Optional: Vary the opacity for each snowflake (between 30% and 70%)
            snowflake.style.opacity = Math.random() * 0.4 + 0.3;
            
            document.body.appendChild(snowflake);           
            setTimeout(() => {
                snowflake.remove();
            }, 10000);
        }
        // Start snow automatically when page loads
        setInterval(createSnowflake, 800);


// Initializing 
async function initializeProducts(){
    const existingProducts = localStorage.getItem('products');
if (!existingProducts) {
        console.log('Loading products into localStorage...');
        
        try {
            // Fetch from JSON
            const response = await fetch('./data/products.json');
            const products = await response.json();
            
            // Store in localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            console.log('✅ Products loaded successfully:', products.length);
        } catch (error) {
            console.error('❌ Error loading products:', error);
        }
    } else {
        console.log('✅ Products already in localStorage');
    }
}
initializeProducts();


// Getting all the products from the local storage 
function getAllProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}

//  getting the featured products 'for home'
function getFeaturedProducts() {
    const allProducts = getAllProducts();
    return allProducts.filter(product => product.featured === true);
}
// getting the product by category 
function getProductsByCategory(category) {
    const allProducts = getAllProducts();
    return allProducts.filter(product => product.category === category);
}

//  Search for product by id 
function getProductById(id) {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === id);
}
function displayFeaturedProducts(){
    const featuredProducts = getFeaturedProducts();
    console.log("Featured Products Found :"+ featuredProducts.length);
    const container = document.getElementById("homeFeaturedproductsgrid");
    if(!container){
        console.log("Container Not Found");
    }
    container.innerHTML= featuredProducts.map(product=>{
        return `
        <div class="homeProductCard">
        <img src="${product.image}" alt="${product.name}" class="homeProductImages">
            <div class="homeProductDetails">
                <h6>${product.name}</h6>
                    <div class="homeProductPriceCard">
                    <span>price : ${product.price} $</span>
                    </div>

                <button class="homeShowDetails" onclick="viewProductDetails('${product.id}')">
                Show Details
                </button>
            </div>
        </div>
        
        
        `


    }).join('')
}

displayFeaturedProducts();
function viewProductDetails(productID){
    window.location.href=`./pages/shop/product-details.html?id=${productID}`;
}