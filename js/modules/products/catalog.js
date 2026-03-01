console.log("catalog module loaded");

// Ensuring if user gone to products before home
async function ensureProducts() {
    if (!localStorage.getItem('products')) {
        const res = await fetch('../../data/products.json');
        const products = await res.json();
        localStorage.setItem('products', JSON.stringify(products));
    }
}

ensureProducts().then(() => {
    catalogProductsToDisplay = getAllProducts();
    creatingCatalogPagination();
    catalogBrandCreation();
    ApplyAllFilters();
});
//----
// Making variable for current display This hold whatever should be displayed at the moment weather it is with filters or search or what
let catalogProductsToDisplay = getAllProducts();


//-------Data Function to get the products from the local storage 
function getAllProducts(){
    const AllProducts = localStorage.getItem("products");
    const products =  AllProducts? JSON.parse(AllProducts) : [];
    return  products.filter(product => product.status === "approved");
}

// Display Functions 
// viewing the Current Products  - > productsArray - > products to display (sliced with the pagination)
function viewAllProducts(productsArray){
    //const Products = getAllProducts(); no more need for it 
    const productsContainer = document.getElementById("catalogProducts");
    const currentUser =JSON.parse(localStorage.getItem('currentUser')||'null');
    const isAdmin = currentUser?.role=="admin";
    productsContainer.innerHTML= productsArray.map(product=>{
        //hiding the product add to cart to its seller 
        const isOwnProduct = currentUser?.role === "seller" && currentUser?.id === product.sellerId;

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
                    <button class="catalogAddToCard" onclick=" event.stopPropagation(); navAddToCart('${product.id}')"  ${(isAdmin||isOwnProduct )? 'style="display:none"' : ''}>
                    Add To Cart
                    </button>                
                    <button class="catalogShowDetails " onclick="  event.stopPropagation();  viewProductDetails('${product.id}')">
                    Show Details
                    </button>
                    </div>
                    </div>
            </div>
        </div>
        `
    }).join('');
} // end of viewAllProducts 
// Redirecting to the product details
function viewProductDetails(productID){
    //window.location.href=`/pages/shop/product-details.html?id=${productID}`;
    // trying 
    window.location.href = `product-details.html?id=${productID}`;
}
//

// Creating the Pagination  Dynamically 
function creatingCatalogPagination(){
    const productsPerPage =16;
    // const allProducts = getAllProducts(); no need this will ignore the filter
    // here changed the used array : to change the pagination on filtering :
    const numberOfPages=Math.ceil( catalogProductsToDisplay.length / productsPerPage);
    const PaginationContainer = document.getElementById("catalogPagination");
    
    
    //--- trying to add "no products found" Handles no products data 
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

    //-------------------Building the Pagination Button
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
    // trying again checking the url to perserve the page on refresh 
    const urlToLoad =  new URLSearchParams(window.location.search);
    let pageToLoad = urlToLoad.get('page')? parseInt(urlToLoad.get('page')) : 1;

    //---
    if (pageToLoad > numberOfPages) pageToLoad = 1;
    goToPage(pageToLoad);
}
creatingCatalogPagination();



// Applying the Pagination Logic pageNumber - > the page to show indexed by 1 
function goToPage(PageNumber){

    const allButtons = document.querySelectorAll(".catalogPaginationButtons");
    // handle edge case -> no products 
    if(allButtons.length==0){
        viewAllProducts([]);
        return;
    }
    // update active button styling 
    allButtons.forEach(btn=> btn.classList.remove('active'));
    allButtons[PageNumber - 1].classList.add('active');
    const productsPerPage = 16;

    // const allProducts=getAllProducts(); no need anymore 
    // Slicing products for this page 
    const startIndex = (PageNumber -1) * productsPerPage;
    const endIndex = startIndex+productsPerPage;
    const productstToShow = catalogProductsToDisplay.slice(startIndex,endIndex);
    viewAllProducts(productstToShow);
    //trying to add count of current products "updating the showen x/y"
    const cuurentNumeric= document.getElementById("catalogCurrentNumberic");
    const actualEnd = Math.min(endIndex, catalogProductsToDisplay.length);
    cuurentNumeric.innerText = `${actualEnd} / ${catalogProductsToDisplay.length}`;

    // scrolls somthly to top when changing the page 
        window.scrollTo({top:0,behavior:"smooth"});
        
    // trying something "Updating url without reload "
    const url = new URL(window.location);
    url.searchParams.set('page',PageNumber);
    window.history.replaceState({},'',url);
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

//console.log(" FINAL HIGHEST PRICE:", highestPrice);

//--Getting the Silders Elements 
const minSlider = document.getElementById("priceMin"); 
const maxSlider = document.getElementById("priceMax");
const maxDisplay = document.getElementById("catalogMaxPrice");
const minDisplay = document.getElementById("catalogMinPrice");
//----------------------------- Initializing the Silders with correct ranges 
minSlider.max = highestPrice;
minSlider.value = 0;
minSlider.step = 1;

maxSlider.max = highestPrice;
maxSlider.value = highestPrice;
maxSlider.step = 1;

minDisplay.innerText = 0;
maxDisplay.innerText = highestPrice;

//--------------- Sliders Event Listerners  input for updating on time change for filter so its after release
minSlider.addEventListener('input', updateMinSlider);
minSlider.addEventListener('change', ApplyAllFilters);

maxSlider.addEventListener('input', updateMaxSlider);
maxSlider.addEventListener('change', ApplyAllFilters);
//--------------------------------------------------------------------------------
//----- Filter Range Visual /  Update Update the min slider Dislpay
function updateMinSlider(e){
    const MinHolder = document.getElementById("catalogMinPrice");
    MinHolder.innerText= this.value;
}
// Update the Max Slider Display 
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

//-------------- Filter By Brand // Creating the brand checkboxes dynamically 
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
 // catalogBrandCreation();

//------------------------------
// SYMPHONY FILTER  The MAIN FUNCTION 
/* the flow is : 
* Flow:
1 Start with ALL products
2 Apply category filter (if any checked)
3 Apply brand filter (if any checked)
4 Apply search filter (if any text)
5 Update price slider range for remaining products
6 Apply price filter
7 Apply sorting
8 Update global state & rebuild pagination    
*/

    function ApplyAllFilters(){
        // getting all products 
        const allProducts = getAllProducts();
         // 2 getting checked Cats
        const checkedCategories = [...document.querySelectorAll(".catalogCheckBoxContainer input:checked")].map(cb => cb.value);
    
        // Getting checked brands 
        const checkedBrands = [...document.querySelectorAll(".BrandCheckWrapper input:checked")].map(cb => cb.value);
        // Getting What is inside the search box 
        const searchTerm = document.getElementById("catalogSearchBar").value.toLowerCase();
        // Filter By Category 
        let AvailableProducts = allProducts;

        // Start Filtering 
        // Applying the category filter 
        if(checkedCategories.length>0){
            AvailableProducts= AvailableProducts.filter(products=>checkedCategories.includes(products.category))
        };
        // Apply Brand Filter 
        if(checkedBrands.length>0){
            AvailableProducts= AvailableProducts.filter(product=>checkedBrands.includes(product.brand))
        }
        // Apply the search bar -> search by name and brand 
        if(searchTerm.length>0){
            AvailableProducts=AvailableProducts.filter(product=> product.name.toLowerCase().includes(searchTerm)||product.brand.toLowerCase().includes(searchTerm))
        };
        //- Update the Silders To Match the Filters 
            updatePriceSliderRange(AvailableProducts);
        //

        // Apply Filter By Price
        const minPrice= parseInt(document.getElementById("priceMin").value);
        const maxPrice = parseInt(document.getElementById("priceMax").value);
        const FinalFilteredArray =AvailableProducts.filter(product=>product.price>=minPrice && product.price<=maxPrice);

        // Update global state 
        catalogProductsToDisplay=FinalFilteredArray;

        // Applying the sort
        const sortOption = document.getElementById("sortSelect").value;
        catalogProductsToDisplay=applySorting(catalogProductsToDisplay,sortOption);

        //----
        // Rebuilding the Pagination with the result of sorting 
        creatingCatalogPagination();
    }




 //-- Updating The SliderItself/ Adjusting the slider range based on filtered products  products-> Currently Filtered Products
function updatePriceSliderRange(products){
    // if no products -> reset  everything to 0 
    if(products.length == 0){
        minSlider.max = 0;
        minSlider.value = 0;
        maxSlider.max = 0;
        maxSlider.value = 0;
        minDisplay.innerText = 0;
        maxDisplay.innerText = 0;
        return;
    }
    // Find Highest Price in the filtered Products
    let highestPrice = 0;
    for(let i = 0; i < products.length; i++){
        if(products[i].price > highestPrice){
            highestPrice = products[i].price;
        }
    }
    
    const roundedPrice = Math.ceil(highestPrice);
    const currentMax = parseInt(maxSlider.max);  // ← Get current max
    
    // Update Slider ranges 
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
    //
    minDisplay.innerText = minSlider.value;
    maxDisplay.innerText = maxSlider.value;
    //
}

//------SEARCH ALGORITHMS 
const searchBar= document.getElementById("catalogSearchBar");
searchBar.addEventListener('input',ApplyAllFilters);


//----------------------- Sorting Function
const sortSelection = document.getElementById("sortSelect");
sortSelection.addEventListener('change',ApplyAllFilters);
// Applying the Sort  products- > array of products to sort - Sorttype - > sort type - return-> sorted copy of the products 
function applySorting(products, sortType){
    const sortedProducts =[...products] // creating copy to avoid mutating the original array 
    if(sortType=='price-low'){
        return sortedProducts.sort((a,b)=>a.price-b.price);
    }else if (sortType=='price-high'){
        return sortedProducts.sort((a,b)=> b.price-a.price);
    }
    return sortedProducts;// Default or no sort
}

////------------ trying the linking of home  category Handles the navigation from home by Category 
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
document.getElementById("catalogClearAllFiltersMobile")?.addEventListener('click', ClearAllFilters);
// dynamic update with the change of storage
window.addEventListener('storage', function(e) {
    if (e.key === 'products') {
        catalogProductsToDisplay = getAllProducts();
        ApplyAllFilters();
    }
});
