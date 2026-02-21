console.log("catalog module loaded");
// Making variable for current display
let catalogProductsToDisplay = getAllProducts();


//-------
function getAllProducts(){
    const AllProducts = localStorage.getItem("products");
    return AllProducts? JSON.parse(AllProducts) : [];
}


// viewing the Current Products 
function viewAllProducts(productsArray){
    //const Products = getAllProducts(); no more need for it 
    const productsContainer = document.getElementById("catalogProducts");
    productsContainer.innerHTML= productsArray.map(product=>{
        return `
        <div class="catalogProductCard col-lg-4 col-md-6 col-sm-12 mb-4" onclick="viewProductDetails('${product.id}')">
        <img src="${product.image}" alt="${product.name}"class="catalogproductImage">
            <div class="catalogProductDetails">
                <h6>${product.name}</h6>
                    <div>
                    Price : ${product.price}$
                    </div>
                    <div>
                    <button class="homeShowDetails" onclick="viewProductDetails('${product.id}')">
                    Show Details
                    </button>
                    </div>
            </div>
        </div>
        `
    }).join('');
}
//--------
//viewAllProducts(); no need

// Redirecting to the product details
function viewProductDetails(productID){
    window.location.href=`./pages/shop/product-details.html?id=${productID}`;
}
//

// Creating the Pagination  Dynamically 
function creatingCatalogPagination(){
    const productsPerPage =16;
    // const allProducts = getAllProducts(); no need this will ignore the filter
    // here changed the used array : to change the pagination on filtering :
    const numberOfPages=Math.ceil( catalogProductsToDisplay.length / productsPerPage);
    const PaginationContainer = document.getElementById("catalogPagination");
    PaginationContainer.innerHTML='';
    for(let i = 1 ; i <= numberOfPages ;i++){
        const button = document.createElement("button");
        button.textContent=i;
        button.classList.add("catalogPaginationButtons");
        if(i==1){button.classList.add("active");}
        button.addEventListener('click',function(){
            goToPage(i);
        });
        PaginationContainer.appendChild(button);
    }
    // trying again
    const urlToLoad =  new URLSearchParams(window.location.search);
    const pageToLoad = urlToLoad.get('page')? parseInt(urlToLoad.get('page')) : 1;

    //---
    goToPage(pageToLoad);
}
creatingCatalogPagination();



// Applying the Pagination Logic
function goToPage(PageNumber){

    const allButtons = document.querySelectorAll(".catalogPaginationButtons");
    if(allButtons.length==0){
        viewAllProducts([]);
        return;
    }
    allButtons.forEach(btn=> btn.classList.remove('active'));
    allButtons[PageNumber - 1].classList.add('active');
    const productsPerPage = 16;

    // const allProducts=getAllProducts(); no need anymore 
    const startIndex = (PageNumber -1) * productsPerPage;
    const endIndex = startIndex+productsPerPage;
    const productstToShow = catalogProductsToDisplay.slice(startIndex,endIndex);
    viewAllProducts(productstToShow);

    // trying something
    const url = new URL(window.location);
    url.searchParams.set('page',PageNumber);
    window.history.pushState({},'',url);
    //---------
}



//---- Filtering By Price  listerners 
//--Getting the max price dynamically 
const allproducts = getAllProducts();
console.log("Total products:", allproducts.length);
let highestPrice =0;
for ( let i =0 ; i < allproducts.length;i++){
    console.log(`Product ${i}: ${allproducts[i].name} = $${allproducts[i].price}`);
    if(allproducts[i].price > highestPrice){
        highestPrice= allproducts[i].price;
        console.log(`    New highest: ${highestPrice}`);
    }
}

console.log(" FINAL HIGHEST PRICE:", highestPrice);
//--
const minSlider = document.getElementById("priceMin"); 
minSlider.addEventListener('input', updateMinSlider);
minSlider.addEventListener('change', applyPriceFilter);

const maxSlider = document.getElementById("priceMax");
maxSlider.addEventListener('input', updateMaxSlider);
maxSlider.addEventListener('change', applyPriceFilter);
//-----------------------------
minSlider.step=100;
minSlider.max=highestPrice;
//-----------------------
maxSlider.max=highestPrice;
maxSlider.value=highestPrice;
maxSlider.step = 100;
console.log(" Slider max:", maxSlider.max);
console.log(" Slider value:", maxSlider.value);
//-----------------------------------
const maxDisplay = document.getElementById("catalogMaxPrice");
maxDisplay.innerText = highestPrice;
console.log(" Display element found?", maxDisplay);
console.log(" Display innerText:", maxDisplay.innerText);

//-----------------------

//----- Filter Range Visual Update 
function updateMinSlider(e){
    const MinHolder = document.getElementById("catalogMinPrice");
    MinHolder.innerText= this.value;
}
function updateMaxSlider(e){
    const MaxHolder = document.getElementById("catalogMaxPrice");
    MaxHolder.innerText= this.value;
}
//---------------------

// Applying The Filter On The Screen 
function applyPriceFilter(){
    const min = parseInt(document.getElementById("priceMin").value);
    const max = parseInt(document.getElementById("priceMax").value);

    const AllProduct = getAllProducts();
    catalogProductsToDisplay = AllProduct.filter(product=> product.price>=min && product.price<=max);
    creatingCatalogPagination();
}

//-------console check---------------------

