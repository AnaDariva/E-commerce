import { Header, setupHeaderListeners } from "./components/header.js";
import { Footer } from "./components/footer.js";

console.log("cart.js foi carregado"); 

//.? optional chaining 
document.getElementById('checkout')?.addEventListener('click', function (event) {
  event.preventDefault();
  window.location.href = '../user/login.html';
});

//ir para o carrinho ao clicar no icone cart

document.getElementById('edit-address')?.addEventListener('click', function (event) {
  event.preventDefault();
  window.location.href = '../user/addres.html';
});
document.getElementById('continue-shopping')?.addEventListener('click', function (event) {
  event.preventDefault();
  window.location.href = '../index.html';
});

/*event.preventDefault(); 
• Previne o comportamento padrão do objeto cancelando o comportamento que os objetos, 
geralmente, tem na página. • Por exemplo: uma tag de link, sempre tentará abrir um novo endereço. 
Contudo, muitas vezes, um link pode abrir um modal.*/
document.body.insertAdjacentHTML("afterbegin", Header());
    document.body.insertAdjacentHTML("beforeend", Footer());

    // Configura os ouvintes de evento para o cabeçalho (menu de navegação)
    setupHeaderListeners();

// Load Cart Items
function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!Array.isArray(cart)) {
    localStorage.setItem("cart", JSON.stringify([])); // Corrige se estiver corrompido
  } //O carrinho de compras é recuperado do localStorage (armazenamento local do navegador). Se não houver nada salvo, a variável cart recebe um array vazio.
  //O método getItem("cart") pega o valor armazenado com a chave "cart". Como o getItem retorna uma string, utilizamos JSON.parse para transformá-la de volta em um array de objetos. Caso não haja nada no localStorage, o carrinho será um array vazio ([]).

  console.log("parsed cart: ", cart)

  //agora estamos usando getElementById e atribuindo o id a uma nova variavel, ja que em js nao é permitido variaveis com o mesmo nome
  //ou seja, os id="" declarados no cart.html estao sendo atribuidos a essas novas para podermos manipular
  const cartContainer = document.getElementById("cart-container");
  const itemQuantity = document.getElementById("item-quantity");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryTotal = document.getElementById("summary-total");

  let subtotal = 0; //inicia o subtotal em zero com let, visto que a cada item adicionado ou excluido essa variavel vai sofrer alteraçoes, nao sendo assim uma const(constante)

  itemQuantity.textContent = cart.reduce((sum, product) => sum + (product.quantity || 0), 0);//Usamos o método reduce para somar a quantidade total de itens no carrinho. 
  // Para cada item (product), adicionamos o valor de product.quantity (quantidade de unidades desse produto) ao sum, e iniciamos a soma com 0.

  if (cart.length === 0) { //if o carrinho estiver vazio
    cartContainer.innerHTML = "<p>Your cart is empty</p>"; //exibe mensagem
    subtotalElement.textContent = "Subtotal: $0";
    totalElement.textContent = "Total: $5";
    //subtotal e total definidos como zero e $5 do shipping
    if (summarySubtotal) summarySubtotal.textContent = "Subtotal: $0";
    if (summaryTotal) summaryTotal.textContent = "Total (Tax incl.): $5.00";
    return;
  }

  cartContainer.innerHTML = ""; // Clear previous content

  //caso o carrinho tenha produtos
  cart.forEach((product) => {
    //console.log("product value: ", product)
    const productDiv = document.createElement("div"); //uma div é criada e preenchida com as infos do item
    productDiv.classList.add("product");//damos a ela a classe CSS "product" para que o estilo adequado seja aplicado

    subtotal += (parseFloat(product.price) || 0) * (product.quantity || 0); //guarda na variavel 'subtotal' a conta usando ParseFloat p converter uma string para float e faz * a quantidade
    
    productDiv.innerHTML = `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.name}" class="product-image">
          <h3>Perfume feminino ${product.name} 50ml</h3>
      <div class="quantity-controls">
        <button class="decrease" data-id="${product.id}">-</button>
        <input type="text" class="quantity-input" data-id="${product.id}" value="${product.quantity}">
        <button class="increase" data-id="${product.id}">+</button>
      </div>
      <p class="item-price">$${(product.price * product.quantity).toFixed(2)}</p>
      <button class="remove-from-cart"  data-id="${product.id}"><i class ="fa-solid fa-trash" style="color:rgb(0, 0, 0);"></i></button>
    </div>
  `;

    cartContainer.appendChild(productDiv); //adiciona um filho (nova div) a cada produto adicionado na div pai 
  }); //finaliza o forEach

  // Update totals
  subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  totalElement.textContent = `Total: $${(subtotal + 5).toFixed(2)}`;
  if (summarySubtotal) summarySubtotal.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  if (summaryTotal) summaryTotal.textContent = `Total (Tax incl.): $${(subtotal + 5).toFixed(2)}`;

  // A funcao loadCartItems adiciona listeners aos botoes de aumentar (increase), diminuir (decrease) e aos campos de quantidade de cada
  //  item para permitir que o usuário altere a quantidade diretamente.  
  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", (event) => updateQuantity(event, 1));
  }); //quando a classe 'increase' feita no html acima for clicada, chama a funçao 'updateQuantity' passando 1 como parametro p aumentar a qtde

  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", (event) => updateQuantity(event, -1));
  }); //mesma coisa mas diminuindo

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (event) => updateQuantity(event, 1, true));
  });//Aqui, adicionamos um listener aos campos de input (onde o usuario pode digitar a quantidade diretamente). Quando o valor do input é alterado, chama 'updateQuantity' passando 0 e true, indicando que a mudanca veio do campo de texto e nao dos botoes de aumentar/diminuir
}



// é chamada quando a qtde de um item é alterada via botao ou input
function updateQuantity(event, change, isInput = false) {
  //recebe o evento(event) quando o botao ou input é alterado, a mudança desejada(qtde a ser add ou sub), um parametro isInput para determinar se a mudança foi feita atras do input
  let cart = JSON.parse(localStorage.getItem("cart")) || []; //mesma coisa q a funçao de cima, pega os itens no localStorage, mas usando let, visto que ela nao é const, ja q a quantidade pode aumentar ou nao, entao usamos let
  const productId = parseInt(event.target.getAttribute("data-id"));


  if (!productId) return; // Se for inválido, sai da função
  //obtemos o id do produto pelo data-id do botao ou input clicado

  const product = cart.find((p) => p.id === productId); //busca o produto no carrinho que tem o id igual ao productId
  if (!product) return; //caso n exista, funcao termina 


  if (isInput) { // se for alterado pelo input(escrevendo na mao) o valor inserido é validado
    product.quantity = Math.max(1, parseInt(event.target.value) || 1); //se for menor que 1, é ajustado para 1
  } else { //botao
    product.quantity = Math.max(1, (product.quantity || 0) + change); //se a alteraçao for via botao
    //console.log(product.quantity);
  }

  product.price = product.price || 0;
  localStorage.setItem("cart", JSON.stringify(cart)); //atualiza o localStorage e salvo
  loadCartItems(); //apos alteraçao, a funcao anterior 'loadCartItems' é chamada para atualizar a interface
}

// remover do carrinho
function removeFromCart(productId) {

  let cart = JSON.parse(localStorage.getItem("cart")) || []; //mesma explicacao do localStorage

  cart = cart.filter((product) => product.id !== productId); //filtra o produto a ser removido pelo id
  localStorage.setItem("cart", JSON.stringify(cart)); //atualiza o localStorage
  loadCartItems(); //apos alteraçao, a funcao anterior 'loadCartItems' é chamada para atualizar a interface
}

//evento para capturar os cliques no botao de remove
document.addEventListener("click", function (event) {
  let target = event.target;

  // Se o clique foi no ícone <i>, pegamos o elemento pai <button>
  if (target.tagName === "I") {
    target = target.closest("button");
  }

  if (target && target.classList.contains("remove-from-cart")) {
    const productId = parseInt(target.getAttribute("data-id"));
    removeFromCart(productId);
  }
});


// carregar os itens qdo a pagina é atualizada
document.addEventListener("DOMContentLoaded", function () {
  loadCartItems();
});

console.log(document.getElementById("cart-container"));
console.log("Carrinho salvo no localStorage:", localStorage.getItem("cart"));
