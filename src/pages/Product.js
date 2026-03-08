import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { Card } from '../components/Card.js';
import { tablesDb } from '../appwrite.js';
import { ID, Query } from 'appwrite';

async function getCategory(id) {
  const res = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES,
    queries: [
      Query.equal('$id', id)
    ],
    total: false
  });
  return res.rows[0];
}

async function getRelated() {
  const totalResponse = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
    queries: [Query.limit(1)]
  });

  const total = totalResponse.total;

  const randomOffset = Math.floor(Math.random() * (total - 5));

  const res = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
    queries: [
      Query.limit(5),
      Query.offset(randomOffset)
    ],
    total: false
  });
  return res.rows;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function Product({ product }) {
  if (!product) {
    return '<h1>Product not found</h1>';
  }

  product.flavors = JSON.parse(product.flavors);

  const category = await getCategory(product.category);
  const imageUrls = product.flavors ? product.flavors.map((flavor) => flavor.imageUrl) : [];
  const mainImage = product.image;

  const flavorImages = imageUrls.map((url) => `
    <div class="image-box" onclick="changeMainImage('${url}')">
      <img src="${url}" alt="" />
    </div>
  `).join('');

  const flavorsList = `<select class="flavors-list" onchange="changeMainImage(this.value)">
    ${product.flavors.map(f => `<option value="${f.imageUrl}">${f.name}</option>`).join('')}
  </select>`
  // console.log(flavorsList)
  const relatedRes = await getRelated();
  const relatedProducts = relatedRes.map(p => Card(p)).join('');

  setTimeout(() => {
    window.changeMainImage = (url) => {
      const mainPreviewImage = document.querySelector('.product-preview img');
      if (mainPreviewImage) {
        mainPreviewImage.src = url;
      }
    };

    // letest = () => console.log("clicked");

    const reviewForm = document.getElementById('product-review-form');
    const reviewList = document.getElementById('reviews-list');
    const reviewFeedback = document.getElementById('review-feedback');

    const renderReviews = async (id) => {
      if (!reviewList) return;
      // console.log("id :: ", id);

      const res = await tablesDb.listRows({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
        queries: [
          Query.equal('productId', id)
        ],
        total: false
      });
      const reviews = res.rows;

      if (reviews.length === 0) {
        reviewList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review this product.</p>';
        return;
      }

      let totalSum = 0;

      reviewList.innerHTML = reviews.map((review) => {
        totalSum += review.rating;
        return `
        <article class="review-card">
          <div class="review-meta">
            <h5>${escapeHtml(review.name)}</h5>
            <p>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
          </div>
          <p class="review-email">${escapeHtml(review.email)}</p>
          <p class="review-text">${escapeHtml(review.review)}</p>
        </article>
      `}).join('');

      let rating = Math.ceil(totalSum / reviews.length);
      document.getElementById('rating').textContent = `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`
    };

    renderReviews(product.$id);

    if (!reviewForm) return;

    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(reviewForm);
      const reviewPayload = {
        productId: product.$id,
        name: String(formData.get('review-name') || '').trim(),
        email: String(formData.get('review-email') || '').trim(),
        rating: Number(formData.get('review-rating')),
        review: String(formData.get('review-message') || '').trim()
      };

      if (!reviewPayload.name || !reviewPayload.email || !reviewPayload.rating || !reviewPayload.review) {
        if (reviewFeedback) {
          reviewFeedback.textContent = 'Please fill all review fields.';
          reviewFeedback.className = 'review-feedback error';
        }
        return;
      }

      tablesDb.createRow({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
        rowId: ID.unique(),
        data: reviewPayload
      });

      if (reviewFeedback) {
        reviewFeedback.textContent = 'Review submitted successfully.';
        reviewFeedback.className = 'review-feedback success';
      }

      reviewForm.reset();
    });
  }, 0);

  return `
    ${Header()}
    <div class="product-banner"><p>${product.name}</p><h6 class="path">Home / Products / ${product.name}</h6></div>
    <div class="background">
      <div class="product-page">
        <div class="product-preview">
          <div class="d"></div>
          <img src="${mainImage}" alt="${product.name}" />
          <div class="flavors-images">
            ${flavorImages}
          </div>
        </div>
        <div class="product-details">
          <p id="rating" style="color: gold;">☆☆☆☆☆</p>
          <h2 class="p-name">${product.name || ''}</h2>
          <h2 class="p-name">${product.price || ''}.0 EGP</h2>
          <p class="p-desc">${product.description || ''}</p>
          <h2 class="p-name">Product Category:</h2>
          <p class="p-desc">${category.name || ''}</p>
          <h2 class="p-name">Product Flavors:</h2>
          ${flavorsList}
        </div>
      </div>

      <section class="review-section container">
        <div class="review-form-box">
          <h3>Write a Review</h3>
          <form id="product-review-form" class="review-form">
            <div class="review-grid">
              <div class="input-container">
                <input type="text" id="review-name" name="review-name" placeholder=" " required>
                <label for="review-name">Name</label>
              </div>
              <div class="input-container">
                <input type="email" id="review-email" name="review-email" placeholder=" " required>
                <label for="review-email">Email</label>
              </div>
            </div>
            <div class="input-container">
              <select id="review-rating" name="review-rating" required>
                <option value="">Select rating</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
              <label for="review-rating" class="fixed-label">Rating</label>
            </div>
            <div class="input-container">
              <textarea id="review-message" name="review-message" rows="4" placeholder=" " required></textarea>
              <label for="review-message">Review</label>
            </div>
            <button type="submit" class="submit-review-btn">Submit Review</button>
          </form>
          <p id="review-feedback" class="review-feedback"></p>
        </div>

        <div class="review-list-box">
          <h3>Customer Reviews</h3>
          <div id="reviews-list" class="reviews-list"></div>
        </div>
      </section>

      <p class="chooseUrFav">Related <span>Products</span></p>
      <div class="related-products">${relatedProducts}</div>
    </div>
    ${Footer()}
  `;
}
