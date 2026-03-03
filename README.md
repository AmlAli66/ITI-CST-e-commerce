# 🧊 IceMart — Multi-Actor E-Commerce Platform

> A full-featured, multi-actor e-commerce web application built with vanilla HTML, CSS, JavaScript, and Bootstrap. Developed as a team project for the ITI CST program.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement & Objectives](#-problem-statement--objectives)
3. [System Overview](#-system-overview)
4. [Screenshots](#-screenshots)
5. [Key Features](#-key-features)
6. [Tech Stack](#-tech-stack)
7. [Project Structure](#-project-structure)
8. [Architecture & Design Patterns](#-architecture--design-patterns)
9. [User Roles & Permissions](#-user-roles--permissions)
10. [Module Breakdown](#-module-breakdown)
11. [Data Model](#-data-model)
12. [Getting Started](#-getting-started)
13. [Default Accounts](#-default-accounts)
14. [Team](#-team)

---

## 🔭 Project Overview

**IceMart** is a multi-actor e-commerce platform that supports three user roles — **Customer**, **Seller**, and **Admin** — each with a dedicated interface and set of capabilities. The platform uses **localStorage** as its data persistence layer, making it a fully client-side application with no backend dependency.

The application features a custom icy/neon-themed UI with animated snowfall effects, a modular JavaScript architecture using ES6 modules, and reusable HTML partials loaded dynamically at runtime. Seed data is loaded from JSON files on first visit.

---

## 🎯 Problem Statement & Objectives

### Problem Statement

Traditional e-commerce platforms require complex backend systems to manage products, users, and orders. This project aims to simulate a simplified version of such a system using only front-end technologies, while maintaining role-based access control and structured data handling.

### Project Objectives

The objective of this project is to build a responsive e-commerce system that:

- Supports multiple user roles (Customer, Seller, Admin) with distinct interfaces and permissions
- Implements authentication simulation with secure login, registration, and role-based redirection
- Allows product browsing, searching, filtering, and purchasing with a full checkout flow
- Provides dedicated dashboards for sellers (product management) and admins (platform oversight)
- Stores all data locally without backend integration using localStorage and JSON seed files
- Builds a responsive, themed UI that works across desktop and mobile devices

---

## 🖥️ System Overview

The system is fully client-side and runs entirely in the browser. There is no backend server or real database. All data operations happen through JavaScript interacting with the browser's localStorage API.

- **JSON files** serve as the mock database, providing seed data for products and users on first visit
- **localStorage** persists all runtime data including users, products, orders, cart, wishlist, reviews, messages, and admin logs
- **JavaScript (ES6 Modules)** handles authentication simulation, dynamic content rendering, state management, and all user interactions
- **HTML Partials** are loaded dynamically to maintain consistent navigation and footer across all pages

---

## 📸 Screenshots 
![Homepage](/assets/images/documentation/Home.jpg)
![Loginpage](/assets/images/documentation/Login.jpg)
![Profile](/assets/images/documentation/Profile.jpg)
![Cart page](/assets/images/documentation/Cart.jpg)
![catalog ](/assets/images/documentation/Catalog.jpg)
![Help center](/assets/images/documentation/HelpCenter.jpg)
![Customer Service](/assets/images/documentation/CustmoerService.jpg)
![Wishlist](/assets/images/documentation/WishList.jpg)
![Admin Panel](/assets/images/documentation/AdminPanel.jpg)
![Seller dashboard](/assets/images/documentation/SellerDashboard.jpg)
![Checkout](/assets/images/documentation/Checkout.jpg)
![Profile with recent Orders ](/assets/images/documentation/RecentOrders.jpg)
![Order Details Page](/assets/images/documentation/OrderDetails.jpg)


## ✨ Key Features

- 🔐 **Role-Based Authentication** — Secure login and registration with role selection (Customer, Seller, Admin), input validation with regex, password strength enforcement, international phone input, and automatic role-based redirection.
- 🛡️ **Auth Guards & Route Protection** — Pages check for authenticated users and correct roles on load. Unauthorized users are automatically redirected, preventing direct URL access to restricted areas.
- 🧭 **Dynamic Navbar** — Navigation adapts based on user role — showing/hiding admin panel and seller dashboard links, hiding the cart icon for admins, displaying welcome messages, and toggling login/logout buttons.
- 👤 **User Profile Management** — View and edit personal information (name, phone, address) with validation. View order history with status tracking and navigate to detailed order breakdowns.
- 🛍️ **Product Catalog with Multi-Filter System** — Filter by category, brand, price range (dual sliders with dynamic range adjustment), and keyword search. All filters compose together and update in real time.
- 📄 **Pagination with URL State Management** — Client-side pagination synced with URL query parameters, so page state survives refresh and supports shareable links.
- 💰 **Discount System** — Percentage-based discounts with crossed-out original prices and highlighted sale prices throughout catalog, details, cart, and wishlist.
- 🛒 **Per-User Cart with Stock Validation** — Each user has an isolated cart. Stock limits are enforced on add, quantity increase, and checkout.
- 🔴 **Real-Time Cart & Wishlist Badges** — Navbar icons display live count badges that update immediately on any change.
- ❤️ **Wishlist Functionality** — Per-user wishlist with add/remove, move to cart, clear all with confirmation, and login-required modal for guests.
- ⭐ **Product Reviews & Ratings** — Submit star ratings and text reviews. Review summary with star distribution bars generated dynamically. Product ratings recalculate based on submissions.
- 🖼️ **Product Image Gallery** — Main image with clickable thumbnail gallery for multiple product angles.
- 📦 **Checkout & Order Placement** — Full checkout with shipping info, payment selection (COD, Visa, MasterCard), card validation, tax/shipping calculation, and order confirmation.
- 📬 **Contact Form with Admin Message Viewer** — Validated contact form saves messages to localStorage. Admin panel has a dedicated messages section with search, pagination, and detail modal.
- 🏷️ **Category Navigation from Homepage** — Clicking category cards navigates to catalog with that category pre-filtered via URL parameters.
- 👨‍💼 **Admin Dashboard & Analytics** — KPI cards, revenue chart (7D/30D toggle), order status chart, user growth chart, top revenue products, and activity timeline.
- 👥 **Admin User Management** — Search, filter, toggle status, reset passwords, view details, and delete users with protection for main admin.
- 📋 **Admin Product Moderation** — Approve, reject, feature products. Bulk actions with select-all and batch updates.
- 📦 **Admin Order Management** — View, filter, search, cancel orders with confirmation, and navigate to order details.
- 🏪 **Seller Dashboard** — Product management (add, edit, delete with Base64 image upload), stats, revenue charts, order tables, and top product widget.
- 🔔 **Toast Notifications** — Non-blocking toast messages with type variants (success, warning, error) across all modules.
- 📱 **Responsive Design** — Mobile-friendly with collapsible sidebar, responsive grids, and Bootstrap breakpoints.
- 💾 **localStorage-Based Data Persistence** — All data persists in the browser. Seed data loads from JSON on first visit.
- 🎨 **Icy/Neon Themed UI with Animations** — Custom theme with neon accents, animated snowfall, AOS scroll animations, and smooth transitions.
- 🧩 **Reusable HTML Partials** — Navbar, footer, and back button loaded dynamically via custom include.js loader.

---

## 🛠️ Tech Stack


| Layer           | Technologies                                                                                       |
|-----------------|----------------------------------------------------------------------------------------------------|
| **Markup**      | HTML5, Semantic Elements                                                                           |
| **Styling**     | CSS3, Bootstrap 5.3, Font Awesome 7, Bootstrap Icons, Google Fonts (Poppins), Custom CSS Variables |
| **Scripting**   | Vanilla JavaScript (ES6 Modules), DOM API                                                          |
| **Charts**      | Chart.js                                                                                           |
| **Animations**  | AOS (Animate on Scroll), CSS Keyframes                                                             |
| **Phone Input** | intl-tel-input                                                                                     |
| **Data**        | localStorage, JSON seed files                                                                      |


---

## 📁 Project Structure

```
IceMart/
│
├── index.html                          # Landing page (hero, categories, featured products)
│
├── pages/
│   ├── auth/
│   │   ├── login.html                  # Login form with role-based redirect
│   │   └── register.html               # Registration with role selection & validation
│   ├── shop/
│   │   ├── catalog.html                # Product catalog with filters & pagination
│   │   └── product-details.html        # Product detail with gallery, reviews, tabs
│   ├── cart/
│   │   └── cart.html                   # Shopping cart with quantity controls
│   ├── order/
│   │   └── checkout.html               # Checkout with payment & order summary
│   ├── support/
│   │   └── contact.html                # Contact form with live validation
│   ├── seller/
│   │   └── seller-dashboard.html       # Seller product & order management
│   ├── wishlist/
│   │   └── wishlist.html               # User wishlist page
│   ├── profile/
│   │   ├── profile.html                # User profile with order history
│   │   └── order-details.html          # Individual order breakdown
│   └── admin/
│       └── admin-panel.html            # Admin dashboard (single-page, multi-section)
│
├── assets/
│   ├── images/                         # Product images, banners, placeholders
│   ├── icons/                          # Custom icons
│   └── fonts/                          # Custom fonts
│
├── data/
│   ├── products.json                   # Seed product data (25 products, 5 categories)
│   ├── users.json                      # Seed user data (admin, customer, seller)
│   └── categories.json                 # Category definitions
│
├── css/
│   ├── base/
│   │   ├── reset.css                   # CSS reset / normalize
│   │   ├── variables.css               # Global CSS custom properties
│   │   └── typography.css              # Font and text styles
│   ├── components/
│   │   ├── navbar.css                  # Navigation bar styles
│   │   ├── cards.css                   # Product & UI card styles
│   │   ├── forms.css                   # Form element styles
│   │   ├── buttons.css                 # Button variants
│   │   └── loader.css                  # Loading spinner/animation
│   ├── pages/
│   │   ├── home.css, auth.css, catalog.css, details.css
│   │   ├── cart.css, checkout.css, support.css
│   │   ├── seller.css, admin.css
│   │   ├── profile.css, wishlist.css, order-details.css
│   └── main.css                        # Global styles & imports
│
├── js/
│   ├── core/
│   │   ├── include.js                  # Dynamic HTML partial loader
│   │   ├── utils.js                    # Shared utility functions
│   │   ├── auth-guard.js               # Route protection
│   │   ├── users-service.js            # User data operations & admin logging
│   │   ├── products-service.js         # Product data initialization
│   │   ├── orders-service.js           # Order data operations
│   │   └── storage.js                  # localStorage helpers
│   ├── modules/
│   │   ├── auth/          → login.js, register.js
│   │   ├── products/      → catalog.js, product-details.js
│   │   ├── cart/           → cart.js
│   │   ├── checkout/       → checkout.js
│   │   ├── support/        → contact.js
│   │   ├── seller/         → seller-dashboard.js
│   │   ├── wishlist/       → wishlist.js
│   │   ├── navbar/         → navbar.js
│   │   ├── profile/        → profile.js, order-details.js
│   │   └── admin/          → admin-panel.js, admin-dashboard.js,
│   │                         admin-users.js, admin-products.js,
│   │                         admin-orders.js, admin-activity.js,
│   │                         admin-messages.js
│   └── app.js                          # Homepage logic, snowfall, featured products
│
├── partials/
│   ├── navbar.html                     # Shared navigation bar
│   ├── footer.html                     # Shared footer
│   └── back-btn.html                   # Reusable back button
│
└── README.md
```

---

## 🏗️ Architecture & Design Patterns

### Modular JavaScript (ES6 Modules)
The application uses native JavaScript ES6 modules (`import`/`export`) to separate concerns. Each page or feature has its own module file, and shared logic lives in the `core/` directory.

### Dynamic Partial Loading
A custom `include.js` loader fetches HTML partials (navbar, footer) at runtime and injects them into the DOM, then dynamically imports associated JavaScript modules. This keeps the navbar and footer consistent across all pages without duplication.

### Single-Page Admin Panel
The admin panel uses a single HTML page (`admin-panel.html`) with multiple `<section>` elements that are shown/hidden dynamically. A sidebar menu triggers `switchSection()` which renders the appropriate module — Dashboard, Users, Products, Orders, or Messages.

### State Management via localStorage
All application state (users, products, orders, cart, wishlist, reviews, contact messages, admin logs) is stored in `localStorage`. Seed data from JSON files is loaded on first visit if no existing data is found.

### URL-Driven State
The catalog page syncs filter state (category, page number) with URL query parameters using `window.history.replaceState()`. This enables bookmarkable, shareable, and refresh-safe filter states.

---

## 👥 User Roles & Permissions

| Capability                           | Customer | Seller                 | Admin              |
|--------------------------------------|----------|------------------------|--------------------|
| Browse & search products             | ✅       | ✅                    | ✅                 |
| View product details & reviews       | ✅       | ✅                    | ✅                 |
| Add to cart & checkout               | ✅       | ✅ (not own products) | ❌                 |
| Manage wishlist                      | ✅       | ✅                    | ❌                 |
| Submit reviews                       | ✅       | ❌                    | ❌                 |
| Edit profile                         | ✅       | ✅                    | ✅                 |
| View order history                   | ✅       | ✅                    | ✅                 |
| Add / edit products                  | ❌       | ✅ (own only)         | ❌                 |
| View seller dashboard & stats        | ❌       | ✅                    | ❌                 |
| Approve / reject products            | ❌       | ❌                    | ✅                 |
| Manage users (status, delete, reset) | ❌       | ❌                    | ✅                 |
| Manage orders (view, cancel)         | ❌       | ❌                    | ✅                 |
| View contact messages                | ❌       | ❌                    | ✅                 |
| View analytics dashboard             | ❌       | ✅ (own data)         | ✅ (platform-wide) |


---

## 📦 Module Breakdown

### 🏠 Homepage (`index.html` + `app.js`)
- Hero section with dynamic auth buttons (sign-in/sign-up/sign-out based on login state)
- Animated 50% OFF sales banner with electric spark effects
- Feature cards (Secure Payment, Fast Delivery, 24/7 Support, Easy Returns)
- Category navigation cards with AOS animations — clicking navigates to catalog with category pre-filtered
- Featured products grid (loads products where `featured: true` and `status: approved`)
- Snowfall animation effect

### 🔐 Authentication (`login.js` + `register.js`)
- **Login**: Email + password validation against localStorage, role-based redirect, auto-redirect if already logged in
- **Registration**: Name regex, email format, password strength (uppercase + digit + special char), phone with intl-tel-input country codes, address, role selection, duplicate email check, auto-redirect to login

### 🛍️ Catalog (`catalog.js`)
- Loads only approved products (`status: "approved"`)
- Multi-filter system: category checkboxes, dynamically generated brand checkboxes, dual price range sliders (with dynamic range adjustment), keyword search (name + brand)
- All filters compose together via `ApplyAllFilters()` symphony function
- Sorting: price low-to-high, price high-to-low
- Pagination with URL state sync (`?page=N&category=X`)
- Product count display (X/Y), clear all filters, mobile filter panel, empty state
- Cross-tab storage sync via `storage` event listener

### 🔍 Product Details (`product-details.js`)
- Main image with clickable thumbnail gallery
- Price with discount display, stock indicator, quantity selector with stock limits
- Add to Cart, Buy Now, and Wishlist toggle buttons
- Tabbed interface (Description, Reviews)
- Review system: star ratings, text reviews, summary with distribution bars, dynamic rating recalculation
- Related products section, breadcrumb navigation
- Role-based view adjustments (seller sees edit, admin sees no cart, guests see login modal)

### 🛒 Cart (`cart.js`)
- Per-user isolated cart filtered by `userId`
- Quantity controls with stock validation
- Remove item, clear cart with confirmation modal
- Cart summary: subtotal, tax, shipping, total
- Navbar cart badge with real-time count
- Login-required modal for guests, empty state

### 💳 Checkout (`checkout.js`)
- Shipping form: full name, phone (Egyptian format), address
- Payment methods: Cash on Delivery, Visa, MasterCard with conditional card input
- Input restrictions (letters only, digits only, format enforcement)
- Order creation with unique ID, localStorage save, cart clear

### ❤️ Wishlist (`wishlist.js`)
- Per-user wishlist stored as `wishlist[userId]`
- Add to cart from wishlist with stock validation
- Remove single item or clear all with confirmation modals
- Wishlist badge on navbar, login-required modal for guests

### 👤 Profile (`profile.js` + `order-details.js`)
- Profile header with avatar (initials), name, email, role, status, date created
- Edit profile modal: update name, phone, address — syncs both `currentUser` and `users` array
- Order history list with status badges and View Details button
- Order details page: full breakdown with clickable items, totals, payment method
- Admin sees "Back to Admin Panel" instead of "Back to Profile"

### 📬 Contact (`contact.js`)
- Live input validation (name: letters only, email format, subject required, message required)
- Saves to localStorage with unique ID (`MSG-{timestamp}`)
- Success alert and form reset

### 👨‍💼 Admin Panel (Single-Page Architecture)

**Dashboard** — KPI cards (revenue, orders, users, cancellation rate with 7-day deltas), revenue chart (7D/30D toggle), order status chart, user growth chart, top 5 products, activity timeline

**Users** — Card grid with role badges, search/filter/pagination, detail modal, status toggle, password reset, delete with confirmation, main admin protection

**Products** — Approve/reject/feature toggle, bulk actions, filter by status/category/seller, search, pagination

**Orders** — Status badges, filter/search, cancel with confirmation, navigate to order details

**Messages** — Message cards with preview, search, pagination, detail modal (self-contained, no HTML changes needed)

### 🏪 Seller Dashboard (`seller-dashboard.js`)
- Seller-specific data (own products and orders only)
- Stats: total products, revenue, orders, pending count
- Add/edit/delete products with Base64 image upload and gallery
- Revenue chart, orders table with filter/sort/pagination, top product widget, pending badge

### 🧭 Navbar (`navbar.js`)
- Dynamic content based on role (admin/seller links, cart icon visibility)
- Welcome message, login/logout toggle
- Add to cart function accessible across pages
- Real-time cart badge, active page highlighting
- Auto-initializes users and products data from JSON

---

## 💾 Data Model

### Users
```json
{
  "id": "1",
  "name": "Admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin | seller | customer",
  "phone": "+1234567892",
  "address": "789 Admin Plaza, Chicago, USA",
  "storeName": "Jane's Electronics",
  "status": "active | inactive",
  "dateCreated": "2026-02-01",
  "isMain": true
}
```

### Products
```json
{
  "id": "1",
  "name": "Leather Jacket",
  "description": "Stylish brown leather jacket...",
  "price": 1000,
  "discount": 10,
  "finalPrice": 990,
  "image": "/assets/images/products/fashion/Jacket1.png",
  "detailImages": ["jacket2.png", "jacket3.png", "jacket4.png"],
  "category": "Fashion | Mobiles | Electronics | Home | Beauty",
  "brand": "UrbanStyle",
  "sellerId": "1",
  "sellerName": "Admin",
  "stock": 25,
  "rating": 4.7,
  "reviewCount": 85,
  "status": "approved | pending | rejected",
  "dateAdded": "2026-02-10",
  "featured": true
}
```

### Orders
```json
{
  "id": "ORD-1772463845579",
  "userId": "2",
  "fullName": "Aml",
  "phone": "01234567890",
  "address": "123 Main St",
  "paymentMethod": "visa | MasterCard | cash",
  "items": [
    {
      "productId": "1",
      "productName": "Leather Jacket",
      "price": 900,
      "quantity": 1,
      "total": 900
    }
  ],
  "subTotal": 900,
  "tax": 126,
  "shipping": 0,
  "totalPrice": 1026,
  "status": "pending | shipped | delivered | cancelled",
  "orderDate": "2026-03-02T15:04:05.579Z"
}
```

### Cart Items
```json
{
  "productId": "1",
  "userId": "2",
  "quantity": 1,
  "addedAt": "2026-03-02T15:04:05.579Z"
}
```

### Wishlist
```json
{
  "userId": [
    { "productId": "1" }
  ]
}
```

### Contact Messages
```json
{
  "id": "MSG-1772463845579",
  "name": "Ahmed",
  "email": "ahmed@gmail.com",
  "subject": "Order Issue",
  "message": "I didn't get the order on the timeline and it was broken",
  "date": "3/2/2026, 5:04:05 PM"
}
```

### Admin Logs
```json
{
  "action": "Reset Password | Delete User",
  "target": "user@email.com",
  "date": "2026-03-02T15:04:05.579Z"
}
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge)
- A local HTTP server (required for ES6 module imports)

### Installation

1. Clone the repository
2. Start a local server (e.g., VS Code Live Server, Python `http.server`, or `npx serve`)
3. Open the project in your browser
4. Seed data loads automatically on first visit from the JSON files in `/data/`

---

## 🔑 Default Accounts

| Role         | Email                | Password |
|--------------|----------------------|----------|
| **Admin**    | admin@example.com    | admin123 |
| **Customer** | customer@example.com | 123456   |
| **Seller**   | seller@example.com   | 123456   |

---

## 🧑‍🤝‍🧑 Team

Developed by a 5-person team for the **ITI CST Program** (February–March 2026).

| Name         | Role        | Contribution                                             |
|--------------|-------------|----------------------------------------------------------|
| Ahmed Khalil | Team Leader | Homepage, Catalog, Profile, Order Details , Navbar/Footer|
| Aml Ali      | Developer   | Seller Dashboard, Admin Panel                            |
| Ahmed Dabish | Developer   | Product Details, Cart, Wishlist, Reviews                 |
| Menna Lashen | Developer   | Customer Service, Contacts, Checkout                     |
| Mazen Gamal  | Developer   | Login & Register                                         |


---

*Built with ❄️ by the IceMart Team*
