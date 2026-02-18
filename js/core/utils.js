// UTILS — reusable helpers

export function generateId() {
    return Date.now();
}

export function formatPrice(n) {
    return "$" + Number(n).toFixed(2);
}



// Example usage:
//1.in html :<script type="module" src="../../js/core/utils.js"></script>
//2.in js : import { generateId, formatPrice } from "../core/utils.js";

