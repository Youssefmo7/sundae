import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { Card } from '../components/Card.js';
import { storage } from '../appwrite.js';

export function Product({ product }) {
  if (!product) {
    return '<h1>Product not found</h1>';
  }

  const imageUrls = product.flavors ? product.flavors.map(flavor => {
    return storage.getFileView({
      bucketId: import.meta.env.VITE_BUCKET_ID,
      fileId: flavor.image
    });
  }) : [];

  const mainImage = imageUrls.length > 0 ? imageUrls[0] : '';

  const flavorImages = imageUrls.map((url, i) => `
    <div class="image-box" onclick="changeMainImage('${url}')">
      <img src="${url}" alt="" />
    </div>
  `).join('');

  const flavorsList = product.flavors ? product.flavors.map((flavor, index) => `
    <li>${flavor.name}</li>
  `).join('') : '';

  // Shuffle and get 4 related products
  let shuffledProducts = [...products].sort(() => 0.5 - Math.random());
  shuffledProducts = shuffledProducts.slice(0, 4).filter(p => p.$id !== product.$id);
  const relatedProducts = shuffledProducts.map(p => Card({ product: p })).join('');

  // Set main image after render
  setTimeout(() => {
    window.changeMainImage = (url) => {
      document.querySelector('.product-preview img').src = url;
    };
  }, 0);

  return `
    ${Header()}
    <div class="product-banner"><p>${product.name}</p><h6 class="path">Home / Products / ${product.name}</h6></div>
    <div class="product-page">
      <div class="product-preview">
        <img src="${mainImage}" alt="${product.name}" />
        <div class="flavors-images">
          ${flavorImages}
        </div>
      </div>
      <div class="product-details" style="display: inline-block; margin-left: 20px;">
        <h2>Product Details</h2>
        <p>${product.description || ''}</p>
        <p><b>Flavors:</b></p>
        <ul style="list-style: none; margin-bottom: 20px;">
          ${flavorsList}
        </ul>
        <a href="#/location">
          <button class="btn-sky">Make Your Order</button>
        </a>
      </div>
    </div>
    <p class="chooseUrFav">Related <span>Products</span></p>
    <div class="related-products">
      ${relatedProducts}
    </div>
    ${Footer()}
  `;
}