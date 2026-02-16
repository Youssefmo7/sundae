import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { Card } from '../components/Card.js';
import getProducts from '../utils/getProducts.js'

let currentPage = 1;

async function renderPage(n) {
  currentPage = n;
  let products = sessionStorage.getItem(`products_page${n}`);
  if(products) {
    products = JSON.parse(products);
  } else {
    console.log('session');
    products = (await getProducts(5, (n-1) * 5)).rows;
    sessionStorage.setItem(`products_page${n}`, JSON.stringify(products));
  }
  // console.log(products);
  document.querySelector('.products-cards').innerHTML = products.map(product => Card(product)).join('');
}

async function renderPagesNav() {
  const pagesNo = Math.ceil((await getProducts(1)).total / 5);
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

export async function ProductsFunctions() {
  renderPagesNav();
  renderPage(1);
}

export function Products() {
  return `
    ${Header()}
    <div class="products-banner"><p>Our Products</p><h6 class="path">Home / Products</h6></div>
    <div class="products">
      <p class="chooseUrFav">Choose Your <span>Favourite</span></p>
      <div class="container">
        <div class="products-cards"></div>
      </div>
      <div class="pages">
        
        
      </div>
    </div>
    ${Footer()}
  `;
}