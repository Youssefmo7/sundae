import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { Card } from '../components/Card.js';
import { tablesDb } from '../appwrite.js';
import { ID, Query } from 'appwrite';
import { getCachedCategories, getCachedProducts } from '../utils/dataCache.js';
import { t } from '../utils/i18n.js';

async function getCategory(id) {
  const cached = await getCachedCategories();
  const found = cached.find((cat) => cat.$id === id);
  if (found) return found;

  const res = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES,
    queries: [Query.equal('$id', id)],
    total: false
  });
  return res.rows[0];
}

async function getRelated(currentProductId) {
  const cached = await getCachedProducts();
  const filtered = currentProductId
    ? cached.filter((item) => item.$id !== currentProductId)
    : cached.slice();

  if (filtered.length) {
    for (let i = filtered.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    return filtered.slice(0, 5);
  }

  const baseQueries = currentProductId ? [Query.notEqual('$id', currentProductId)] : [];

  const totalResponse = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
    queries: baseQueries,
    total: true
  });

  const total = Number(totalResponse.total || 0);
  if (!total) return [];

  const maxOffset = Math.max(0, total - 5);
  const randomOffset = maxOffset === 0 ? 0 : Math.floor(Math.random() * (maxOffset + 1));

  const res = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
    queries: [
      ...baseQueries,
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

function parseFlavors(raw) {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeFlavor(flavor = {}) {
  return {
    name: String(flavor.name || ''),
    imageUrl: String(flavor.imageUrl || ''),
    description: String(flavor.description || '')
  };
}

export async function Product({ product }) {
  if (!product) {
    return `
      ${Header()}
      <div class="product-banner">
        <p>${t('product.not_found')}</p>
        <h6 class="path">${t('product.path_products')}</h6>
      </div>
      ${Footer()}
    `;
  }

  const flavors = parseFlavors(product.flavors).map(normalizeFlavor);
  const category = await getCategory(product.category);

  const initialFlavor = flavors[0] || null;
  const mainImage = product.image || '';
  const mainName = product.name || '';
  const mainDesc = product.description || '';

  const flavorImages = flavors.length
    ? flavors
        .map((flavor, index) => {
          const imageUrl = escapeHtml(flavor.imageUrl || product.image || '');
          const name = escapeHtml(flavor.name);
          return `
            <div class="image-box flavor-thumb" data-index="${index}" role="button" aria-label="Preview ${name}">
              <img src="${imageUrl}" alt="${name}" />
            </div>
          `;
        })
        .join('')
    : `<div class="no-reviews">${t('product.no_flavor_images')}</div>`;

  const flavorsList = flavors.length
    ? `
      <select id="flavor-select" class="flavors-list">
        ${flavors
          .map((flavor, index) => `<option value="${index}">${escapeHtml(flavor.name)}</option>`)
          .join('')}
      </select>
    `
    : `<p class="p-desc">${t('product.no_flavors')}</p>`;

  const relatedRes = await getRelated(product.$id);
  const relatedProducts = relatedRes.length
    ? relatedRes.map((item) => Card(item)).join('')
    : `<p class="p-desc">${t('product.no_related')}</p>`;

  setTimeout(() => {
    const mainPreviewImage = document.querySelector('.product-preview img');
    const productName = document.getElementById('product-name');
    const productDescription = document.getElementById('product-description');

    const updatePreview = (flavor) => {
      if (!flavor) return;
      if (mainPreviewImage && flavor.imageUrl) {
        mainPreviewImage.src = flavor.imageUrl;
      }
      if (productName && flavor.name) {
        productName.textContent = flavor.name;
      }
      if (productDescription) {
        productDescription.textContent = flavor.description || '';
      }
    };

    const flavorThumbs = document.querySelectorAll('.flavor-thumb');
    flavorThumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const index = Number(thumb.dataset.index);
        const selected = flavors[index];
        updatePreview(selected);
        const flavorSelect = document.getElementById('flavor-select');
        if (flavorSelect) flavorSelect.value = String(index);
      });
    });

    const flavorSelect = document.getElementById('flavor-select');
    if (flavorSelect) {
      flavorSelect.value = '0';
      flavorSelect.addEventListener('change', (event) => {
        const index = Number(event.target.value);
        const selected = flavors[index];
        updatePreview(selected);
      });
    }

    const reviewForm = document.getElementById('product-review-form');
    const reviewList = document.getElementById('reviews-list');
    const reviewFeedback = document.getElementById('review-feedback');

    const renderReviews = async (id) => {
      if (!reviewList) return;

      const res = await tablesDb.listRows({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
        queries: [Query.equal('productId', id)],
        total: false
      });
      const reviews = res.rows;

      if (reviews.length === 0) {
        reviewList.innerHTML = `<p class="no-reviews">${t('product.no_reviews')}</p>`;
        return;
      }

      let totalSum = 0;

      reviewList.innerHTML = reviews
        .map((review) => {
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
          `;
        })
        .join('');

      const rating = Math.ceil(totalSum / reviews.length);
      const ratingEl = document.getElementById('rating');
      if (ratingEl) {
        ratingEl.textContent = `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
      }
    };

    renderReviews(product.$id);

    if (!reviewForm) return;

    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(reviewForm);
      const ratingValue = Number(formData.get('review-rating'));
      const reviewPayload = {
        productId: product.$id,
        name: String(formData.get('review-name') || '').trim(),
        email: String(formData.get('review-email') || '').trim(),
        rating: ratingValue,
        review: String(formData.get('review-message') || '').trim()
      };

      if (!reviewPayload.name || !reviewPayload.email || !reviewPayload.review) {
        if (reviewFeedback) {
        reviewFeedback.textContent = t('product.review_required');
          reviewFeedback.className = 'review-feedback error';
        }
        return;
      }

      if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        if (reviewFeedback) {
          reviewFeedback.textContent = t('product.rating_required');
          reviewFeedback.className = 'review-feedback error';
        }
        return;
      }

      try {
        await tablesDb.createRow({
          databaseId: import.meta.env.VITE_DATABASE_ID,
          tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
          rowId: ID.unique(),
          data: reviewPayload
        });

        if (reviewFeedback) {
          reviewFeedback.textContent = t('product.review_success');
          reviewFeedback.className = 'review-feedback success';
        }

        reviewForm.reset();
        await renderReviews(product.$id);
      } catch (error) {
        if (reviewFeedback) {
          reviewFeedback.textContent = t('product.review_error');
          reviewFeedback.className = 'review-feedback error';
        }
      }
    });
  }, 0);

  const priceNumber = Number(product.price);
  const priceLabel = Number.isFinite(priceNumber) ? `${priceNumber.toFixed(0)} EGP` : `${escapeHtml(product.price || '')} EGP`;

  return `
    ${Header()}
    <div class="product-banner">
      <p>${escapeHtml(product.name)}</p>
      <h6 class="path">${t('product.path_prefix')} ${escapeHtml(product.name)}</h6>
    </div>
    <div class="background">
      <div class="product-page">
        <div class="product-preview">
          <div class="d"></div>
          <img src="${escapeHtml(mainImage)}" alt="${escapeHtml(mainName)}" />
          <div class="flavors-images">
            ${flavorImages}
          </div>
        </div>
        <div class="product-details">
          <p id="rating" style="color: gold;">☆☆☆☆☆</p>
          <h2 id="product-name" class="p-name">${escapeHtml(mainName)}</h2>
          <h2 class="p-name">${priceLabel}</h2>
          <p id="product-description" class="p-desc">${escapeHtml(mainDesc)}</p>
          <h2 class="p-name">${t('product.category')}</h2>
          <p class="p-desc">${escapeHtml(category?.name || '')}</p>
          <h2 class="p-name">${t('product.flavors')}</h2>
          ${flavorsList}
        </div>
      </div>

      <section class="review-section container">
        <div class="review-form-box">
          <h3>${t('product.write_review')}</h3>
          <form id="product-review-form" class="review-form">
            <div class="review-grid">
              <div class="input-container">
                <input type="text" id="review-name" name="review-name" placeholder=" " required>
                <label for="review-name">${t('product.name')}</label>
              </div>
              <div class="input-container">
                <input type="email" id="review-email" name="review-email" placeholder=" " required>
                <label for="review-email">${t('product.email')}</label>
              </div>
            </div>
            <div class="input-container">
              <select id="review-rating" name="review-rating" required>
                <option value="">${t('product.select_rating')}</option>
                <option value="5">${t('product.rating_5')}</option>
                <option value="4">${t('product.rating_4')}</option>
                <option value="3">${t('product.rating_3')}</option>
                <option value="2">${t('product.rating_2')}</option>
                <option value="1">${t('product.rating_1')}</option>
              </select>
              <label for="review-rating" class="fixed-label">${t('product.rating')}</label>
            </div>
            <div class="input-container">
              <textarea id="review-message" name="review-message" rows="4" placeholder=" " required></textarea>
              <label for="review-message">${t('product.review')}</label>
            </div>
            <button type="submit" class="submit-review-btn">${t('product.submit_review')}</button>
          </form>
          <p id="review-feedback" class="review-feedback"></p>
        </div>

        <div class="review-list-box">
          <h3>${t('product.customer_reviews')}</h3>
          <div id="reviews-list" class="reviews-list"></div>
        </div>
      </section>

      <p class="chooseUrFav">${t('product.related')} <span>${t('product.products')}</span></p>
      <div class="related-products">${relatedProducts}</div>
    </div>
    ${Footer()}
  `;
}
