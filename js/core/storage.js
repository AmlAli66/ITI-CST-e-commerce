// STORAGE CORE
// Shared localStorage helpers
// ⚠️ Shared file — team review required before edit

export function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function load(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}



// Example usage:
//1.in html :<script type="module" src="../../js/core/storage.js"></script>
//2.in js : import { save, load } from "../core/storage.js";

