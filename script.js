const SUPABASE_URL =
    "https://vciekecvbqvlbavxhmfz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_1wRntDky8YlSGLmynI8O5Q_lNSbWMbu";


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
    document.getElementById("productsBusinessName");

const productsBusinessDescription =
    document.getElementById("productsBusinessDescription");

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


/* =========================================================
   CARGAR NEGOCIOS
========================================================= */

async function loadBusinesses() {

    const businessList =
        document.querySelector(".business-list");


    if (!businessList) {

        console.error(
            "PanchGo: no existe .business-list"
        );

        return;
    }


    businessList.innerHTML = `
        <div class="empty-message">
            <span>⏳</span>
            <h3>Cargando negocios...</h3>
            <p>Conectando con PanchGo.</p>
        </div>
    `;


    try {

        console.log(
            "PanchGo: iniciando consulta REST..."
        );


        const response =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/Businesses?select=name,%22Descripci%C3%B3n%22,%22Active%22&%22Active%22=eq.true&order=name",
                {
                    method: "GET",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            "Bearer " +
                            SUPABASE_KEY,
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        console.log(
            "PanchGo: respuesta HTTP:",
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            "PanchGo: respuesta Supabase:",
            responseText
        );


        if (!response.ok) {

            throw new Error(
                "Supabase HTTP " +
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

        } catch (jsonError) {

            throw new Error(
                "Supabase respondió algo que no es JSON: " +
                responseText
            );

        }


        console.log(
            "PanchGo: negocios:",
            data
        );


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            businessList.innerHTML = `
                <div class="empty-message">

                    <span>🏪</span>

                    <h3>
                        No hay negocios disponibles.
                    </h3>

                    <p>
                        Supabase respondió correctamente,
                        pero no devolvió negocios activos.
                    </p>

                </div>
            `;

            return;
        }


        renderBusinesses(data);


    } catch (error) {

        console.error(
            "PanchGo ERROR BUSINESSES:",
            error
        );


        businessList.innerHTML = `
            <div class="empty-message">

                <span>⚠️</span>

                <h3>
                    Error al cargar negocios.
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

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


            button.businessData =
                business;


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
        business.name;

    selectedBusinessData =
        business;


    productsBusinessName.textContent =
        business.name ||
        "Negocio";


    productsBusinessDescription.textContent =
        business["Descripción"] ||
        "Productos disponibles";


    productGrid.innerHTML = `
        <div class="empty-message">

            <span>⏳</span>

            <h3>
                Cargando productos...
            </h3>

            <p>
                Buscando productos.
            </p>

        </div>
    `;


    productsSection.scrollIntoView({
        behavior: "smooth"
    });


    /*
       Todavía no modificamos la consulta de productos.
       Primero necesitamos conseguir que los negocios
       aparezcan correctamente.
    */

    await loadProducts(
        business
    );

}


/* =========================================================
   PRODUCTOS
========================================================= */

async function loadProducts(
    business
) {

    productGrid.innerHTML = `
        <div class="empty-message">

            <span>🍽️</span>

            <h3>
                Productos próximamente.
            </h3>

            <p>
                Primero estamos terminando
                la conexión de productos.
            </p>

        </div>
    `;

}


/* =========================================================
   CARRITO
========================================================= */

function addToCart(
    product,
    productId,
    productName,
    productPrice
) {

    const existingProduct =
        cart.find(
            function (item) {

                return (
                    String(item.id) ===
                    String(productId)
                );

            }
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id:
                productId,

            name:
                productName,

            price:
                productPrice,

            quantity:
                1,

            business:
                selectedBusinessData
                    ? selectedBusinessData.name
                    : "Negocio",

            businessId:
                null

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


                    <div
                        class="cart-item-controls"
                    >

                        <button
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
                            class="quantity-button"
                            data-id="${item.id}"
                            data-action="plus"
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
            ? 20
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
   CANTIDAD
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


foodButton.addEventListener(
    "click",
    showBusinesses
);

heroFoodButton.addEventListener(
    "click",
    showBusinesses
);

storesButton.addEventListener(
    "click",
    showStores
);

heroStoreButton.addEventListener(
    "click",
    showStores
);


/* =========================================================
   CARRITO
========================================================= */

cartButton.addEventListener(
    "click",
    function () {

        cartSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =========================================================
   CONFIRMAR PEDIDO
========================================================= */

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


/* =========================================================
   RESUMEN
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
        cart.length > 0
            ? 20
            : 0;


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


    orderPreview.inner