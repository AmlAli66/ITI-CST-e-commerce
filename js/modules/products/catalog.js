console.log("catalog module loaded");

function getAllProducts(){
    const AllProducts = localStorage.getItem("products");
    return AllProducts? JSON.parse(AllProducts) : [];
}
function viewAllProducts(){
    const Products = getAllProducts();
    const productsContainer = document.getElementById("catalogProducts");
    productsContainer.innerHTML= Products.map(product=>{
        return `
        <div class="catalogProductCard">
        <img src="${product.image}" alt="${product.name}"class="catalogproductImage">
            <div class="catalogProductDetails">
                <h6>${product.name}</h6>
                    <div>
                    Price : ${product.price}$
                    </div>
                    <button class="homeShowDetails" onclick="viewProductDetails('${product.id}')">
                    Show Details
                    </button>
            </div>
        </div>
        `

    }).join('');
}
//viewAllProducts();
function viewProductDetails(productID){
    window.location.href=`./pages/shop/product-details.html?id=${productID}`;
}
function creatingCatalogPagination(){
    const numberOfPages= 
}