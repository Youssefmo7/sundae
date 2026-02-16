
export function Card(product) {
  return `
    <div class="card">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.slogan}</p>
      <a href="#/products/${product.$id}"><button>View</button></a>
    </div>
  `;
}