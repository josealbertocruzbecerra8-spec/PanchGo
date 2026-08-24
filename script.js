let cartCount = 0;

const cartButton = document.getElementById("cartButton");
const cartCountElement = document.getElementById("cartCount");

const foodButton = document.getElementById("foodButton");
const storesButton = document.getElementById("storesButton");

const businessSection = document.getElementById("businessSection");
const storeSection = document.getElementById("storeSection");

const birriaHomeButton = document.getElementById("birriaHomeButton");

foodButton.addEventListener("click", function () {
    businessSection.style.display = "block";
    storeSection.style.display = "none";

    businessSection.scrollIntoView({
        behavior: "smooth"
    });
});

storesButton.addEventListener("click", function () {
    storeSection.style.display = "block";
    businessSection.style.display = "none";

    storeSection.scrollIntoView({
        behavior: "smooth"
    });
});

birriaHomeButton.addEventListener("click", function () {
    alert(
        "BirriaHome\n\n" +
        "Aquí próximamente aparecerá el catálogo de productos, " +
        "precios y opciones de pedido."
    );
});

cartButton.addEventListener("click", function () {
    if (cartCount === 0) {
        alert("Tu carrito está vacío.");
    } else {
        alert(
            "Tienes " +
            cartCount +
            " producto(s) en tu carrito."
        );
    }
});
