const PRODUCTS_KEY = "products";

export async function initProducts() {
    const existing = localStorage.getItem(PRODUCTS_KEY);
    if (existing) return;

    const res = await fetch("/data/products.json");
    const data = await res.json();

    // Fix finalPrice if null
    data.forEach(p => {
        if (!p.finalPrice || p.finalPrice === null) {
            p.finalPrice = calculateFinalPrice(p.price, p.discount);
        }
    });

    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
}

export function getAllProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
}

export function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function calculateFinalPrice(price, discount) {
    if (!discount) return price;
    return +(price - (price * discount / 100)).toFixed(2);
}
