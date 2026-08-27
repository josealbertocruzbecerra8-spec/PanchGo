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

const DELIVERY_COST = 25;

/*
 * Número de WhatsApp que recibirá los pedidos.
 * Formato internacional sin +, espacios ni guiones.
 */
const PANCHGO_WHATSAPP =
    "525629913802";


/* =========================================================
   ESTADO
========================================================= */

let cart = [];

let selectedBusiness = null;

let selectedBusinessData = null;


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
    document.getElementById("cartSection");

const cartItems =
    document.getElementById("cartItems");

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
            "?select=id,name,%22Descripci%C3%B3n%22,%22Active%22" +
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

        /*
         * IMPORTANTE:
         *
         * Ahora sí filtramos Businesses_id.
         *
         * Esto hace que cada negocio solamente
         * muestre sus propios productos.
         */

        const url =
            SUPABASE_URL +
            "/rest/v1/Products" +
            "?select=%22Id%22,name,%22Description%22,%22Price%22,%22Active%22,%22Businesses_id%22" +
            "&Businesses_id=eq." +
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


    /*
     * NO PERMITIR PRODUCTOS DE DIFERENTES NEGOCIOS
     */

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

    cartSection.scrollIntoView({
        behavior: "smooth"
    });
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


    const delivery =
    cart.length > 0
        ? 25
        : 0;


    const total =
        subtotal +
        delivery;


    cartSubtotal.textContent =
        `$${subtotal.toFixed(2)}`;

    deliveryCost.textContent =
        `$${delivery.toFixed(2)}`;

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


/* =========================================================
   BOTÓN CARRITO
========================================================= */

if (cartButton) {

    cartButton.addEventListener(
        "click",
        function () {

            cartSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );
}


/* =========================================================
   CONFIRMAR PEDIDO
========================================================= */

if (sendOrderButton) {

    sendOrderButton.addEventListener(
        "click",
        function () {

            if (
                cart.length === 0
            ) {

                alert(
                    "Agrega al menos un producto."
                );

                return;
            }

            if (
                !customerName.value.trim()
            ) {

                alert(
                    "Escribe tu nombre."
                );

                customerName.focus();

                return;
            }

            if (
                !customerPhone.value.trim()
            ) {

                alert(
                    "Escribe tu teléfono."
                );

                customerPhone.focus();

                return;
            }

            if (
                !customerAddress.value.trim()
            ) {

                alert(
                    "Escribe tu dirección."
                );

                customerAddress.focus();

                return;
            }

            if (
                !paymentMethod.value
            ) {

                alert(
                    "Selecciona una forma de pago."
                );

                paymentMethod.focus();

                return;
            }

            createOrderPreview();

        }
    );
}


/* =========================================================
   RESUMEN DEL PEDIDO
========================================================= */

function createOrderPreview() {

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


    const delivery =
        DELIVERY_COST;


    const total =
        subtotal +
        delivery;


    let productsHTML = "";


    cart.forEach(
        function (item) {

            productsHTML += `

                <p>

                    ${item.quantity}
                    ×
                    ${item.name}

                    —
                    $${(
                        item.price *
                        item.quantity
                    ).toFixed(2)}

                </p>

            `;

        }
    );


    let paymentNotice = "";


    if (
        paymentMethod.value ===
        "Efectivo"
    ) {

        paymentNotice = `

            <div class="order-payment-notice">

                <strong>
                    ⚠️ PAGO EN EFECTIVO
                </strong>

                <p>
                    El cliente deberá entregar
                    el efectivo al repartidor.
                </p>

            </div>

        `;

    }


    if (
        paymentMethod.value ===
        "Transferencia"
    ) {

        paymentNotice = `

            <div class="order-payment-notice">

                <strong>
                    📲 PAGO POR TRANSFERENCIA
                </strong>

                <p>
                    Verificar la transferencia
                    antes de entregar el pedido.
                </p>

            </div>

        `;

    }


    orderPreview.innerHTML = `

        <div class="order-summary">

            <h3>
                ${cart[0].business}
            </h3>

            ${productsHTML}

            <hr>

            <p>
                <strong>
                    Productos:
                </strong>

                $${subtotal.toFixed(2)}
            </p>

            <p>
                <strong>
                    Envío:
                </strong>

                $${delivery.toFixed(2)}
            </p>

            <p>
                <strong>
                    Total:
                </strong>

                $${total.toFixed(2)}
            </p>

            <hr>

            <p>
                <strong>
                    Cliente:
                </strong>

                ${customerName.value}
            </p>

            <p>
                <strong>
                    Teléfono:
                </strong>

                ${customerPhone.value}
            </p>

            <p>
                <strong>
                    Dirección:
                </strong>

                ${customerAddress.value}
            </p>

            <p>
                <strong>
                    Pago:
                </strong>

                ${paymentMethod.value}
            </p>

            ${paymentNotice}

        </div>

    `;


    orderModal.classList.add(
        "active"
    );
}


/* =========================================================
   WHATSAPP
========================================================= */

if (whatsappOrderButton) {

    whatsappOrderButton.addEventListener(
        "click",
        function () {

            if (
                cart.length === 0
            ) {

                return;
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


            const delivery =
                DELIVERY_COST;


            const total =
                subtotal +
                delivery;


            let message =
                "🛵 *NUEVO PEDIDO PANCHGO*\n\n";


            message +=
                "*Negocio:* " +
                cart[0].business +
                "\n\n";


            message +=
                "*Productos:*\n";


            cart.forEach(
                function (item) {

                    message +=
                        item.quantity +
                        " × " +
                        item.name +
                        " - $" +
                        (
                            item.price *
                            item.quantity
                        ).toFixed(2) +
                        "\n";

                }
            );


            message +=
                "\n*Productos:* $" +
                subtotal.toFixed(2);


            message +=
                "\n*Envío:* $" +
                delivery.toFixed(2);


            message +=
                "\n*TOTAL:* $" +
                total.toFixed(2);


            message +=
                "\n\n*Cliente:* " +
                customerName.value.trim();


            message +=
                "\n*Teléfono:* " +
                customerPhone.value.trim();


            message +=
                "\n*Dirección:* " +
                customerAddress.value.trim();


            message +=
                "\n*Forma de pago:* " +
                paymentMethod.value;


            /*
             * ADVERTENCIA ESPECIAL PARA EFECTIVO
             */

            if (
                paymentMethod.value ===
                "Efectivo"
            ) {

                message +=
                    "\n\n⚠️ *IMPORTANTE:* COBRAR AL CLIENTE ANTES DE PAGAR/RECOGER EL PEDIDO.";

            }


            /*
             * INFORMACIÓN PARA TRANSFERENCIA
             */

            if (
                paymentMethod.value ===
                "Transferencia"
            ) {

                message +=
                    "\n\n📲 *IMPORTANTE:* VERIFICAR LA TRANSFERENCIA ANTES DE ENTREGAR EL PEDIDO.";

            }


            message +=
                "\n\n*FLUJO PANCHGO:* Contactar al negocio → preparar pedido → recoger → entregar al cliente.";


            const whatsappURL =
                "https://wa.me/" +
                PANCHGO_WHATSAPP +
                "?text=" +
                encodeURIComponent(
                    message
                );


            console.log(
                "PanchGo WhatsApp:",
                whatsappURL
            );


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );
}


/* =========================================================
   CERRAR MODAL
========================================================= */

if (closeOrderModal) {

    closeOrderModal.addEventListener(
        "click",
        function () {

            orderModal.classList.remove(
                "active"
            );

        }
    );
}


/* =========================================================
   REGISTRAR NEGOCIO
========================================================= */

if (joinBusinessButton) {

    joinBusinessButton.addEventListener(
        "click",
        function () {

            alert(
                "Próximamente podrás registrar tu negocio en PanchGo."
            );

        }
    );
}


/* =========================================================
   INICIO
========================================================= */

updateCart();

loadBusinesses();