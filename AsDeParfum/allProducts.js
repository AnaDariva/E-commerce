import { Header, setupHeaderListeners } from "./components/header.js";
import { Footer } from "./components/footer.js";
import { ProductCard } from "./components/card.js";

console.log("allProducts.js carregado");

document.addEventListener("DOMContentLoaded", () => {
    // Adiciona o cabeçalho e rodapé dinamicamente
    document.body.insertAdjacentHTML("afterbegin", Header());
    document.body.insertAdjacentHTML("beforeend", Footer());

    // Configura os ouvintes de evento para o cabeçalho (menu de navegação)
    setupHeaderListeners();

    const productsContainer = document.getElementById("products-container");

    // Faz o fetch para obter os produtos do JSON
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            // Cria dinamicamente os cards de produtos e insere no container
            productsContainer.innerHTML = products.map(ProductCard).join("");

            // Adiciona o evento de click para os botões de adicionar ao carrinho
            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", event => {
                    event.stopPropagation(); // Impede que o clique no botão se propague para o card
                    const productId = event.target.getAttribute("data-id");
                    const selectedProduct = products.find(product => product.id === parseInt(productId));
                    addToCart(selectedProduct); // Chama a função para adicionar o produto ao carrinho
                });
            });

            // Adiciona o evento de click para os cards de produto (para ir para a página de detalhes)
            document.querySelectorAll(".product-card").forEach(card => {
                card.addEventListener("click", event => {
                    const productId = event.currentTarget.querySelector(".add-to-cart").getAttribute("data-id");
                    window.location.href = `../productInfo/productInfo.html?id=${productId}`; // Redireciona para a página de detalhes
                });
            });
        })
        .catch(error => console.error("Error fetching products:", error));
        
});

// Função para adicionar um produto ao carrinho
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtém o carrinho ou cria um novo array
    const existingProductIndex = cart.findIndex(item => item.id === product.id); // Verifica se o produto já existe no carrinho

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1; // Se o produto já estiver no carrinho, aumenta a quantidade
    } else {
        cart.push({ ...product, quantity: 1 }); // Se o produto não estiver no carrinho, adiciona com quantidade 1
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Atualiza o carrinho no localStorage
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

