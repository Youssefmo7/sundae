import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { Card } from '../components/Card.js';
import getProducts from '../utils/getProducts.js'
import { getCachedCategories } from '../utils/dataCache.js';
import { t } from '../utils/i18n.js';

let currentPage = 1;
const PAGE_SIZE = 12;
let allProducts = [];
let filteredProducts = [];

async function renderPage(n) {
  currentPage = n;
  const start = (n - 1) * PAGE_SIZE;
  const pageItems = filteredProducts.slice(start, start + PAGE_SIZE);
  const cardsContainer = document.querySelector('.products-cards');

  if (!cardsContainer) return;

  if (!pageItems.length) {
    cardsContainer.innerHTML = `<p class="p-desc">${t('products.no_results')}</p>`;
    return;
  }

  cardsContainer.innerHTML = pageItems.map(product => Card(product)).join('');
}

async function renderPagesNav() {
  const pagesNo = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  let pages = document.querySelector('.pages');
  let pagesInnerHtml = '<div id="page-prev"><i class="fa-solid fa-angle-left"></i></div>';
  for(let i = 1; i <= pagesNo; i++) {
    pagesInnerHtml += `<div class="${i == 1 ? "active-page" : ""}" data-page="${i}">${i}</div>`
  }
  pagesInnerHtml += `<div id="page-next"><i class="fa-solid fa-angle-right"></i></div>`
  pages.innerHTML = pagesInnerHtml;
  document.getElementById('page-next').addEventListener('click', e => {
    if(currentPage < pages.childElementCount-2) {
      pages.querySelector(`div[data-page="${currentPage}"`).classList.remove('active-page');
      pages.querySelector(`div[data-page="${currentPage+1}"`).classList.add('active-page');
      renderPage(currentPage+1);
    }
  })
  document.getElementById('page-prev').addEventListener('click', e => {
    if(currentPage > 1) {
      pages.querySelector(`div[data-page="${currentPage}"`).classList.remove('active-page');
      pages.querySelector(`div[data-page="${currentPage-1}"`).classList.add('active-page');
      renderPage(currentPage-1);
    }
  })
  let pagesNavs = document.querySelectorAll('.pages div[data-page]');
  pagesNavs.forEach(div => 
    div.addEventListener('click', (e) => {
      renderPage(e.target.dataset.page)
      pagesNavs.forEach(nav => nav.classList.remove('active-page'));
      e.target.classList.add('active-page')
    })
  );
}

function applyFilters() {
  const searchInput = document.getElementById('product-search');
  const categorySelect = document.getElementById('category-filter');
  const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const categoryId = categorySelect ? categorySelect.value : 'all';

  filteredProducts = allProducts.filter((product) => {
    const matchesTerm = term
      ? String(product.name || '').toLowerCase().includes(term) ||
        String(product.slogan || '').toLowerCase().includes(term)
      : true;
    const matchesCategory = categoryId === 'all' ? true : String(product.category || '') === String(categoryId);
    return matchesTerm && matchesCategory;
  });
}

async function setupFilters() {
  const categories = await getCachedCategories();
  const select = document.getElementById('category-filter');
  if (select) {
    const options = categories
      .map((cat) => `<option value="${cat.$id}">${cat.name || 'Category'}</option>`)
      .join('');
    select.innerHTML = `<option value="all">${t('products.all_categories')}</option>${options}`;
  }

  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyFilters();
      renderPagesNav();
      renderPage(1);
    });
  }

  if (select) {
    select.addEventListener('change', () => {
      applyFilters();
      renderPagesNav();
      renderPage(1);
    });
  }
}

export async function ProductsFunctions() {
  allProducts = (await getProducts(0, 0)).rows;
  filteredProducts = allProducts.slice();
  await setupFilters();
  renderPagesNav();
  renderPage(1);
}

export function Products() {
  return `
    ${Header()}
    <h1 class="sr-only">Sundae Ice Cream | صنداي آيس كريم</h1>
    <div class="products-banner"><p>${t('products.banner_title')}</p><h6 class="path">${t('products.path')}</h6></div>
    <div class="products">
      <p class="chooseUrFav">${t('products.choose_prefix')} <span>${t('products.choose_highlight')}</span></p>
      <div class="container">
        <div class="products-controls">
          <div class="products-search">
            <input id="product-search" type="text" placeholder="${t('products.search_placeholder')}" />
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <div class="products-filter">
            <select id="category-filter" aria-label="Filter by category">
              <option value="all">${t('products.all_categories')}</option>
            </select>
          </div>
        </div>
        <div class="products-cards"></div>
      </div>
      <div class="pages">
        
        
      </div>
    </div>
    ${Footer()}
  `;
}
