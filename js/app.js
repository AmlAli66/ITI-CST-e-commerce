

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
        <div class="homeProductCard" onclick="viewProductDetails('${product.id}')">
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
//--- trying the redirecting 
const homeCategoryCards = document.querySelectorAll(".homeCategoryCard");
homeCategoryCards.forEach(card=>{
    card.addEventListener('click',function(){
        const category = this.getAttribute("data-Category");
        window.location.href=`./pages/shop/catalog.html?category=${category}`
    })
})
// ---
//------------ Login Handling
const homeLogin= document.getElementById("homeLogin");
const homeRegister = document.getElementById("homeRegister")
const homeLogout =document.getElementById("homeLogout");
const user = getCurrentUser();
if(user){
    homeLogin.style.display="none";
    homeRegister.style.display="none";
}
if(!user){
    homeLogout.style.display="none"
}
homeLogout.addEventListener('click',logout)
//---------------------------
///---- Logout Handling


//-----------------------

//--------------- Register Handling





//------------------------------



//-------- Mocking The User 
function createMockUser(){
    if(!localStorage.getItem('currentUser')){
    const mockUser ={
    id:"4",
    name:"Freeze",
    email:"freeze@icemart.com",
    password:"123456",
    role:"admin",
    phone:"01234567896",
    address : "789 try later, try again , egy",
    status:"active",
    dateCreated:"2026-02-22"

    }
    localStorage.setItem('currentUser',JSON.stringify(mockUser))

}
else {
        console.log("ℹ️ User already exists, skipping mock creation");
    }

}
function getCurrentUser(){
    const userStr= localStorage.getItem('currentUser');
    return userStr? JSON.parse(userStr) : null;
}
function IsLoggedIn(){
    return getCurrentUser()!=null;
}
function logout(){
    console.log("🚪 LOGOUT FUNCTION STARTED");
    console.log("📦 Before remove:", localStorage.getItem('currentUser'));
    localStorage.removeItem("currentUser");
    //updateNavbar();
    console.log("📦 After remove:", localStorage.getItem('currentUser'));
    console.log("🔄 About to redirect...");
    
    window.location.href = "/index.html";
}
// function updateNavbar() {
//     const user = getCurrentUser();
//     const navUserName = document.getElementById("navUserName");
    
//     if(navUserName) {
//         navUserName.innerText = user ? `Welcome ${user.name}` : "";
//     }
// }





//----------------------//---- Initilaizing the users
// async function initilaizeUsers(){
//     const existingUser = localStorage.getItem('users');
// if (!existingUser) {
//         console.log('Loading User into localStorage...');
        
//         try {
//             // Fetch from JSON
//             const userResponse = await fetch('/data/users.json');
//             const users = await userResponse.json();
            
//             // Store in localStorage
//             localStorage.setItem('users', JSON.stringify(users));
            
//             console.log('users loaded successfully:', users.length);
//         } catch (error) {
//             console.error(' Error loading users:', error);
//         }
//     } else {
//         console.log('✅ Products already in localStorage');
//     }
// }
// initilaizeUsers();
