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

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");

const foodButton = document.getElementById("foodButton");
const storesButton = document.getElementById("storesButton");
const heroFoodButton = document.getElementById("heroFoodButton");
const heroStoreButton = document.getElementById("heroStoreButton");

const businessSection = document.getElementById("businessSection");
const storeSection = document.getElementById("storeSection");

const productsSection = document.getElementById("productsSection");
const productsBusinessName =
    document.getElementById("productsBusinessName");
const productsBusinessDescription =
    document.getElementById("productsBusinessDescription");

const productGrid = document.getElementById("productGrid");
const cartSection = document.getElementById("cartSection");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const deliveryCost = document.getElementById("deliveryCost");
const cartTotal = document.getElementById("cartTotal");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerAddress = document.getElementById("customerAddress");

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

function showBusinessMessage(title, message, icon = "ℹ️") {
    const list = document.querySelector(".business-list");

    if (!list) return;

    list.innerHTML = `
        <div class="empty-message">
            <span>${icon}</span>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}

function showProductMessage(title, message, icon = "ℹ️") {
    if (!productGrid) return;

    productGrid.innerHTML = `
        <div class="empty-message">
            <span>${icon}</span>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}

async function supabaseFetch(table, params) {
    const url =
        `${SUPABASE_URL}/rest/v1/${table}?${params}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Accept": "application/json"
        }
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(
            `Supabase HTTP ${response.status}: ${text}`
        );
    }

    try {
        return JSON.parse(text);
    } catch {
        throw new Error(
            "Supabase devolvió una respuesta inválida."
        );
    }
}

async function loadBusinesses() {
    showBusinessMessage(
        "Cargando negocios...",
        "Conectando con Supabase.",
        "⏳"
    );

    try {
        const params =
            "select=id,name,%22Descripci%C3%B3n%22,%22Active%22,latitude,longitude" +
            "&%22Active%22=eq.true" +
            "&order=name";

        const data =
            await supabaseFetch(
                "Businesses",
                params
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

function renderBusinesses(businesses) {
    const businessList =
        document.querySelector(".business-list");

    if (!businessList) return;

    businessList.innerHTML = "";

    businesses.forEach(business => {
        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "business-card";

        button.innerHTML = `
            <div class="business-icon">
                🏪
            </div>

            <div class="business-info">
                <h3>
                    ${business.name || "Negocio"}
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
            () => openBusiness(business)
        );

        businessList.appendChild(button);
    });
}

async function openBusiness(business) {
    selectedBusiness = business.id;
    selectedBusinessData = business;

    deliveryDistanceKm = null;
    deliveryFee = 0;
    deliveryQuoteRequired = false;

    if (productsBusinessName) {
        productsBusinessName.textContent =
            business.name || "Negocio";
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

    await loadProducts(business.id);
}

async function loadProducts(businessId) {
    try {
        const params =
            "select=%22Id%22,name,%22Description%22,%22Price%22,%22Active%22,%22Businesses_id%22" +
            "&%22Businesses_id%22=eq." +
            encodeURIComponent(businessId) +
            "&%22Active%22=eq.true" +
            "&order=name";

        const data =
            await supabaseFetch(
                "Products",
                params
            );

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

function renderProducts(products) {
    if (!productGrid) return;

    productGrid.innerHTML = "";

    products.forEach(product => {
        const card =
            document.createElement("div");

        card.className = "product-card";

        const name =
            product.name || "Producto";

        const description =
            product["Description"] || "";

        const price =
            Number(product["Price"] || 0);

        card.innerHTML = `
            <div class="product-info">
                <h3>${name}</h3>

                <p>${description}</p>

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
            () => addToCart(product)
        );

        productGrid.appendChild(card);
    });
}

function addToCart(product) {
    const businessId =
        product["Businesses_id"] ||
        selectedBusiness;

    if (cart.length > 0) {
        if (
            String(cart[0].businessId) !==
            String(businessId)
        ) {
            alert(
                "Tu carrito contiene productos de otro negocio."
            );
            return;
        }
    }

    const id = product["Id"];

    const existing =
        cart.find(
            item =>
                String(item.id) === String(id)
        );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: id,
            name: product.name,
            price: Number(product["Price"] || 0),
            quantity: 1,
            business:
                selectedBusinessData?.name ||
                "Negocio",
            businessId: businessId
        });
    }

    updateCart();
}

function changeQuantity(id, action) {
    const item =
        cart.find(
            product =>
                String(product.id) === String(id)
        );

    if (!item) return;

    if (action === "plus") {
        item.quantity++;
    }

    if (action === "minus") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart =
                cart.filter(
                    product =>
                        String(product.id) !==
                        String(id)
                );
        }
    }

    updateCart();
}

function updateCart() {
    if (cartCount) {
        cartCount.textContent =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );
    }

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    🛒
                    <h3>Tu carrito está vacío</h3>
                    <p>
                        Agrega productos de un negocio
                        para comenzar tu pedido.
                    </p>
                </div>
            `;
        } else {
            cartItems.innerHTML = "";

            cart.forEach(item => {
                const element =
                    document.createElement("div");

                element.className = "cart-item";

                element.innerHTML = `
                    <div>
                        <strong>${item.name}</strong>
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

                cartItems.appendChild(element);
            });

            document
                .querySelectorAll(".quantity-button")
                .forEach(button => {
                    button.addEventListener(
                        "click",
                        () =>
                            changeQuantity(
                                button.dataset.id,
                                button.dataset.action
                            )
                    );
                });
        }
    }

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price * item.quantity,
            0
        );

    if (cartSubtotal) {
        cartSubtotal.textContent =
            `$${subtotal.toFixed(2)}`;
    }

    if (cart.length === 0) {
        if (deliveryCost) {
            deliveryCost.textContent = "$0.00";
        }

        if (cartTotal) {
            cartTotal.textContent = "$0.00";
        }

        return;
    }

    if (deliveryQuoteRequired) {
        if (deliveryCost) {
            deliveryCost.textContent = "Cotizar";
        }

        if (cartTotal) {
            cartTotal.textContent = "Cotizar";
        }

        return;
    }

    if (deliveryDistanceKm === null) {
        if (deliveryCost) {
            deliveryCost.textContent = "Calculando";
        }

        if (cartTotal) {
            cartTotal.textContent = "Calculando";
        }

        return;
    }

    if (deliveryCost) {
        deliveryCost.textContent =
            `$${deliveryFee.toFixed(2)}`;
    }

    if (cartTotal) {
        cartTotal.textContent =
            `$${(subtotal + deliveryFee).toFixed(2)}`;
    }
}

async function calculateRoute() {
    if (!selectedBusinessData) {
        throw new Error(
            "Primero selecciona un negocio."
        );
    }

    if (!customerLocation) {
        throw new Error(
            "Primero debes usar tu ubicación."
        );
    }

    const start = [
        Number(selectedBusinessData.longitude),
        Number(selectedBusinessData.latitude)
    ];

    const end = [
        Number(customerLocation.longitude),
        Number(customerLocation.latitude)
    ];

    const response =
        await fetch("/api/route", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                start,
                end
            })
        });

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "No se pudo calcular la ruta."
        );
    }

    deliveryDistanceKm =
        Number(data.distanceKm);

    const fee =
        calculateDeliveryFee(
            deliveryDistanceKm
        );

    if (fee === null) {
        deliveryFee = 0;
        deliveryQuoteRequired = true;
    } else {
        deliveryFee = fee;
        deliveryQuoteRequired = false;
    }

    updateCart();
}

if (useLocationButton) {
    useLocationButton.addEventListener(
        "click",
        () => {
            if (!selectedBusinessData) {
                if (locationStatus) {
                    locationStatus.textContent =
                        "Primero selecciona un negocio.";
                }
                return;
            }

            if (!navigator.geolocation) {
                if (locationStatus) {
                    locationStatus.textContent =
                        "Tu dispositivo no permite obtener la ubicación.";
                }
                return;
            }

            if (locationStatus) {
                locationStatus.textContent =
                    "Obteniendo tu ubicación...";
            }

            useLocationButton.disabled = true;

            navigator.geolocation.getCurrentPosition(
                async position => {
                    customerLocation = {
                        latitude:
                            position.coords.latitude,
                        longitude:
                            position.coords.longitude
                    };

                    try {
                        if (locationStatus) {
                            locationStatus.textContent =
                                "Calculando distancia de entrega...";
                        }

                        await calculateRoute();

                        if (locationStatus) {
                            if (deliveryQuoteRequired) {
                                locationStatus.textContent =
                                    "Distancia mayor a 30 km. Envío por cotizar.";
                            } else {
                                locationStatus.textContent =
                                    `Distancia: ${deliveryDistanceKm.toFixed(2)} km · Envío: $${deliveryFee.toFixed(2)}`;
                            }
                        }

                    } catch (error) {
                        console.error(
                            "PanchGo ERROR RUTA:",
                            error
                        );

                        if (locationStatus) {
                            locationStatus.textContent =
                                error.message;
                        }

                    } finally {
                        useLocationButton.disabled = false;
                    }
                },

                error => {
                    let message =
                        "No se pudo obtener tu ubicación.";

                    if (error.code === 1) {
                        message =
                            "Permiso de ubicación denegado.";
                    }

                    if (error.code === 2) {
                        message =
                            "No se pudo determinar tu ubicación.";
                    }

                    if (error.code === 3) {
                        message =
                            "La ubicación tardó demasiado.";
                    }

                    if (locationStatus) {
                        locationStatus.textContent =
                            message;
                    }

                    useLocationButton.disabled = false;
                },

                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        }
    );
}

function showBusinesses() {
    if (businessSection) {
        businessSection.style.display = "block";

        businessSection.scrollIntoView({
            behavior: "smooth"
        });
    }

    if (storeSection) {
        storeSection.style.display = "none";
    }
}

function showStores() {
    if (storeSection) {
        storeSection.style.display = "block";

        storeSection.scrollIntoView({
            behavior: "smooth"
        });
    }
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

if (storesButton) {
    storesButton.addEventListener(
        "click",
        showStores
    );
}

if (heroStoreButton) {
    heroStoreButton.addEventListener(
        "click",
        showStores
    );
}

if (cartButton) {
    cartButton.addEventListener(
        "click",
        () => {
            if (cartSection) {
                cartSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    );
}

if (sendOrderButton) {
    sendOrderButton.addEventListener(
        "click",
        async () => {
            if (cart.length === 0) {
                alert(
                    "Agrega al menos un producto."
                );
                return;
            }

            if (!customerName.value.trim()) {
                alert("Escribe tu nombre.");
                return;
            }

            if (!customerPhone.value.trim()) {
                alert("Escribe tu teléfono.");
                return;
            }

            if (!customerAddress.value.trim()) {
                alert("Escribe tu dirección.");
                return;
            }

            if (!customerLocation) {
                alert(
                    "Usa el botón «Usar mi ubicación» para calcular el envío."
                );
                return;
            }

            if (deliveryDistanceKm === null) {
                try {
                    await calculateRoute();
                } catch (error) {
                    alert(error.message);
                    return;
                }
            }

            if (!paymentMethod.value) {
                alert(
                    "Selecciona una forma de pago."
                );
                return;
            }

            createOrderPreview();
        }
    );
}

function createOrderPreview() {
    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price * item.quantity,
            0
        );

    const deliveryText =
        deliveryQuoteRequired
            ? "Cotizar"
            : `$${deliveryFee.toFixed(2)}`;

    const totalText =
        deliveryQuoteRequired
            ? "Cotizar"
            : `$${(
                subtotal +
                deliveryFee
            ).toFixed(2)}`;

    let productsHTML = "";

    cart.forEach(item => {
        productsHTML += `
            <p>
                ${item.quantity} × ${item.name}
                — $${(
                    item.price *
                    item.quantity
                ).toFixed(2)}
            </p>
        `;
    });

    if (!orderPreview) return;

    orderPreview.innerHTML = `
        <div class="order-summary">

            <h3>
                ${cart[0].business}
            </h3>

            ${productsHTML}

            <hr>

            <p>
                <strong>Productos:</strong>
                $${subtotal.toFixed(2)}
            </p>

            <p>
                <strong>Distancia:</strong>
                ${deliveryDistanceKm.toFixed(2)} km
            </p>

            <p>
                <strong>Envío:</strong>
                ${deliveryText}
            </p>

            <p>
                <strong>Total:</strong>
                ${totalText}
            </p>

            <hr>

            <p>
                <strong>Cliente:</strong>
                ${customerName.value}
            </p>

            <p>
                <strong>Teléfono:</strong>
                ${customerPhone.value}
            </p>

            <p>
                <strong>Dirección:</strong>
                ${customerAddress.value}
            </p>

            <p>
                <strong>Pago:</strong>
                ${paymentMethod.value}
            </p>

        </div>
    `;

    if (orderModal) {
        orderModal.classList.add("active");
    }
}

if (whatsappOrderButton) {
    whatsappOrderButton.addEventListener(
        "click",
        () => {
            const subtotal =
                cart.reduce(
                    (total, item) =>
                        total +
                        item.price *
                        item.quantity,
                    0
                );

            const deliveryText =
                deliveryQuoteRequired
                    ? "Cotizar"
                    : `$${deliveryFee.toFixed(2)}`;

            const totalText =
                deliveryQuoteRequired
                    ? "Cotizar"
                    : `$${(
                        subtotal +
                        deliveryFee
                    ).toFixed(2)}`;

            let message =
                "🛵 *NUEVO PEDIDO PANCHGO*\n\n";

            message +=
                "*Negocio:* " +
                cart[0].business +
                "\n\n";

            message += "*Productos:*\n";

            cart.forEach(item => {
                message +=
                    `${item.quantity} × ${item.name} - $${(
                        item.price *
                        item.quantity
                    ).toFixed(2)}\n`;
            });

            message +=
                `\n*Productos:* $${subtotal.toFixed(2)}`;

            message +=
                `\n*Distancia:* ${deliveryDistanceKm.toFixed(2)} km`;

            message +=
                `\n*Envío:* ${deliveryText}`;

            message +=
                `\n*TOTAL:* ${totalText}`;

            message +=
                `\n\n*Cliente:* ${customerName.value.trim()}`;

            message +=
                `\n*Teléfono:* ${customerPhone.value.trim()}`;

            message +=
                `\n*Dirección:* ${customerAddress.value.trim()}`;

            message +=
                `\n*Forma de pago:* ${paymentMethod.value}`;

            if (customerLocation) {
                message +=
                    `\n*Ubicación GPS:* https://www.google.com/maps?q=${customerLocation.latitude},${customerLocation.longitude}`;
            }

            if (deliveryQuoteRequired) {
                message +=
                    "\n\n⚠️ *IMPORTANTE:* EL ENVÍO ES MAYOR A 30 KM Y REQUIERE COTIZACIÓN.";
            }

            const whatsappURL =
                "https://wa.me/" +
                PANCHGO_WHATSAPP +
                "?text=" +
                encodeURIComponent(message);

            window.open(
                whatsappURL,
                "_blank"
            );
        }
    );
}

if (closeOrderModal) {
    closeOrderModal.addEventListener(
        "click",
        () => {
            if (orderModal) {
                orderModal.classList.remove(
                    "active"
                );
            }
        }
    );
}

if (joinBusinessButton) {
    joinBusinessButton.addEventListener(
        "click",
        () => {
            alert(
                "Próximamente podrás registrar tu negocio en PanchGo."
            );
        }
    );
}

updateCart();
loadBusinesses();