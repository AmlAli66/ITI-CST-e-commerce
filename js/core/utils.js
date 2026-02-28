// UTILS — reusable helpers

export function generateId() {
    return Date.now();
}

export function formatPrice(n) {
    return "$" + Number(n).toFixed(2);
}


export function showToast(message) {

    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}



// Example usage:
//1.in html :<script type="module" src="../../js/core/utils.js"></script>
//2.in js : import { generateId, formatPrice } from "../core/utils.js";

