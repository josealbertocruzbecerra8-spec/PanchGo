const SUPABASE_URL = "https://vciekecvbqvlbavxhmfz.supabase.co";
const SUPABASE_KEY = "sb_publishable_1wRntDky8YlSGLmynI8O5Q_lNSbWMbu";

const PANCHGO_WHATSAPP = "525629913802";

let cart = [];
let selectedBusiness = null;
let selectedBusinessData = null;
let customerLocation = null;
let deliveryDistanceKm = null;
let deliveryFee = 0;
let deliveryQuoteRequired = false;


/* =========================
   TARIFAS DE ENVÍO
========================= */

function calculateDeliveryFee(distanceKm) {
    if (distanceKm <= 2) return 25;
    if (distanceKm <= 4) return 28;
    if (distanceKm <= 6) return 32;
    if (distanceKm <= 8) return 36;
    if (distanceKm <= 10) return 40;
    if (distanceKm <= 12) return 45;
    if (distanceKm <= 15) return 50;
    if (distanceKm <= 18) return 60;
    if (distanceKm <= 22) return 70;
    if (distanceKm <= 25) return 80;
    if (distanceKm <= 30) return 95;

    return null;
}


/* =========================
   ELEMENTOS
========================= */

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");

const foodButton = document.getElementById("foodButton");
const storesButton = document.getElementById("storesButton");

const heroFoodButton =
    document.getElementById("heroFoodButton");

const heroStoreButton =
    document.getElementById("heroStoreButton");

const businessSection =
    document.getElementById("businessSection");

const storeSection =
    document.getElementById("storeSection");

const productsSection =
    document.getElementById("productsSection");

const productsBusinessName =
    document.getElementById("productsBusinessName");

const productsBusinessDescription =
    document.getElementById(
        "productsBusinessDescription"
    );

const productGrid =
    document.getElementById("productGrid");

const cartSection =
    document.getElementById("cartSection");

const cartItems =
    document.getElementById("cartItems");

const cartSubtotal =
    document.getElementById("cartSubtotal");

const deliveryCost =
    document.getElementById("deliveryCost");

const cartTotal =
    document.getElementById("cartTotal");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const customerAddress =
    document.getElementById("customerAddress");

const useLocationButton =
    document.getElementById("useLocationButton");

const locationStatus =
    document.getElementById("locationStatus");

const paymentMethod =
    document.getElementById("paymentMethod");

const sendOrderButton =
    document.getElementById("sendOrderButton");

const orderModal =
    document.getElementById("orderModal");

const orderPreview =
    document.getElementById("orderPreview");

const closeOrderModal =
    document.getElementById("closeOrderModal");

const whatsappOrderButton =
    document.getElementById("whatsappOrderButton");

const joinBusinessButton =
    document.getElementById("joinBusinessButton");


/* =========================
   MENSAJES
========================= */

function showBusinessMessage(
    title,
    message,
    icon = "ℹ️"
) {
    const list =
        document.querySelector(".business-list");

    if (!list) return;

    list.innerHTML = `
        <div class="empty-message">
            <span>${icon}</span>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}


function showProductMessage(
    title,
    message,
    icon = "ℹ️"
) {
    if (!productGrid) return;

    productGrid.innerHTML = `
        <div class="empty-message">
            <span>${icon}</span>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}


/* =========================
   CARGAR NEGOCIOS
========================= */

async function loadBusinesses() {

    showBusinessMessage(
        "Cargando negocios...",
        "Conectando con Supabase.",
        "⏳"
    );

    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/Businesses" +
            "?select=*" +
            "&%22Active%22=eq.true" +
            "&order=name";

        const response =
            await fetch(url, {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        "Bearer " + SUPABASE_KEY,
                    "Accept":
                        "application/json"
                }
            });

        const text =
            await response.text();

        if (!response.ok) {
            throw new Error(
                "Supabase HTTP " +
                response.status +
                ": " +
                text
            );
        }

        const data =
            JSON.parse(text);

        console.log(
            "PanchGo BUSINESSES:",
            data
        );

        if (!Array.isArray(data)) {
            throw new Error(
                "Supabase no devolvió una lista de negocios."
            );
        }

        if (data.length === 0) {

            showBusinessMessage(
                "No hay negocios disponibles.",
                "No encontramos negocios activos.",
                "🏪"
            );

            return;
        }

        renderBusinesses(data);

    } catch (error) {

        console.error(
            "PanchGo ERROR BUSINESSES:",
            error
        );

        showBusinessMessage(
            "Error al cargar negocios.",
            error.message,
            "⚠️"
        );
    }
}
const SUPABASE_URL = "https://vciekecvbqvlbavxhmfz.supabase.co";
const SUPABASE_KEY = "sb_publishable_1wRntDky8YlSGLmynI8O5Q_lNSbWMbu";

const PANCHGO_WHATSAPP = "525629913802";

let cart = [];
let selectedBusiness = null;
let selectedBusinessData = null;
let customerLocation = null;
let deliveryDistanceKm = null;
let deliveryFee = 0;
let deliveryQuoteRequired = false;


/* =========================
   TARIFAS DE ENVÍO
========================= */

function calculateDeliveryFee(distanceKm) {
    if (distanceKm <= 2) return 25;
    if (distanceKm <= 4) return 28;
    if (distanceKm <= 6) return 32;
    if (distanceKm <= 8) return 36;
    if (distanceKm <= 10) return 40;
    if (distanceKm <= 12) return 45;
    if (distanceKm <= 15) return 50;
    if (distanceKm <= 18) return 60;
    if (distanceKm <= 22) return 70;
    if (distanceKm <= 25) return 80;
    if (distanceKm <= 30) return 95;

    return null;
}


/* =========================
   ELEMENTOS
========================= */

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");

const foodButton = document.getElementById("foodButton");
const storesButton = document.getElementById("storesButton");

const heroFoodButton =
    document.getElementById("heroFoodButton");

const heroStoreButton =
    document.getElementById("heroStoreButton");

const businessSection =
    document.getElementById("businessSection");

const storeSection =
    document.getElementById("storeSection");

const productsSection =
    document.getElementById("productsSection");

const productsBusinessName =
    document.getElementById("productsBusinessName");

const productsBusinessDescription =
    document.getElementById(
        "productsBusinessDescription"
    );

const productGrid =
    document.getElementById("productGrid");

const cartSection =
    document.getElementById("cartSection");

const cartItems =
    document.getElementById("cartItems");

const cartSubtotal =
    document.getElementById("cartSubtotal");

const deliveryCost =
    document.getElementById("deliveryCost");

const cartTotal =
    document.getElementById("cartTotal");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const customerAddress =
    document.getElementById("customerAddress");

const useLocationButton =
    document.getElementById("useLocationButton");

const locationStatus =
    document.getElementById("locationStatus");

const paymentMethod =
    document.getElementById("paymentMethod");

const sendOrderButton =
    document.getElementById("sendOrderButton");

const orderModal =
    document.getElementById("orderModal");

const orderPreview =
    document.getElementById("orderPreview");

const closeOrderModal =
    document.getElementById("closeOrderModal");

const whatsappOrderButton =
    document.getElementById("whatsappOrderButton");

const joinBusinessButton =
    document.getElementById("joinBusinessButton");


/* =========================
   MENSAJES
========================= */

function showBusinessMessage(
    title,
    message,
    icon = "ℹ️"
) {
    const list =
        document.querySelector(".business-list");

    if (!list) return;

    list.innerHTML = `
        <div class="empty-message">
            <span>${icon}</span>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}


function showProductMessage(
    title,
    message,
    icon = "ℹ️"
) {
    if (!productGrid) return;

    productGrid.innerHTML = `
        <div class="empty-message">
            <span>${icon}</span>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}


/* =========================
   CARGAR NEGOCIOS
========================= */

async function loadBusinesses() {

    showBusinessMessage(
        "Cargando negocios...",
        "Conectando con Supabase.",
        "⏳"
    );

    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/Businesses" +
            "?select=*" +
            "&Active=eq.true" +
            "&order=name";

        const response =
            await fetch(url, {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        "Bearer " + SUPABASE_KEY,
                    "Accept":
                        "application/json"
                }
            });

        const text =
            await response.text();

        if (!response.ok) {
            throw new Error(
                "Supabase HTTP " +
                response.status +
                ": " +
                text
            );
        }

        const data =
            JSON.parse(text);

        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            showBusinessMessage(
                "No hay negocios disponibles.",
                "No encontramos negocios activos.",
                "🏪"
            );

            return;
        }

        renderBusinesses(data);

    } catch (error) {

        console.error(
            "PanchGo ERROR BUSINESSES:",
            error
        );

        showBusinessMessage(
            "Error al cargar negocios.",
            error.message,
            "⚠️"
        );
    }
}


/* =========================
   MOSTRAR NEGOCIOS
========================= */

function renderBusinesses(businesses) {

    const businessList =
        document.querySelector(".business-list");

    if (!businessList) return;

    businessList.innerHTML = "";

    businesses.forEach(
        business => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "business-card";

            button.innerHTML = `
                <div class="business-icon">
                    🏪
                </div>

                <div class="business-info">

                    <h3>
                        ${
                            business.name ||
                            "Negocio"
                        }
                    </h3>

                    <p>
                        ${
                            business["Descripción"] ||
                            "Negocio local"
                        }
                    </p>

                    <span class="delivery-label">
                        🛵 Entrega a domicilio
                    </span>

                </div>

                <span class="business-arrow">
                    ›
                </span>
            `;

            button.addEventListener(
                "click",
                () =>
                    openBusiness(business)
            );

            businessList.appendChild(
                button
            );
        }
    );
}


/* =========================
   ABRIR NEGOCIO
========================= */

async function openBusiness(
    business
) {

    selectedBusiness =
        business.id;

    selectedBusinessData =
        business;

    deliveryDistanceKm =
        null;

    deliveryFee =
        0;

    deliveryQuoteRequired =
        false;

    if (productsBusinessName) {

        productsBusinessName.textContent =
            business.name ||
            "Negocio";
    }

    if (productsBusinessDescription) {

        productsBusinessDescription.textContent =
            business["Descripción"] ||
            "Productos disponibles";
    }

    showProductMessage(
        "Cargando productos...",
        "Buscando el catálogo de este negocio.",
        "⏳"
    );

    if (productsSection) {

        productsSection.scrollIntoView({
            behavior: "smooth"
        });
    }

    await loadProducts(
        business.id
    );
}


/* =========================
   CARGAR PRODUCTOS
========================= */

async function loadProducts(
    businessId
) {

    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/Products" +
            "?select=*" +
            "&Businesses_id=eq." +
            encodeURIComponent(
                businessId
            ) +
            "&Active=eq.true" +
            "&order=name";

        const response =
            await fetch(url, {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,
                    "Accept":
                        "application/json"
                }
            });

        const text =
            await response.text();

        if (!response.ok) {

            throw new Error(
                "Supabase HTTP " +
                response.status +
                ": " +
                text
            );
        }

        const data =
            JSON.parse(text);

        if (!Array.isArray(data)) {

            throw new Error(
                "Supabase no devolvió una lista de productos."
            );
        }

        if (data.length === 0) {

            showProductMessage(
                "Sin productos todavía.",
                "Este negocio no tiene productos activos.",
                "🍽️"
            );

            return;
        }

        renderProducts(data);

    } catch (error) {

        console.error(
            "PanchGo ERROR PRODUCTS:",
            error
        );

        showProductMessage(
            "Error al cargar productos.",
            error.message,
            "⚠️"
        );
    }
}


/* =========================
   MOSTRAR PRODUCTOS
========================= */

function renderProducts(
    products
) {

    if (!productGrid) return;

    productGrid.innerHTML = "";

    products.forEach(
        product => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "product-card";

            const name =
                product.name ||
                "Producto";

            const description =
                product["Description"] ||
                product["Descripción"] ||
                "";

            const price =
                Number(
                    product["Price"] ||
                    product["price"] ||
                    0
                );

            const productId =
                product["Id"] ||
                product["id"];

            card.innerHTML = `
                <div class="product-info">

                    <h3>
                        ${name}
                    </h3>

                    <p>
                        ${description}
                    </p>

                    <strong>
                        $${price.toFixed(2)}
                    </strong>

                </div>

                <button
                    type="button"
                    class="primary-button add-product-button"
                >
                    Agregar
                </button>
            `;

            const addButton =
                card.querySelector(
                    ".add-product-button"
                );

            addButton.addEventListener(
                "click",
                () =>
                    addToCart(product)
            );

            productGrid.appendChild(
                card
            );
        }
    );
}


/* =========================
   AGREGAR AL CARRITO
========================= */

function addToCart(
    product
) {

    const businessId =
        product["Businesses_id"] ||
        product["business_id"] ||
        selectedBusiness;

    if (cart.length > 0) {

        if (
            String(
                cart[0].businessId
            ) !==
            String(businessId)
        ) {

            alert(
                "Tu carrito contiene productos de otro negocio."
            );

            return;
        }
    }

    const id =
        product["Id"] ||
        product["id"];

    const existing =
        cart.find(
            item =>
                String(item.id) ===
                String(id)
        );

    const price =
        Number(
            product["Price"] ||
            product["price"] ||
            0
        );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: id,

            name:
                product.name ||
                "Producto",

            price: price,

            quantity: 1,

            business:
                selectedBusinessData?.name ||
                "Negocio",

            businessId:
                businessId
        });
    }

    updateCart();
}


/* =========================
   CAMBIAR CANTIDAD
========================= */

function changeQuantity(
    id,
    action
) {

    const item =
        cart.find(
            product =>
                String(
                    product.id
                ) ===
                String(id)
        );

    if (!item) return;

    if (action === "plus") {
        item.quantity++;
    }

    if (action === "minus") {

        item.quantity--;

        if (
            item.quantity <= 0
        ) {

            cart =
                cart.filter(
                    product =>
                        String(
                            product.id
                        ) !==
                        String(id)
                );
        }
    }

    updateCart();
}


/* =========================
   ACTUALIZAR CARRITO
========================= */

function updateCart() {

    if (cartCount) {

        cartCount.textContent =
            cart.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.quantity,
                0
            );
    }

    if (cartItems) {

        if (
            cart.length === 0
        ) {

            cartItems.innerHTML = `
                <div class="empty-cart">

                    🛒

                    <h3>
                        Tu carrito está vacío
                    </h3>

                    <p>
                        Agrega productos de un negocio
                        para comenzar tu pedido.
                    </p>

                </div>
            `;

        } else {

            cartItems.innerHTML =
                "";

            cart.forEach(
                item => {

                    const element =
                        document.createElement(
                            "div"
                        );

                    element.className =
                        "cart-item";

                    element.innerHTML = `
                        <div>

                            <strong>
                                ${item.name}
                            </strong>

                            <p>
                                $${item.price.toFixed(2)}
                                × ${item.quantity}
                            </p>

                        </div>

                        <div class="cart-item-controls">

                            <button
                                type="button"
                                class="quantity-button"
                                data-id="${item.id}"
                                data-action="minus"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                class="quantity-button"
                                data-id="${item.id}"
                                data-action="plus"
                            >
                                +
                            </button>

                        </div>
                    `;

                    cartItems.appendChild(
                        element
                    );
                }
            );

            document
                .query

/* =========================
   MOSTRAR NEGOCIOS
========================= */

function renderBusinesses(businesses) {

    const businessList =
        document.querySelector(".business-list");

    if (!businessList) return;

    businessList.innerHTML = "";

    businesses.forEach(
        business => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "business-card";

            button.innerHTML = `
                <div class="business-icon">
                    🏪
                </div>

                <div class="business-info">

                    <h3>
                        ${
                            business.name ||
                            "Negocio"
                        }
                    </h3>

                    <p>
                        ${
                            business["Descripción"] ||
                            "Negocio local"
                        }
                    </p>

                    <span class="delivery-label">
                        🛵 Entrega a domicilio
                    </span>

                </div>

                <span class="business-arrow">
                    ›
                </span>
            `;

            button.addEventListener(
                "click",
                () =>
                    openBusiness(business)
            );

            businessList.appendChild(
                button
            );
        }
    );
}


/* =========================
   ABRIR NEGOCIO
========================= */

async function openBusiness(
    business
) {

    selectedBusiness =
        business.id;

    selectedBusinessData =
        business;

    deliveryDistanceKm =
        null;

    deliveryFee =
        0;

    deliveryQuoteRequired =
        false;

    if (productsBusinessName) {

        productsBusinessName.textContent =
            business.name ||
            "Negocio";
    }

    if (productsBusinessDescription) {

        productsBusinessDescription.textContent =
            business["Descripción"] ||
            "Productos disponibles";
    }

    showProductMessage(
        "Cargando productos...",
        "Buscando el catálogo de este negocio.",
        "⏳"
    );

    if (productsSection) {

        productsSection.scrollIntoView({
            behavior: "smooth"
        });
    }

    await loadProducts(
        business.id
    );
}


/* =========================
   CARGAR PRODUCTOS
========================= */

async function loadProducts(
    businessId
) {

    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/Products" +
            "?select=*" +
            "&Businesses_id=eq." +
            encodeURIComponent(
                businessId
            ) +
            "&Active=eq.true" +
            "&order=name";

        const response =
            await fetch(url, {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,
                    "Accept":
                        "application/json"
                }
            });

        const text =
            await response.text();

        if (!response.ok) {

            throw new Error(
                "Supabase HTTP " +
                response.status +
                ": " +
                text
            );
        }

        const data =
            JSON.parse(text);

        if (!Array.isArray(data)) {

            throw new Error(
                "Supabase no devolvió una lista de productos."
            );
        }

        if (data.length === 0) {

            showProductMessage(
                "Sin productos todavía.",
                "Este negocio no tiene productos activos.",
                "🍽️"
            );

            return;
        }

        renderProducts(data);

    } catch (error) {

        console.error(
            "PanchGo ERROR PRODUCTS:",
            error
        );

        showProductMessage(
            "Error al cargar productos.",
            error.message,
            "⚠️"
        );
    }
}


/* =========================
   MOSTRAR PRODUCTOS
========================= */

function renderProducts(
    products
) {

    if (!productGrid) return;

    productGrid.innerHTML = "";

    products.forEach(
        product => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "product-card";

            const name =
                product.name ||
                "Producto";

            const description =
                product["Description"] ||
                product["Descripción"] ||
                "";

            const price =
                Number(
                    product["Price"] ||
                    product["price"] ||
                    0
                );

            const productId =
                product["Id"] ||
                product["id"];

            card.innerHTML = `
                <div class="product-info">

                    <h3>
                        ${name}
                    </h3>

                    <p>
                        ${description}
                    </p>

                    <strong>
                        $${price.toFixed(2)}
                    </strong>

                </div>

                <button
                    type="button"
                    class="primary-button add-product-button"
                >
                    Agregar
                </button>
            `;

            const addButton =
                card.querySelector(
                    ".add-product-button"
                );

            addButton.addEventListener(
                "click",
                () =>
                    addToCart(product)
            );

            productGrid.appendChild(
                card
            );
        }
    );
}


/* =========================
   AGREGAR AL CARRITO
========================= */

function addToCart(
    product
) {

    const businessId =
        product["Businesses_id"] ||
        product["business_id"] ||
        selectedBusiness;

    if (cart.length > 0) {

        if (
            String(
                cart[0].businessId
            ) !==
            String(businessId)
        ) {

            alert(
                "Tu carrito contiene productos de otro negocio."
            );

            return;
        }
    }

    const id =
        product["Id"] ||
        product["id"];

    const existing =
        cart.find(
            item =>
                String(item.id) ===
                String(id)
        );

    const price =
        Number(
            product["Price"] ||
            product["price"] ||
            0
        );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: id,

            name:
                product.name ||
                "Producto",

            price: price,

            quantity: 1,

            business:
                selectedBusinessData?.name ||
                "Negocio",

            businessId:
                businessId
        });
    }

    updateCart();
}


/* =========================
   CAMBIAR CANTIDAD
========================= */

function changeQuantity(
    id,
    action
) {

    const item =
        cart.find(
            product =>
                String(
                    product.id
                ) ===
                String(id)
        );

    if (!item) return;

    if (action === "plus") {
        item.quantity++;
    }

    if (action === "minus") {

        item.quantity--;

        if (
            item.quantity <= 0
        ) {

            cart =
                cart.filter(
                    product =>
                        String(
                            product.id
                        ) !==
                        String(id)
                );
        }
    }

    updateCart();
}


/* =========================
   ACTUALIZAR CARRITO
========================= */

function updateCart() {

    if (cartCount) {

        cartCount.textContent =
            cart.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.quantity,
                0
            );
    }

    if (cartItems) {

        if (
            cart.length === 0
        ) {

            cartItems.innerHTML = `
                <div class="empty-cart">

                    🛒

                    <h3>
                        Tu carrito está vacío
                    </h3>

                    <p>
                        Agrega productos de un negocio
                        para comenzar tu pedido.
                    </p>

                </div>
            `;

        } else {

            cartItems.innerHTML =
                "";

            cart.forEach(
                item => {

                    const element =
                        document.createElement(
                            "div"
                        );

                    element.className =
                        "cart-item";

                    element.innerHTML = `
                        <div>

                            <strong>
                                ${item.name}
                            </strong>

                            <p>
                                $${item.price.toFixed(2)}
                                × ${item.quantity}
                            </p>

                        </div>

                        <div class="cart-item-controls">

                            <button
                                type="button"
                                class="quantity-button"
                                data-id="${item.id}"
                                data-action="minus"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                class="quantity-button"
                                data-id="${item.id}"
                                data-action="plus"
                            >
                                +
                            </button>

                        </div>
                    `;

                    cartItems.appendChild(
                        element
                    );
                }
            );

            document
                .query