/* =========================================================
   PANCHGO
   SCRIPT COMPLETO + SUPABASE
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://vciekecvbqvlbavxhmfz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_1wRntDky8YlSGLmynI8O5Q_lNSbWMbu";


/* =========================================================
   CONEXIÓN SUPABASE
========================================================= */

let supabaseClient = null;

try {

    if (
        typeof window.supabase === "undefined" ||
        typeof window.supabase.createClient !== "function"
    ) {

        throw new Error(
            "La librería de Supabase no está cargada."
        );

    }

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log(
        "PanchGo: Supabase conectado correctamente."
    );

} catch (error) {

    console.error(
        "PanchGo: error al inicializar Supabase:",
        error
    );

}


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

        console.error(
            "PanchGo: no existe .business-list en index.html."
        );

        return;
    }


    businessList.innerHTML = `

        <div class="empty-message">

            <