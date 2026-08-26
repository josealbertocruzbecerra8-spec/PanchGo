/* =========================================================
   PANCHGO — CONEXIÓN SUPABASE
========================================================= */

const SUPABASE_URL = "https://vciekecvbqvlbavxhmfz.supabase.co/rest/v1/";

const SUPABASE_KEY = "sb_publishable_1wRntDky8YlSGLmynI8O5Q_lNSbWMbu";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   VARIABLES
========================================================= */

let cart = [];

let selectedBusiness = null;

let businesses = {};


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

const businessList =
    document.getElementById("businessList");

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
   CARGAR NEGOCIOS DESDE SUPABASE
========================================================= */

async function loadBusinesses() {

    businessList.innerHTML = `
        <div class="empty-message">
            <span>⏳</span>
            <h3>Cargando negocios...</h3>
            <p>
                Estamos buscando los negocios disponibles.
            </p>
        </div>
    `;


    const {
        data,
        error
    } = await supabaseClient
        .from("Businesses")
        .select("*")
        .eq("Active", true);


    if (error) {

        console.error(
            "Error cargando Businesses:",
            error
        );

        businessList.innerHTML = `
            <div class="empty-message">
                <span>⚠️</span>

                <h3>
                    No pudimos cargar los negocios.
                </h3>

                <p>
                    Revisa la conexión con Supabase.
                </p>
            </div>
        `;

        return;
    }


    if (!data || data.length === 0) {

        businessList.innerHTML = `
            <div class="empty-message">

                <span>🏪</span>

                <h3>
                    Todavía no hay negocios.
                </h3>

                <p>
                    Pronto aparecerán negocios locales.
                </p>

            </div>
        `;

        return;
    }


    businessList.innerHTML = "";

    businesses = {};


    data.forEach(function (business) {

        const key =
            String(
                business.id
            );


        businesses[key] = {

            id: business.id,

            name:
                business.name ||
                "Negocio",

            description:
                business.description ||
                "Negocio local",

            products: []

        };


        const button =
            document.createElement("button");


        button.className =
            "business-card";


        button.setAttribute(
            "data-business-id",
            business.id
        );


        const icon =
            getBusinessIcon(
                business.name
            );


        button.innerHTML = `

            <div class="business-icon">
                ${icon}
            </div>

            <div class="business-info">

                <h3>
                    ${escapeHTML(
                        business.name ||
                        "Negocio"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        business.description ||
                        "Negocio local"
                    )}
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
                    business.id
                );

            }
        );


        businessList.appendChild(
            button
        );

    });

}


/* =========================================================
   ICONO DEL NEGOCIO
========================================================= */

function getBusinessIcon(name) {

    const text =
        String(name || "")
            .toLowerCase();


    if (
        text.includes("birria") ||
        text.includes("taco") ||
        text.includes("comida")
    ) {

        return "🌮";

    }


    if (
        text.includes("choco") ||
        text.includes("elote") ||
        text.includes("bebida")
    ) {

        return "🥤";

    }


    if (
        text.includes("tienda") ||
        text.includes("abarrotes")
    ) {

        return "🛍️";

    }


    return "🏪";
}


/* =========================================================
   ABRIR NEGOCIO
========================================================= */

async function openBusiness(
    businessId
) {

    const business =
        businesses[
            String(businessId)
        ];


    if (!business) {
        return;
    }


    selectedBusiness =
        businessId;


    productsBusinessName.textContent =
        business.name;


    productsBusinessDescription.textContent =
        business.description;


    productGrid.innerHTML = `

        <div class="empty-message">

            <span>⏳</span>

            <h3>
                Cargando productos...
            </h3>

        </div>

    `;


    productsSection.scrollIntoView({
        behavior: "smooth"
    });


    const {
        data,
        error
    } = await supabaseClient
        .from("Products")
        .select(
            'Id, Businesses_id, name, "Description", "Price", "Active"'
        )
        .eq(
            "Businesses_id",
            businessId
        )
        .eq(
            "Active",
            true
        );


    if (error) {

        console.error(
            "Error cargando Products:",
            error
        );


        productGrid.innerHTML = `

            <div class="empty-message">

                <span>⚠️</span>

                <h3>
                    No se pudieron cargar los productos.
                </h3>

                <p>
                    Revisa la conexión con Supabase.
                </p>

            </div>

        `;

        return;
    }


    business.products =
        data || [];


    renderProducts(
        business.products
    );
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
                    Pronto habrá productos disponibles.
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


            const price =
                Number(
                    product.Price || 0
                );


            productCard.innerHTML = `

                <div class="product-info">

                    <h3>
                        ${escapeHTML(
                            product.name ||
                            "Producto"
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            product.Description ||
                            ""
                        )}
                    </p>

                    <strong>
                        $${price.toFixed(2)}
                    </strong>

                </div>


                <button
                    class="primary-button add-product-button"
                    data-product-id="${product.Id}"
                >
                    Agregar
                </button>

            `;


            productGrid.appendChild(
                productCard
            );

        }
    );


    document
        .querySelectorAll(
            ".add-product-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            button.getAttribute(
                                "data-product-id"
                            );


                        addToCart(
                            productId
                        );

                    }
                );

            }
        );
}


/* =========================================================
   AGREGAR AL CARRITO
========================================================= */

function addToCart(
    productId
) {

    const business =
        businesses[
            String(selectedBusiness)
        ];


    if (!business) {
        return;
    }


    const product =
        business.products.find(
            function (item) {

                return String(
                    item.Id
                ) === String(
                    productId
                );

            }
        );


    if (!product) {
        return;
    }


    const existingProduct =
        cart.find(
            function (item) {

                return String(
                    item.id
                ) === String(
                    product.Id
                );

            }
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: product.Id,

            name:
                product.name,

            price:
                Number(
                    product.Price || 0
                ),

            quantity: 1,

            business:
                business.name,

            businessId:
                business.id

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

                return total +
                    item.quantity;

            },
            0
        );


    cartCount.textContent =
        count;


    if (cart.length === 0) {

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
                            ${escapeHTML(
                                item.name
                            )}
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

                            const id =
                                button.getAttribute(
                                    "data-id"
                                );


                            const action =
                                button.getAttribute(
                                    "data-action"
                                );


                            changeQuantity(
                                id,
                                action
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

                return total +
                    (
                        item.price *
                        item.quantity
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

                return String(
                    product.id
                ) === String(id);

            }
        );


    if (!item) {
        return;
    }


    if (action === "plus") {

        item.quantity += 1;

    }


    if (action === "minus") {

        item.quantity -= 1;


        if (
            item.quantity <= 0
        ) {

            cart =
                cart.filter(
                    function (product) {

                        return String(
                            product.id
                        ) !== String(id);

                    }
                );

        }

    }


    updateCart();
}


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
    async function () {

        if (cart.length === 0) {

            alert(
                "Agrega al menos un producto a tu carrito."
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
                "Escribe tu dirección de entrega."
            );

            customerAddress.focus();

            return;
        }


        if (!paymentMethod.value) {

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
        calculateSubtotal();


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
                    ${escapeHTML(item.name)}
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
                ${escapeHTML(
                    cart[0].business
                )}
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

                ${escapeHTML(
                    customerName.value
                )}
            </p>

            <p>
                <strong>
                    Teléfono:
                </strong>

                ${escapeHTML(
                    customerPhone.value
                )}
            </p>

            <p>
                <strong>
                    Dirección:
                </strong>

                ${escapeHTML(
                    customerAddress.value
                )}
            </p>

            <p>
                <strong>
                    Pago:
                </strong>

                ${escapeHTML(
                    paymentMethod.value
                )}
            </p>

        </div>

    `;


    orderModal.classList.add(
        "active"
    );
}


/* =========================================================
   GUARDAR PEDIDO EN SUPABASE
========================================================= */

async function saveOrderToSupabase() {

    if (cart.length === 0) {

        throw new Error(
            "El carrito está vacío."
        );

    }


    const businessId =
        cart[0].businessId;


    const subtotal =
        calculateSubtotal();


    const deliveryFee =
        20;


    const total =
        subtotal +
        deliveryFee;


    /* -----------------------------------------
       1. BUSCAR CLIENTE
    ----------------------------------------- */

    let customerId = null;


    const {
        data: existingCustomer,
        error: customerSearchError
    } = await supabaseClient
        .from("Customers")
        .select("id")
        .eq(
            "phone",
            customerPhone.value.trim()
        )
        .limit(1);


    if (customerSearchError) {

        console.error(
            customerSearchError
        );

        throw new Error(
            "No se pudo consultar el cliente."
        );

    }


    if (
        existingCustomer &&
        existingCustomer.length > 0
    ) {

        customerId =
            existingCustomer[0].id;

    } else {

        /* -----------------------------------------
           2. CREAR CLIENTE
        ----------------------------------------- */

        const {
            data: newCustomer,
            error: customerInsertError
        } = await supabaseClient
            .from("Customers")
            .insert({

                name:
                    customerName.value.trim(),

                phone:
                    customerPhone.value.trim(),

                address:
                    customerAddress.value.trim()

            })
            .select("id")
            .single();


        if (customerInsertError) {

            console.error(
                customerInsertError
            );

            throw new Error(
                "No se pudo guardar el cliente."
            );

        }


        customerId =
            newCustomer.id;

    }


    /* -----------------------------------------
       3. CREAR ORDER
    ----------------------------------------- */

    const {
        data: newOrder,
        error: orderError
    } = await supabaseClient
        .from("Orders")
        .insert({

            Businesses_id:
                businessId,

            Customers_id:
                customerId,

            status:
                "pending",

            delivery_fee:
                deliveryFee,

            total:
                total,

            payment_method:
                paymentMethod.value

        })
        .select("id")
        .single();


    if (orderError) {

        console.error(
            orderError
        );

        throw new Error(
            "No se pudo guardar el pedido."
        );

    }


    const orderId =
        newOrder.id;


    /* -----------------------------------------
       4. CREAR ORDER ITEMS
    ----------------------------------------- */

    const orderItems =
        cart.map(
            function (item) {

                return {

                    Order_id:
                        orderId,

                    Product_id:
                        item.id,

                    Quantity:
                        item.quantity,

                    Unit_price:
                        item.price

                };

            }
        );


    const {
        error: itemsError
    } = await supabaseClient
        .from("Order_items")
        .insert(
            orderItems
        );


    if (itemsError) {

        console.error(
            itemsError
        );

        throw new Error(
            "El pedido se creó, pero no se pudieron guardar sus productos."
        );

    }


    return orderId;
}


/* =========================================================
   BOTÓN WHATSAPP
========================================================= */

whatsappOrderButton.addEventListener(
    "click",
    async function () {

        try {

            whatsappOrderButton.disabled =
                true;


            whatsappOrderButton.textContent =
                "Guardando pedido...";


            const orderId =
                await saveOrderToSupabase();


            const subtotal =
                calculateSubtotal();


            const delivery =
                cart.length > 0
                    ? 20
                    : 0;


            const total =
                subtotal +
                delivery;


            let message =
                "🛵 *NUEVO PEDIDO PANCHGO*%0A%0A";


            message +=
                "*Pedido:* " +
                orderId +
                "%0A%0A";


            message +=
                "*Negocio:* " +
                cart[0].business +
                "%0A%0A";


            message +=
                "*Productos:*%0A";


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
                        "%0A";

                }
            );


            message +=
                "%0A*Productos:* $" +
                subtotal.toFixed(2);


            message +=
                "%0A*Envío:* $" +
                delivery.toFixed(2);


            message +=
                "%0A*TOTAL:* $" +
                total.toFixed(2);


            message +=
                "%0A%0A*Cliente:* " +
                customerName.value;


            message +=
                "%0A*Teléfono:* " +
                customerPhone.value;


            message +=
                "%0A*Dirección:* " +
                customerAddress.value;


            message +=
                "%0A*Forma de pago:* " +
                paymentMethod.value;


            /*
                CAMBIAR MÁS ADELANTE
                POR EL WHATSAPP REAL DE PANCHGO.
            */

            const whatsappNumber =
                "5210000000000";


            const whatsappURL =
                "https://wa.me/" +
                whatsappNumber +
                "?text=" +
                message;


            window.open(
                whatsappURL,
                "_blank"
            );


            alert(
                "¡Pedido guardado correctamente en PanchGo!"
            );


        } catch (error) {

            console.error(
                "Error guardando pedido:",
                error
            );


            alert(
                error.message ||
                "No se pudo guardar el pedido."
            );


        } finally {

            whatsappOrderButton.disabled =
                false;

            whatsappOrderButton.textContent =
                "📲 Enviar pedido";

        }

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
   CONTACTO NEGOCIOS
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
   FUNCIONES AUXILIARES
========================================================= */

function calculateSubtotal() {

    return cart.reduce(
        function (
            total,
            item
        ) {

            return total +
                (
                    item.price *
                    item.quantity
                );

        },
        0
    );
}


function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   INICIO
========================================================= */

async function initPanchGo() {

    if (
        SUPABASE_URL.includes(
            "PEGA_AQUI"
        ) ||
        SUPABASE_KEY.includes(
            "PEGA_AQUI"
        )
    ) {

        console.warn(
            "PanchGo: todavía falta colocar la URL y la CB_publishable de Supabase."
        );

        businessList.innerHTML = `

            <div class="empty-message">

                <span>🔑</span>

                <h3>
                    Falta configurar Supabase.
                </h3>

                <p>
                    Coloca la URL y la clave pública
                    en script.js.
                </p>

            </div>

        `;

        updateCart();

        return;
    }


    await loadBusinesses();

    updateCart();
}


initPanchGo();