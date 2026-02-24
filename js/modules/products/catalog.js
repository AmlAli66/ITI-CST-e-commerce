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
                    <div class="catalogProductButtons">
                    <button class="catalogAddToCard" onclick="viewProductDetails('${product.id}')">
                    Add To Cart
                    </button>                
                    <button class="catalogShowDetails " onclick="viewProductDetails('${product.id}')">
                    Show Details
                    </button>
                    </div>
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
    
    
    //--- trying to add "no products found"
    if(catalogProductsToDisplay.length==0){
        const productsContainer= document.getElementById("catalogProducts");
        productsContainer.innerHTML = `
            <div class="no-results text-center">
                <i class="fa-solid text-primary fa-magnifying-glass fa-3x mb-3"></i>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        PaginationContainer.innerHTML = '';  // Clear pagination too
        return;
    }

    //-------------------
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
    //trying to add count of current products 
    const cuurentNumeric= document.getElementById("catalogCurrentNumberic");
    cuurentNumeric.innerText=`${endIndex} / ${getAllProducts().length}`

    // 
        window.scrollTo({top:0,behavior:"smooth"});
    // trying something
    const url = new URL(window.location);
    url.searchParams.set('page',PageNumber);
    window.history.pushState({},'',url);
    //---------
}



//---- Filtering By Price  listerners 
//--Getting the max price dynamically 
const allproducts = getAllProducts();
//console.log("Total products:", allproducts.length);
let highestPrice =0;
for ( let i =0 ; i < allproducts.length;i++){
    //console.log(`Product ${i}: ${allproducts[i].name} = $${allproducts[i].price}`);
    if(allproducts[i].price > highestPrice){
        highestPrice= allproducts[i].price;
        //console.log(`    New highest: ${highestPrice}`);
    }
}

console.log(" FINAL HIGHEST PRICE:", highestPrice);
//--
const minSlider = document.getElementById("priceMin"); 
const maxSlider = document.getElementById("priceMax");
const maxDisplay = document.getElementById("catalogMaxPrice");
const minDisplay = document.getElementById("catalogMinPrice");
//-----------------------------
minSlider.max = highestPrice;
minSlider.value = 0;
minSlider.step = 1;

maxSlider.max = highestPrice;
maxSlider.value = highestPrice;
maxSlider.step = 1;

minDisplay.innerText = 0;
maxDisplay.innerText = highestPrice;
//-----------------------------------
minSlider.addEventListener('input', updateMinSlider);
minSlider.addEventListener('change', ApplyAllFilters);

maxSlider.addEventListener('input', updateMaxSlider);
maxSlider.addEventListener('change', ApplyAllFilters);
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


//----------------------------
//-- Catalog Filters : 
const catalogFilters = document.querySelectorAll(".catalogCheckBoxContainer  input[type='checkbox']");
catalogFilters.forEach(checkbox=> {
    checkbox.addEventListener('change', ApplyAllFilters);

})
//----------------------------------
//-------------- Applying the Trigiered CheckBox 


//---------------------------------------------------

//-------------- Filter By Brand 
const catalogBrandContainer = document.getElementById("catalogFilterBrand");
function catalogBrandCreation(){
    const productsarrHolder = getAllProducts();
    const uniqueBrands = [];
    for(let i =0 ; i < productsarrHolder.length ; i++){
        if(uniqueBrands.includes(productsarrHolder[i].brand)){
            
            continue;
        }else{
            // uniqueBrands[i]=productsarrHolder[i].brand;
            uniqueBrands.push(productsarrHolder[i].brand);
        }
    }
    for(let i =0; i < uniqueBrands.length;i++){
        const wrapper = document.createElement("div");
        wrapper.classList.add("BrandCheckWrapper");
        const createdBrandCheck = document.createElement("input");
        createdBrandCheck.type="checkbox";
        createdBrandCheck.value=uniqueBrands[i];
        createdBrandCheck.setAttribute("class","brandCheckbox");
        createdBrandCheck.addEventListener('change', ApplyAllFilters);
        wrapper.appendChild(createdBrandCheck);
        wrapper.append(uniqueBrands[i]+" ")
        catalogBrandContainer.appendChild(wrapper);
    }
}
catalogBrandCreation();

//------------------------------
// SYMPHONY FILTER 
    function ApplyAllFilters(){
        // 1
        const allProducts = getAllProducts();
         // 2 getting checked Cats
        const checkedCategories = [...document.querySelectorAll(".catalogCheckBoxContainer input:checked")].map(cb => cb.value);
    
        // Getting checked brands 
        const checkedBrands = [...document.querySelectorAll(".BrandCheckWrapper input:checked")].map(cb => cb.value);
        // Getting What is inside the search box 
        const searchTerm = document.getElementById("catalogSearchBar").value.toLowerCase();
        // Filter By Category 
        let AvailableProducts = allProducts;

        // Applying the category filter 
        if(checkedCategories.length>0){
            AvailableProducts= AvailableProducts.filter(products=>checkedCategories.includes(products.category))
        };
        if(checkedBrands.length>0){
            AvailableProducts= AvailableProducts.filter(product=>checkedBrands.includes(product.brand))
        }
        if(searchTerm.length>0){
            AvailableProducts=AvailableProducts.filter(product=> product.name.toLowerCase().includes(searchTerm))
        };
        //--
            updatePriceSliderRange(AvailableProducts);
        //

        // Filtering By Price
        const minPrice= parseInt(document.getElementById("priceMin").value);
        const maxPrice = parseInt(document.getElementById("priceMax").value);
        const FinalFilteredArray =AvailableProducts.filter(product=>product.price>=minPrice && product.price<=maxPrice);
        catalogProductsToDisplay=FinalFilteredArray;

        // Doing The Sort Logic 
        const sortOption = document.getElementById("sortSelect").value;
        catalogProductsToDisplay=applySorting(catalogProductsToDisplay,sortOption);

        //----

        creatingCatalogPagination();
    }




        //-- Updating The SliderItself
function updatePriceSliderRange(products){
    if(products.length == 0){
        minSlider.max = 0;
        minSlider.value = 0;
        maxSlider.max = 0;
        maxSlider.value = 0;
        minDisplay.innerText = 0;
        maxDisplay.innerText = 0;
        return;
    }
    
    let highestPrice = 0;
    for(let i = 0; i < products.length; i++){
        if(products[i].price > highestPrice){
            highestPrice = products[i].price;
        }
    }
    
    const roundedPrice = Math.ceil(highestPrice);
    const currentMax = parseInt(maxSlider.max);  // ← Get current max
    
    minSlider.max = roundedPrice;
    minSlider.step = 1;

    maxSlider.max = roundedPrice;
    maxSlider.step = 1;
    //try
    
    maxDisplay.innerText = roundedPrice;  //  Always update display
    //--
    // If range increased OR value is outside range, reset
    if(roundedPrice > currentMax || parseInt(maxSlider.value) > roundedPrice) {
        maxSlider.value = roundedPrice;
        maxDisplay.innerText = roundedPrice;
    }
    
    if(parseInt(minSlider.value) > roundedPrice) {
        minSlider.value = 0;
        minDisplay.innerText = 0;
    }
}

//------SEARCH ALGORITHMS 
const searchBar= document.getElementById("catalogSearchBar");
searchBar.addEventListener('input',ApplyAllFilters);

function catalogSearch(){

}


//----------------------- Sorting Function
const sortSelection = document.getElementById("sortSelect");
sortSelection.addEventListener('change',ApplyAllFilters);
function applySorting(products, sortType){
    const sortedProducts =[...products]
    if(sortType=='price-low'){
        return sortedProducts.sort((a,b)=>a.price-b.price);
    }else if (sortType=='price-high'){
        return sortedProducts.sort((a,b)=> b.price-a.price);
    }
    return sortedProducts;
}

////------------ trying the linking of home  category
const urlparams=  new URLSearchParams(window.location.search);
const categoryParam = urlparams.get("category");
if(categoryParam){
    const checkbox=document.querySelector(`.catalogCheckBoxContainer input[value="${categoryParam}"]`)
    if(checkbox){
        checkbox.checked=true;
        ApplyAllFilters();
    }
}

//-------------------------------

//--------- Clear All Filters 
const ClearFiltersBtn = document.getElementById("catalogClearAllFilters")
 ClearFiltersBtn.addEventListener('click',ClearAllFilters)
 function ClearAllFilters(){
     const allCheckedFilters = document.querySelectorAll("input[type='checkbox']:checked")
     allCheckedFilters.forEach(cb=>cb.checked=false);
    ApplyAllFilters();
}

//----------------------------------