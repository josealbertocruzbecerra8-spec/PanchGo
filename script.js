/* =========================================================
   PANCHGO
   SCRIPT COMPLETO
   SUPABASE — BUSINESSES + PRODUCTS
   PEDIDOS — WHATSAPP
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://vciekecvbqvlbavxhmfz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_1wRntDky8YlSGLmynI8O5Q_lNSbWMbu";


/* =========================================================
   CONFIGURACIÓN PANCHGO
========================================================= */

const PANCHGO_WHATSAPP =
    "525629913802";


/* =========================================================
   ESTADO
========================================================= */

let cart = [];

let selectedBusiness = null;

let selectedBusinessData = null;

let customerLocation = null;

let deliveryDistanceKm = null;

let deliveryFee = 0;

let deliveryQuoteRequired = false;


/* =========================================================
   TARIFAS DE ENVÍO
========================================================= */

function calculateDeliveryFee(
    distanceKm
) {

    if (distanceKm <= 2) {
        return 25;
    }

    if (distanceKm <= 4) {
        return 28;
    }

    if (distanceKm <= 6) {
        return 32;
    }

    if (distanceKm <= 8) {
        return 36;
    }

    if (distanceKm <= 10) {
        return 40;
    }

    if (distanceKm <= 12) {
        return 45;
    }

    if (distanceKm <= 15) {
        return 50;
    }

    if (distanceKm <= 18) {
        return 60;
    }

    if (distanceKm <= 22) {
        return 70;
    }

    if (distanceKm <= 25) {
        return 80;
    }

    if (distanceKm <= 30) {
        return 95;
    }

    return null;
}


/* =========================================================
   ELEMENTOS
========================================================= */

const cartButton =
    document.getElementById("cartButton");

const cartCount =
    document.getElementById("cartCount");

const foodButton =
    document.getElementById("foodButton");

const storesButton =
    document.getElementById("storesButton");

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
    document.getElementById(
        "productsBusinessName"
    );

const productsBusinessDescription =
    document.getElementById(
        "productsBusinessDescription"
    );

const productGrid =
    document.getElementById(
        "productGrid"
    );

const cartSection =
    document.getElementById(
        "cartSection"
    );

const cartItems =
    document.getElementById(
        "cartItems"
    );

const cartSubtotal =
    document.getElementById(
        "cartSubtotal"
    );

const deliveryCost =
    document.getElementById(
        "deliveryCost"
    );

const cartTotal =
    document.getElementById(
        "cartTotal"
    );

const customerName =
    document.getElementById(
        "customerName"
    );

const customerPhone =
    document.getElementById(
        "customerPhone"
    );

const customerAddress =
    document.getElementById(
        "customerAddress"
    );

const useLocationButton =
    document.getElementById(
        "useLocationButton"
    );

const locationStatus =
    document.getElementById(
        "locationStatus"
    );

const paymentMethod =
    document.getElementById(
        "paymentMethod"
    );

const sendOrderButton =
    document.getElementById(
        "sendOrderButton"
    );

const orderModal =
    document.getElementById(
        "orderModal"
    );

const orderPreview =
    document.getElementById(
        "orderPreview"
    );

const closeOrderModal =
    document.getElementById(
        "closeOrderModal"
    );

const whatsappOrderButton =
    document.getElementById(
        "whatsappOrderButton"
    );

const joinBusinessButton =
    document.getElementById(
        "joinBusinessButton"
    );


/* =========================================================
   MENSAJE DE NEGOCIOS
========================================================= */

function showBusinessMessage(
    title,
    message,
    icon = "ℹ️"
) {

    const businessList =
        document.querySelector(
            ".business-list"
        );

    if (!businessList) {
        return;
    }

    businessList.innerHTML = `

        <div class="empty-message">

            <span>${icon}</span>

            <h3>
                ${title}
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;
}


/* =========================================================
   MENSAJE DE PRODUCTOS
========================================================= */

function showProductMessage(
    title,
    message,
    icon = "ℹ️"
) {

    if (!productGrid) {
        return;
    }

    productGrid.innerHTML = `

        <div class="empty-message">

            <span>${icon}</span>

            <h3>
                ${title}
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;
}


/* =========================================================
   CARGAR NEGOCIOS
========================================================= */

async function loadBusinesses() {

    console.log(
        "PanchGo: iniciando consulta de negocios..."
    );

    showBusinessMessage(
        "Cargando negocios...",
        "Conectando con Supabase.",
        "⏳"
    );

    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            function () {

                controller.abort();

            },
            8000
        );

    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/Businesses" +
            "?select=id,name,%22Descripci%C3%B3n%22,%22Active%22,latitude,longitude" +
            "&%22Active%22=eq.true" +
            "&order=name";

        console.log(
            "PanchGo URL negocios:",
            url
        );

        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    signal:
                        controller.signal,

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_KEY,

                        "Accept":
                            "application/json"
                    }
                }
            );

        clearTimeout(
            timeout
        );

        console.log(
            "PanchGo HTTP negocios:",
            response.status
        );

        const responseText =
            await response.text();

        console.log(
            "PanchGo respuesta negocios:",
            responseText
        );

        if (!response.ok) {

            throw new Error(
                "Supabase respondió HTTP " +
                response.status +
                ": " +
                responseText
            );
        }

        let data;

        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch (error) {

            throw new Error(
                "La respuesta de Supabase no es JSON."
            );
        }

        if (
            !Array.isArray(data)
        ) {

            throw new Error(
                "Supabase no devolvió una lista de negocios."
            );
        }

        if (
            data.length === 0
        ) {

            showBusinessMessage(
                "No hay negocios disponibles.",
                "Supabase respondió correctamente, pero no encontró negocios activos.",
                "🏪"
            );

            return;
        }

        console.log(
            "PanchGo negocios recibidos:",
            data
        );

        renderBusinesses(
            data
        );

    } catch (error) {

        clearTimeout(
            timeout
        );

        console.error(
            "PanchGo ERROR BUSINESSES:",
            error
        );

        if (
            error.name ===
            "AbortError"
        ) {

            showBusinessMessage(
                "Supabase no respondió.",
                "La conexión tardó más de 8 segundos.",
                "⏱️"
            );

            return;
        }

        showBusinessMessage(
            "Error al cargar negocios.",
            error.message,
            "⚠️"
        );
    }
}


/* =========================================================
   MOSTRAR NEGOCIOS
========================================================= */

function renderBusinesses(
    businesses
) {

    const businessList =
        document.querySelector(
            ".business-list"
        );

    if (!businessList) {

        console.error(
            "PanchGo: no existe .business-list"
        );

        return;
    }

    businessList.innerHTML = "";

    businesses.forEach(
        function (business) {

            const button =
                document.createElement(
                    "button"
                );

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
                function () {

                    openBusiness(
                        business
                    );

                }
            );

            businessList.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   ABRIR NEGOCIO
========================================================= */

async function openBusiness(
    business
) {

    selectedBusiness =
        business.id;

    selectedBusinessData =
        business;

    /*
     * Al cambiar de negocio,
     * se reinicia el cálculo del envío.
     */

    deliveryDistanceKm = null;

    deliveryFee = 0;

    deliveryQuoteRequired = false;

    productsBusinessName.textContent =
        business.name ||
        "Negocio";

    productsBusinessDescription.textContent =
        business["Descripción"] ||
        "Productos disponibles";

    showProductMessage(
        "Cargando productos...",
        "Buscando el catálogo de este negocio.",
        "⏳"
    );

    productsSection.scrollIntoView({
        behavior: "smooth"
    });

    await loadProducts(
        business.id
    );
}


/* =========================================================
   CARGAR PRODUCTOS
   FILTRADOS POR NEGOCIO
========================================================= */

async function loadProducts(
    businessId
) {

    console.log(
        "PanchGo: cargando productos del negocio:",
        businessId
    );

    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            function () {

                controller.abort();

            },
            8000
        );

    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/Products" +
            "?select=%22Id%22,name,%22Description%22,%22Price%22,%22Active%22,%22Businesses_id%22" +
            "&%22Businesses_id%22=eq." +
            encodeURIComponent(
                businessId
            ) +
            "&%22Active%22=eq.true" +
            "&order=name";

        console.log(
            "PanchGo URL productos:",
            url
        );

        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    signal:
                        controller.signal,

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_KEY,

                        "Accept":
                            "application/json"
                    }
                }
            );

        clearTimeout(
            timeout
        );

        console.log(
            "PanchGo HTTP productos:",
            response.status
        );

        const responseText =
            await response.text();

        console.log(
            "PanchGo respuesta productos:",
            responseText
        );

        if (!response.ok) {

            throw new Error(
                "Supabase respondió HTTP " +
                response.status +
                ": " +
                responseText
            );
        }

        let data;

        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch (error) {

            throw new Error(
                "La respuesta de Products no es JSON."
            );
        }

        if (
            !Array.isArray(data)
        ) {

            throw new Error(
                "Supabase no devolvió una lista de productos."
            );
        }

        console.log(
            "PanchGo productos recibidos:",
            data.length
        );

        if (
            data.length === 0
        ) {

            showProductMessage(
                "Sin productos todavía.",
                "Este negocio todavía no tiene productos disponibles.",
                "🍽️"
            );

            return;
        }

        renderProducts(
            data
        );

    } catch (error) {

        clearTimeout(
            timeout
        );

        console.error(
            "PanchGo ERROR PRODUCTS:",
            error
        );

        if (
            error.name ===
            "AbortError"
        ) {

            showProductMessage(
                "Supabase no respondió.",
                "La consulta de productos tardó más de 8 segundos.",
                "⏱️"
            );

            return;
        }

        showProductMessage(
            "Error al cargar productos.",
            error.message,
            "⚠️"
        );
    }
}


/* =========================================================
   MOSTRAR PRODUCTOS
========================================================= */

function renderProducts(
    products
) {

    productGrid.innerHTML = "";

    products.forEach(
        function (product) {

            const productCard =
                document.createElement(
                    "div"
                );

            productCard.className =
                "product-card";

            const productName =
                product.name ||
                "Producto";

            const productDescription =
                product["Description"] ||
                "";

            const productPrice =
                Number(
                    product["Price"] || 0
                );

            productCard.innerHTML = `

                <div class="product-info">

                    <h3>
                        ${productName}
                    </h3>

                    <p>
                        ${productDescription}
                    </p>

                    <strong>
                        $${productPrice.toFixed(2)}
                    </strong>

                </div>

                <button
                    class="primary-button add-product-button"
                    type="button"
                >
                    Agregar
                </button>

            `;

            const addButton =
                productCard.querySelector(
                    ".add-product-button"
                );

            addButton.addEventListener(
                "click",
                function () {

                    addToCart(
                        product
                    );

                }
            );

            productGrid.appendChild(
                productCard
            );
        }
    );
}


/* =========================================================
   AGREGAR AL CARRITO
========================================================= */

function addToCart(
    product
) {

    const productBusinessId =
        product["Businesses_id"] ||
        selectedBusiness;

    if (
        cart.length > 0
    ) {

        const currentCartBusinessId =
            cart[0].businessId;

        if (
            String(
                currentCartBusinessId
            ) !==
            String(
                productBusinessId
            )
        ) {

            alert(
                "Tu carrito contiene productos de otro negocio.\n\nFinaliza ese pedido antes de agregar productos de este negocio."
            );

            return;
        }
    }

    const existingProduct =
        cart.find(
            function (item) {

                return (
                    String(item.id) ===
                    String(product["Id"])
                );

            }
        );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id:
                product["Id"],

            name:
                product.name,

            price:
                Number(
                    product["Price"] || 0
                ),

            quantity:
                1,

            business:
                selectedBusinessData
                    ? selectedBusinessData.name
                    : "Negocio",

            businessId:
                productBusinessId

        });
    }

    updateCart();
}


/* =========================================================
   ACTUALIZAR CARRITO
========================================================= */

function updateCart() {

    const count =
        cart.reduce(
            function (
                total,
                item
            ) {

                return (
                    total +
                    item.quantity
                );

            },
            0
        );

    cartCount.textContent =
        count;

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

        cartItems.innerHTML = "";

        cart.forEach(
            function (item) {

                const itemElement =
                    document.createElement(
                        "div"
                    );

                itemElement.className =
                    "cart-item";

                itemElement.innerHTML = `

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
                            class="quantity-button"
                            data-id="${item.id}"
                            data-action="minus"
                            type="button"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-button"
                            data-id="${item.id}"
                            data-action="plus"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                `;

                cartItems.appendChild(
                    itemElement
                );

            }
        );

        document
            .querySelectorAll(
                ".quantity-button"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            changeQuantity(
                                button.dataset.id,
                                button.dataset.action
                            );

                        }
                    );

                }
            );
    }

    const subtotal =
        cart.reduce(
            function (
                total,
                item
            ) {

                return (
                    total +
                    (
                        item.price *
                        item.quantity
                    )
                );

            },
            0
        );

    cartSubtotal.textContent =
        `$${subtotal.toFixed(2)}`;

    if (
        cart.length === 0
    ) {

        deliveryCost.textContent =
            "$0.00";

        cartTotal.textContent =
            "$0.00";

        return;
    }

    if (
        deliveryQuoteRequired
    ) {

        deliveryCost.textContent =
            "Cotizar";

        cartTotal.textContent =
            "Cotizar";

        return;
    }

    if (
        deliveryDistanceKm === null
    ) {

        deliveryCost.textContent =
            "Calculando";

        cartTotal.textContent =
            "Calculando";

        return;
    }

    deliveryCost.textContent =
        `$${deliveryFee.toFixed(2)}`;

    const total =
        subtotal +
        deliveryFee;

    cartTotal.textContent =
        `$${total.toFixed(2)}`;
}


/* =========================================================
   CAMBIAR CANTIDAD
========================================================= */

function changeQuantity(
    id,
    action
) {

    const item =
        cart.find(
            function (product) {

                return (
                    String(product.id) ===
                    String(id)
                );

            }
        );

    if (!item) {
        return;
    }

    if (
        action === "plus"
    ) {

        item.quantity += 1;

    }

    if (
        action === "minus"
    ) {

        item.quantity -= 1;

        if (
            item.quantity <= 0
        ) {

            cart =
                cart.filter(
                    function (product) {

                        return (
                            String(product.id) !==
                            String(id)
                        );

                    }
                );
        }
    }

    updateCart();
}


/* =========================================================
   CALCULAR RUTA
========================================================= */

async function calculateRoute() {

    if (
        !selectedBusinessData
    ) {

        throw new Error(
            "Primero selecciona un negocio."
        );

    }

    if (
        !Number.isFinite(
            Number(
                selectedBusinessData.latitude
            )
        ) ||
        !Number.isFinite(
            Number(
                selectedBusinessData.longitude
            )
        )
    ) {

        throw new Error(
            "Este negocio todavía no tiene una ubicación registrada."
        );

    }

    if (
        !customerLocation
    ) {

        throw new Error(
            "Primero debes usar tu ubicación."
        );

    }

    const start = [

        Number(
            selectedBusinessData.longitude
        ),

        Number(
            selectedBusinessData.latitude
        )

    ];

    const end = [

        Number(
            customerLocation.longitude
        ),

        Number(
            customerLocation.latitude
        )

    ];

    const response =
        await fetch(
            "/api/route",
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        start:
                            start,

                        end:
                            end

                    })

            }
        );

    const data =
        await response.json();

    if (
        !response.ok
    ) {

        throw new Error(
            data.error ||
            "No se pudo calcular la ruta."
        );

    }

    if (
        !Number.isFinite(
            Number(
                data.distanceKm
            )
        )
    ) {

        throw new Error(
            "La ruta no devolvió una distancia válida."
        );

    }

    deliveryDistanceKm =
        Number(
            data.distanceKm
        );

    const calculatedFee =
        calculateDeliveryFee(
            deliveryDistanceKm
        );

    if (
        calculatedFee === null
    ) {

        deliveryFee = 0;

        deliveryQuoteRequired =
            true;

    } else {

        deliveryFee =
            calculatedFee;

        deliveryQuoteRequired =
            false;

    }

    updateCart();

    return data;
}


/* =========================================================
   USAR MI UBICACIÓN
========================================================= */

if (
    useLocationButton
) {

    useLocationButton.addEventListener(
        "click",
        function () {

            if (
                !navigator.geolocation
            ) {

                locationStatus.textContent =
                    "Tu dispositivo no permite obtener la ubicación.";

                return;
            }

            if (
                !selectedBusinessData
            ) {

                locationStatus.textContent =
                    "Primero selecciona el negocio donde vas a comprar.";

                return;
            }

            locationStatus.textContent =
                "Obteniendo tu ubicación...";

            useLocationButton.disabled =
                true;

            navigator.geolocation.getCurrentPosition(

                async function (position) {

                    customerLocation = {

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude

                    };

                    try {

                        locationStatus.textContent =
                            "Calculando distancia de entrega...";

                        await calculateRoute();

                        if (
                            deliveryQuoteRequired
                        ) {

                            locationStatus.textContent =
                                "La distancia es mayor a 30 km. El envío requiere cotización.";

                        } else {

                            locationStatus.textContent =
                                "Distancia: " +
                                deliveryDistanceKm.toFixed(2) +
                                " km · Envío: $" +
                                deliveryFee.toFixed(2);

                        }

                    } catch (error) {

                        console.error(
                            "PanchGo ERROR UBICACIÓN:",
                            error
                        );

                        locationStatus.textContent =
                            error.message;

                    } finally {

                        useLocationButton.disabled =
                            false;

                    }

                },

                function (error) {

                    console.error(
                        "PanchGo GEOLOCATION ERROR:",
                        error
                    );

                    let message =
                        "No se pudo obtener tu ubicación.";

                    if (
                        error.code === 1
                    ) {

                        message =
                            "Permiso de ubicación denegado.";

                    }

                    if (
                        error.code === 2
                    ) {

                        message =
                            "No se pudo determinar tu ubicación.";

                    }

                    if (
                        error.code === 3
                    ) {

                        message =
                            "La ubicación tardó demasiado.";

                    }

                    locationStatus.textContent =
                        message;

                    useLocationButton.disabled =
                        false;

                },

                {

                    enableHighAccuracy:
                        true,

                    timeout:
                        15000,

                    maximumAge:
                        0

                }
            );

        }
    );
}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function showBusinesses() {

    businessSection.style.display =
        "block";

    storeSection.style.display =
        "none";

    businessSection.scrollIntoView({
        behavior: "smooth"
    });
}


function showStores() {

    storeSection.style.display =
        "block";

    storeSection.scrollIntoView({
        behavior: "smooth"
    });
}


if (foodButton) {

    foodButton.addEventListener(
        "click",
        showBusinesses
    );
}


if (heroFoodButton) {

    heroFoodButton.addEventListener(
        "click",
        showBusinesses
    );
}