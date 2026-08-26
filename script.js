/* =========================================================
   PANCHGO
   SCRIPT COMPLETO + SUPABASE + DIAGNÓSTICO
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
   CARGAR NEGOCIOS DESDE SUPABASE
========================================================= */

async function loadBusinesses() {

    const businessList =
        document.querySelector(
            ".business-list"
        );


    if (!businessList) {

        return;
    }


    businessList.innerHTML = `

        <div class="empty-message">

            <span>⏳</span>

            <h3>
                Cargando negocios...
            </h3>

            <p>
                Conectando con PanchGo.
            </p>

        </div>

    `;


    try {

        console.log(
            "PANCHGO: intentando cargar Businesses..."
        );


        const result =
            await supabaseClient
                .from("Businesses")
                .select("*")
                .eq("active", true)
                .order("name");


        const data =
            result.data;

        const error =
            result.error;


        console.log(
            "PANCHGO: respuesta Businesses:",
            result
        );


        if (error) {

            console.error(
                "PANCHGO ERROR BUSINESSES:",
                error
            );


            throw error;
        }


        renderBusinesses(
            data || []
        );


    } catch (error) {

        console.error(
            "PANCHGO ERROR COMPLETO:",
            error
        );


        const errorMessage =
            error?.message ||
            "Error desconocido";

        const errorCode =
            error?.code ||
            "Sin código";

        const errorDetails =
            error?.details ||
            "Sin detalles";

        const errorHint =
            error?.hint ||
            "Sin sugerencia";


        businessList.innerHTML = `

            <div class="empty-message">

                <span>⚠️</span>

                <h3>
                    Error al cargar negocios
                </h3>

                <p>
                    <strong>Código:</strong>
                    ${errorCode}
                </p>

                <p>
                    <strong>Mensaje:</strong>
                    ${errorMessage}
                </p>

                <p>
                    <strong>Detalles:</strong>
                    ${errorDetails}
                </p>

                <p>
                    <strong>Sugerencia:</strong>
                    ${errorHint}
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
                    No hay negocios todavía.
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


            button.dataset.businessId =
                business.id;


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
        business.id;


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
        business.id
    );
}


/* =========================================================
   CARGAR PRODUCTOS
========================================================= */

async function loadProducts(
    businessId
) {

    try {

        console.log(
            "PANCHGO: cargando productos del negocio:",
            businessId
        );


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


        console.log(
            "PANCHGO: respuesta Products:",
            {
                data,
                error
            }
        );


        if (error) {

            console.error(
                "ERROR PRODUCTS:",
                error
            );

            throw error;
        }


        renderProducts(
            data || []
        );


    } catch (error) {

        console.error(
            "No se pudieron cargar los productos:",
            error
        );


        const errorMessage =
            error?.message ||
            "Error desconocido";


        const errorCode =
            error?.code ||
            "Sin código";


        productGrid.innerHTML = `

            <div class="empty-message">

                <span>⚠️</span>

                <h3>
                    No pudimos cargar los productos.
                </h3>

                <p>
                    <strong>Código:</strong>
                    ${errorCode}
                </p>

                <p>
                    <strong>Error:</strong>
                    ${errorMessage}
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
                product.Id;


            const productName =
                product.name ||
                "Producto";


            const productDescription =
                product.Description ||
                "";


            const productPrice =
                Number(
                    product.Price || 0
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
   CARRITO
========================================================= */

function addToCart(
    product
) {

    if (
        !selectedBusinessData
    ) {

        alert(
            "Selecciona un negocio primero."
        );

        return;
    }


    const