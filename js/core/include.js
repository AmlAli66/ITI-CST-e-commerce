// HTML PARTIAL LOADER
// Loads navbar & footer into pages

async function loadPartial(selector, path, callback) {
    const el = document.querySelector(selector);
    if (!el) return;

    const res = await fetch(path);
    const html = await res.text();
    el.innerHTML = html;

    // بعد ما يتحمل الـ HTML شغّل أي callback
    if (callback) callback();
}





// Load navbar and then navbar.js
loadPartial("#navbar-container", "/partials/navbar.html", () => {
    // بعد ما الـ navbar يتحمل في DOM
    import("/js/modules/navbar/navbar.js")
        .then(module => console.log("navbar module loaded dynamically"))
        .catch(err => console.error(err));
});

// Load footer normally
loadPartial("#footer-container", "/partials/footer.html");



//how to use: add <div id="navbar-container"></div> and <div id="footer-container"></div> and <script src="../../js/core/include.js"></script> in your HTML, and the partials will be loaded automatically.

//Like:
/*
<body>

<div id="navbar-container"></div>

<div class="container">
  <!-- login form -->
</div>

<div id="footer-container"></div>

<script src="../../js/core/include.js"></script>
</body>
*/
