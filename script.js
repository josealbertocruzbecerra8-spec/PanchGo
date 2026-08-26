/* =========================================================
   PANCHGO
   SCRIPT COMPLETO + SUPABASE
   CORRECCIÓN: TABLA "Businesses" USA COLUMNA "ID"
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://vciekecvbqvlbavxhmfz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_1wRntDky8YlSGLmynI8O5Q_lNSbWMbu";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


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
            "No se encontró .business-list"
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
            "Conectando con Supabase..."
        );

        /*
         * IMPORTANTE:
         * La tabla Businesses tiene:
         *
         * ID          UUID
         * name        text
         * description text
         * active      boolean
         *
         * Por eso seleccionamos explícitamente
         * "ID" y no "id".
         */

        const {
            data,
            error
        } =
            await supabaseClient
                .from("Businesses")
                .select('"ID",name,description,active')
                .eq("active", true)
                .order("name");


        if (error) {

            console.error(
                "ERROR SUPABASE BUSINESSES:",
                error
            );

            throw error;
        }


        console.log(
            "NEGOCIOS RECIBIDOS:",
            data
        );


        renderBusinesses(
            data || []
        );


    } catch (error) {

        console.error(
            "ERROR AL CARGAR NEGOCIOS:",
            error
        );


        businessList.innerHTML = `
            <div class="empty-message">

                <span>⚠️</span>

                <h3>
                    Error al cargar negocios.
                </h3>

                <p>
                    ${error.message || "Error desconocido."}
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


    if (
        !businesses ||
        businesses.length === 0
    ) {

        businessList.innerHTML = `
            <div class="empty-message">

                <span>🏪</span>

                <h3>
                    No hay negocios disponibles.
                </h3>

                <p>
                    La conexión con Supabase funciona,
                    pero la consulta no encontró negocios activos.
                </p>

            </div>
        `;

        return;
    }


    businesses.forEach(
        function (business) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "business-card";


            /*
             * LA COLUMNA REAL ES "ID"
             */

            button.dataset.businessId =
                business.ID;


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
                            business.description ||
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
        business.ID;


    selectedBusinessData =
        business;


    productsBusinessName.textContent =
        business.name ||
        "Negocio";


    productsBusinessDescription.textContent =
        business.description ||
        "Productos disponibles";


    productGrid.innerHTML = `

        <p>
            Cargando productos...
        </p>

    `;


    productsSection.scrollIntoView({
        behavior: "smooth"
    });


    await loadProducts(
        business.ID
    );
}


/* =========================================================
   CARGAR PRODUCTOS
========================================================= */

async function loadProducts(
    businessId
) {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("Products")
                .select("*")
                .eq(
                    "Businesses_id",
                    businessId
                )
                .eq(
                    "Active",
                    true
                )
                .order("name");


        if (error) {

            console.error(
                "ERROR PRODUCTS:",
                error
            );

            throw error;
        }


        console.log(
            "PRODUCTOS RECIBIDOS:",
            data
        );


        renderProducts(
            data || []
        );


    } catch (error) {

        console.error(
            "No se pudieron cargar los productos:",
            error
        );


        productGrid.innerHTML = `

            <div class="empty-message">

                <span>⚠️</span>

                <h3>
                    No pudimos cargar los productos.
                </h3>

                <p>
                    ${error.message || "Error desconocido."}
                </p>

            </div>

        `;
    }
}


/* =========================================================
   MOSTRAR PRODUCTOS
========================================================= */

function renderProducts(
    products
) {

    productGrid.innerHTML = "";


    if (
        !products ||
        products.length === 0
    ) {

        productGrid.innerHTML = `

            <div class="empty-message">

                <span>🍽️</span>

                <h3>
                    Este negocio todavía no tiene productos.
                </h3>

                <p>
                    Próximamente habrá productos disponibles.
                </p>

            </div>

        `;

        return;
    }


    products.forEach(
        function (product) {

            const productCard =
                document.createElement(
                    "div"
                );


            productCard.className =
                "product-card";


            const productId =
                product.Id ||
                product.ID ||
                product.id;


            const productName =
                product.name ||
                product.Name ||
                "Producto";


            const productDescription =
                product.Description ||
                product.description ||
                "";


            const productPrice =
                Number(
                    product.Price ||
                    product.price ||
                    0
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
   OBTENER ID DEL PRODUCTO
========================================================= */

function getProductId(
    product
) {

    return (
        product.Id ||
        product.ID ||
        product.id
    );
}


/* =========================================================
   CARRITO
========================================================= */

function addToCart(
    product
) {

    const productId =
        getProductId(
            product
        );


    if (!productId) {

        alert(
            "Este producto no tiene un ID válido."
        );

        console.error(
            "Producto sin ID:",
            product
        );

        return;
    }


    if (!selectedBusinessData) {

        return;
    }


    const existingProduct =
        cart.find(
            function (item) {

                return (
                    item.id ===
                    productId
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
                product.name ||
                product.Name ||
                "Producto",

            price:
                Number(
                    product.Price ||
                    product.price ||
                    0
                ),

            quantity:
                1,

            business:
                selectedBusinessData.name,

            businessId:
                selectedBusinessData.ID

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
                    function (
                        product
                    ) {

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
   BOTÓN CARRITO
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

        </div>

    `;


    orderModal.classList.add(
        "active"
    );
}


/* =========================================================
   WHATSAPP
========================================================= */

whatsappOrderButton.addEventListener(
    "click",
    function () {

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
            customerName.value;


        message +=
            "\n*Teléfono:* " +
            customerPhone.value;


        message +=
            "\n*Dirección:* " +
            customerAddress.value;


        message +=
            "\n*Forma de pago:* " +
            paymentMethod.value;


        /*
         * CAMBIAR POR EL WHATSAPP REAL DE PANCHGO
         * CUANDO LO TENGAMOS.
         */

        const whatsappNumber =
            "5210000000000";


        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(
                message
            );


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);


/* =========================================================
   CERRAR MODAL
========================================================= */

closeOrderModal.addEventListener(
    "click",
    function () {

        orderModal.classList.remove(
            "active"
        );

    }
);


/* =========================================================
   NEGOCIOS
========================================================= */

joinBusinessButton.addEventListener(
    "click",
    function () {

        alert(
            "Próximamente podrás registrar tu negocio en PanchGo."
        );

    }
);


/* =========================================================
   INICIO
========================================================= */

updateCart();

loadBusinesses();