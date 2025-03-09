export function Header() {
    return `
      <header class="header">
        <div class="logo">
          <button id="logo-button" style="background: none; border: none; padding: 0; cursor: pointer;">
            <img src="../images/LOGO.png" alt="Logo" />
          </button>
        </div>
        <nav class="navbar">
          <a id="womens" href="#">Women's</a>
          <a id="mens"href="#">Men's</a>
          <a id="all-categories" href="#">All Categories</a>
          <a id="sale" href="#">Sale</a>
        </nav>
        <div class="search-bar">
          <input type="text" id="search-input" class="search-input" placeholder="Search...">
          <button id="search-button" class="search-button">
            <i class="fa-solid fa-magnifying-glass" style="color: #ffffff"></i>
          </button>
          <div class="cart-icon">
            <a href="#cart" id="cart-icon"><i class="fas fa-shopping-cart" style="color: #ffff"></i></a>
          </div>
          <div id="user-icon">
            <a href="#user" id="user-icon"><i class="fas fa-user" style="color: #ffff"></i></a>
          </div>
        </div>
      </header>
    `;
  }

// Adiciona os event listeners quando o documento estiver carregado
export function setupHeaderListeners() {
    document.getElementById("womens")?.addEventListener("click", event => {
        event.preventDefault();
        window.location.href = "../allProducts/allProducts.html";
    });

    document.getElementById("all-categories")?.addEventListener("click", event => {
        event.preventDefault();
        window.location.href = "../allProducts/allProducts.html";
    });

    document.getElementById("logo-button")?.addEventListener("click", event => {
        event.preventDefault();
        window.location.href = "../index.html";
    });

    document.getElementById("cart-icon")?.addEventListener("click", event => {
        event.preventDefault();
        window.location.href = "../cart/cart.html";
    });

    document.getElementById("user-icon")?.addEventListener("click", event => {
        event.preventDefault();
        window.location.href = "../user/login.html";
    });
    document.getElementById("mens")?.addEventListener("click", event => {
      event.preventDefault();
      window.location.href = "../allProducts/allProducts.html";
  });
  document.getElementById("sale")?.addEventListener("click", event => {
    event.preventDefault();
    window.location.href = "../allProducts/allProducts.html";
});
}
