import { Header, setupHeaderListeners } from "./components/header.js";
import { Footer } from "./components/footer.js";

document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("afterbegin", Header());
    document.body.insertAdjacentHTML("beforeend", Footer());

    // Configura os ouvintes de evento para o cabeçalho (menu de navegação)
    setupHeaderListeners();

    const searchParams = new URLSearchParams(window.location.search);
    let productId = searchParams.get("id");
    if (!productId) {
        productId = 1;
    }
    console.log("Product ID:", productId);

    if (productId) {
        fetch("../allProducts/products.json")
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === Number(productId));

                if (product) {
                    product.quantity = product.quantity || 1;
                    document.getElementById("product-name").textContent = product.name;
                    document.getElementById("product-name-breadcrumb").textContent = product.name;
                    document.getElementById("product-rating").textContent = `⭐⭐⭐⭐⭐ (${product.reviews} reviews)`;
                    document.getElementById("product-price").textContent = `US$ ${product.price}`;
                    document.getElementById("installments").textContent = `or 4 interest-free payments of $${(product.price / 4).toFixed(2)}`;
                    document.getElementById("product-description").textContent = product.description;
                    document.getElementById("main-image").src = product.image;

                    const thumbnailsContainer = document.getElementById("thumbnails-container");
                    thumbnailsContainer.innerHTML = '<div class="arrow"><a href="#arrow-left"><i class="fa-solid fa-arrow-left"></i></a></div>';

                    product.thumbnails.forEach(src => {
                        const img = document.createElement("img");
                        img.src = src;
                        img.alt = "Thumbnail";
                        thumbnailsContainer.appendChild(img);
                    });
                    thumbnailsContainer.innerHTML += '<div class="arrow"><a href="#arrow-right"><i class="fa-solid fa-arrow-right"></i></a></div>';

                    const sizeOptions = document.getElementById("size-options");
                    sizeOptions.innerHTML = `Size`;

                    product.sizes.forEach(size => {
                        const button = document.createElement("button");
                        button.textContent = `${size}ml`;
                        sizeOptions.appendChild(button);
                    });

                    const quantityInput = document.querySelector(".quantity-input");
                    const itemPrice = document.querySelector(".item-price");
                    quantityInput.value = product.quantity;
                    itemPrice.textContent = `U$${(product.price * product.quantity).toFixed(2)}`;

                    const decreaseButton = document.querySelector(".decrease");
                    const increaseButton = document.querySelector(".increase");

                    decreaseButton.addEventListener("click", () => {
                        if (product.quantity > 1) {
                            product.quantity--;
                            quantityInput.value = product.quantity;
                            itemPrice.textContent = `$${(product.price * product.quantity).toFixed(2)}`;
                        }
                    });

                    increaseButton.addEventListener("click", () => {
                        product.quantity++;
                        quantityInput.value = product.quantity;
                        itemPrice.textContent = `$${(product.price * product.quantity).toFixed(2)}`;
                    });

                    // Função para adicionar o produto ao carrinho
                    document.querySelector(".add-to-cart").addEventListener("click", () => {
                        addToCart(product);
                    });
                }
            })
            .catch(error => console.error("Error fetching products:", error));
    }

});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        cart.push({ ...product, quantity: product.quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showNotification(product);

}


function showNotification(product) {
    // Criar o elemento de notificação
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `
        <p><strong>${product.name}</strong> was added to your cart! 
        <a href="../cart/cart.html">Click here to view your cart</a>.</p>
    `;

    // Adicionar a notificação ao corpo da página
    document.body.appendChild(notification);

    // Remover a notificação após 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}