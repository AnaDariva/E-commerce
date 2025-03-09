export function ProductCard(product) {
    return `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image">
            <h2 class="product-name">${product.name} EAU DE PARFUM </h2>
            <p class="product-price">$${product.price.toFixed(2)} </p>
            <p class="interest-free">or 4 interest-free payments of $${(product.price / 4).toFixed(2)}
            <br>
            <br>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>

      </div>
    `;
  }
  