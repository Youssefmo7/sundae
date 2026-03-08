
// Import page components
import { Home, HomeFunctions } from "./pages/Home.js";
import * as Products from "./pages/Products.js";
import { Product } from "./pages/Product.js";
import { Location } from "./pages/Location.js";
import { About } from './pages/About.js';

// Import appwrite
import { tablesDb } from "./appwrite.js";
import { Query } from "appwrite";

// const products = await tablesDb.listRows({
//   databaseId: import.meta.env.VITE_DATABASE_ID,
//   tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
//   queries: [
//     Query.select(["$id", "name", "image"])
//   ]
// })

// Simple router
function getCurrentRoute() {
  const path = window.location.pathname;
  const hash = window.location.hash.substring(1);
  return hash || path;
}

export async function renderPage() {
  const route = getCurrentRoute();
  const root = document.getElementById('root');

  // Clear current content
  root.innerHTML = '';

  // Show loading if data not ready
  // if (isLoading) {
  //   root.innerHTML = '<div style="text-align: center; padding: 50px;"><h1>Loading...</h1></div>';
  //   return;
  // }

  // Create app container
  const appDiv = document.createElement('div');
  appDiv.className = 'App';
  root.appendChild(appDiv);

  // Check authentication for protected routes
  if (route === '/admin') {
    window.location.href = './../login.html';
    return;
  }

  // Route to appropriate component
  switch (route) {
    case '/':
      appDiv.innerHTML = Home();
      HomeFunctions();
      break;
    case '/products':
      appDiv.innerHTML = Products.Products();
      Products.ProductsFunctions();
      break;
    case '/location':
      appDiv.innerHTML = Location();
      break;
    case '/about':
      appDiv.innerHTML = About();
      break;
    default:
      // Check if it's a product route /product/:id
      if (route.startsWith('/products/')) {
        const productId = route.split('/')[2];
        // console.log(route.split('/'));
        // console.log(productId);
        let product = await tablesDb.listRows({
          databaseId: import.meta.env.VITE_DATABASE_ID,
          tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
          queries: [
            Query.equal("$id", productId)
          ],
          total: false
        });
        product = product.rows[0];
        if (product) {
          appDiv.innerHTML = await Product({ product });
        } else {
          appDiv.innerHTML = '<h1>Product not found</h1>';
        }
      } else {
        appDiv.innerHTML = '<h1>Page not found</h1>';
      }
      break;
  }

  // Add event listeners for navigation
  addNavigationListeners();
}

// Handle navigation
function addNavigationListeners() {
  // Handle link clicks
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      window.location.hash = href;
      renderPage();
    });
  });

  // Handle browser back/forward
  window.addEventListener('popstate', renderPage);
  window.addEventListener('hashchange', renderPage);
}


// Initialize app
export async function initApp() {
  renderPage();
}