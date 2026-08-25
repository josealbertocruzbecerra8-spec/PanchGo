let cart = [];
let selectedBusiness = null;

const businesses = {
    birria: {
        name: "BirriaHome",
        description: "Birria y comida • San Francisco del Rincón",
        products: [
            {
                id: "birria-1",
                name: "Birria",
                description: "Producto de prueba",
                price: 100
            },
            {
                id: "birria-2",
                name: "Consomé",
                description: "Producto de prueba",
                price: 50
            }
        ]
    },

    chocomiles: {
        name: "Chocomiles",
        description: "Chocomiles y elotes • San Francisco del Rincón",
        products: [
            {
                id: "choco-1",
                name: "Chocomil",
                description: "Producto de prueba",
                price: 60
            },
            {
                id: "choco-2",
                name: "Elote",
                description: "Producto de prueba",
                price: 40
            }
        ]
    },

    negocio3: {
        name: "Nuevo negocio",
        description: "Próximamente",
        products: [
            {
                id: "demo-1",
                name: "Producto de prueba",
                description: "Próximamente disponible",
                price: 50
            }
        ]
    }
};


/* =========================
   ELEMENTOS
========================= */

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


/* =========================
   NAVEGACIÓN
========================= */

function showBusinesses() {

    businessSection.style.display = "block";
    storeSection.style.display = "none";

    businessSection.scrollIntoView({
        behavior: "smooth"
    });
}

function showStores() {

    storeSection.style.display = "block";

    storeSection.scrollIntoView({
        behavior: "smooth"
    });
}

foodButton.addEventListener("click", showBusinesses);

heroFoodButton.addEventListener("click", showBusinesses);

storesButton.addEventListener("click", showStores);

heroStoreButton.addEventListener("click", showStores);


/* =========================
   NEGOCIOS
========================= */

document.querySelectorAll(".business-card[data-business]")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            const businessId =
                button.getAttribute("data-business");

            openBusiness(businessId);
        });

    });


function openBusiness(businessId) {

    const business = businesses[businessId];

    if (!business) {
        return;
    }

    selectedBusiness = businessId;

    productsBusinessName.textContent =
        business.name;

    productsBusinessDescription.textContent =
        business.description;

    productGrid.innerHTML = "";

    business.products.forEach(function (product) {

        const productCard =
            document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <strong>$${product.price.toFixed(2)}</strong>
            </div>

            <button
                class="primary-button add-product-button"
                data-product-id="${product.id}"
            >
                Agregar
            </button>
        `;

        productGrid.appendChild(productCard);
    });

    document
        .querySelectorAll(".add-product-button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        button.getAttribute(
                            "data-product-id"
                        );

                    addToCart(productId);
                }
            );

        });

    productsSection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================
   CARRITO
========================= */

function addToCart(productId) {

    const business =
        businesses[selectedBusiness];

    if (!business) {
        return;
    }

    const product =
        business.products.find(function (item) {
            return item.id === productId;
        });

    if (!product) {
        return;
    }

    const existingProduct =
        cart.find(function (item) {
            return item.id === productId;
        });

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            business: business.name
        });

    }

    updateCart();

    cartSection.scrollIntoView({
        behavior: "smooth"
    });
}


function updateCart() {

    const count =
        cart.reduce(function (total, item) {
            return total + item.quantity;
        }, 0);

    cartCount.textContent = count;

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

        cart.forEach(function (item) {

            const itemElement =
                document.createElement("div");

            itemElement.className = "cart-item";

            itemElement.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
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
                    >
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        class="quantity-button"
                        data-id="${item.id}"
                        data-action="plus"
                    >
                        +
                    </button>

                </div>
            `;

            cartItems.appendChild(itemElement);
        });

        document
            .querySelectorAll(".quantity-button")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            button.getAttribute("data-id");

                        const action =
                            button.getAttribute("data-action");

                        changeQuantity(id, action);
                    }
                );

            });
    }

    const subtotal =
        cart.reduce(function (total, item) {

            return total +
                (item.price * item.quantity);

        }, 0);

    const delivery = cart.length > 0 ? 20 : 0;

    const total = subtotal + delivery;

    cartSubtotal.textContent =
        `$${subtotal.toFixed(2)}`;

    deliveryCost.textContent =
        `$${delivery.toFixed(2)}`;

    cartTotal.textContent =
        `$${total.toFixed(2)}`;
}


function changeQuantity(id, action) {

    const item =
        cart.find(function (product) {
            return product.id === id;
        });

    if (!item) {
        return;
    }

    if (action === "plus") {
        item.quantity += 1;
    }

    if (action === "minus") {

        item.quantity -= 1;

        if (item.quantity <= 0) {

            cart =
                cart.filter(function (product) {
                    return product.id !== id;
                });

        }
    }

    updateCart();
}


/* =========================
   BOTÓN DEL CARRITO
========================= */

cartButton.addEventListener(
    "click",
    function () {

        cartSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =========================
   CONFIRMAR PEDIDO
========================= */

sendOrderButton.addEventListener(
    "click",
    function () {

        if (cart.length === 0) {

            alert(
                "Agrega al menos un producto a tu carrito."
            );

            return;
        }

        if (!customerName.value.trim()) {

            alert(
                "Escribe tu nombre."
            );

            customerName.focus();

            return;
        }

        if (!customerPhone.value.trim()) {

            alert(
                "Escribe tu teléfono."
            );

            customerPhone.focus();

            return;
        }

        if (!customerAddress.value.trim()) {

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


/* =========================
   RESUMEN
========================= */

function createOrderPreview() {

    const subtotal =
        cart.reduce(function (total, item) {

            return total +
                (item.price * item.quantity);

        }, 0);

    const delivery =
        cart.length > 0 ? 20 : 0;

    const total =
        subtotal + delivery;

    let productsHTML = "";

    cart.forEach(function (item) {

        productsHTML += `
            <p>
                ${item.quantity} × ${item.name}
                — $${(item.price * item.quantity).toFixed(2)}
            </p>
        `;
    });

    orderPreview.innerHTML = `
        <div class="order-summary">

            <h3>${cart[0].business}</h3>

            ${productsHTML}

            <hr>

            <p>
                <strong>Productos:</strong>
                $${subtotal.toFixed(2)}
            </p>

            <p>
                <strong>Envío:</strong>
                $${delivery.toFixed(2)}
            </p>

            <p>
                <strong>Total:</strong>
                $${total.toFixed(2)}
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

    orderModal.classList.add("active");
}


/* =========================
   WHATSAPP
========================= */

whatsappOrderButton.addEventListener(
    "click",
    function () {

        const subtotal =
            cart.reduce(function (total, item) {

                return total +
                    (item.price * item.quantity);

            }, 0);

        const delivery =
            cart.length > 0 ? 20 : 0;

        const total =
            subtotal + delivery;

        let message =
            "🛵 *NUEVO PEDIDO PANCHGO*%0A%0A";

        message +=
            "*Negocio:* " +
            cart[0].business +
            "%0A%0A";

        message +=
            "*Productos:*%0A";

        cart.forEach(function (item) {

            message +=
                item.quantity +
                " × " +
                item.name +
                " - $" +
                (item.price * item.quantity).toFixed(2) +
                "%0A";

        });

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
            IMPORTANTE:
            Aquí todavía NO ponemos un número real.
            Más adelante colocaremos el WhatsApp
            que recibirá los pedidos.
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
    }
);


/* =========================
   CERRAR MODAL
========================= */

closeOrderModal.addEventListener(
    "click",
    function () {

        orderModal.classList.remove("active");

    }
);


/* =========================
   CONTACTO NEGOCIOS
========================= */

joinBusinessButton.addEventListener(
    "click",
    function () {

        alert(
            "Próximamente podrás registrar tu negocio en PanchGo."
        );

    }
);


/* =========================
   INICIO
========================= */

updateCart();