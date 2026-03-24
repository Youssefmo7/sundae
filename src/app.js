
// Import page components
import { Home, HomeFunctions } from "./pages/Home.js";
import * as Products from "./pages/Products.js";
import { Product } from "./pages/Product.js";
import { Location, LocationFunctions } from "./pages/Location.js";
import { About } from './pages/About.js';

// Import appwrite
import { tablesDb } from "./appwrite.js";
import { Query } from "appwrite";
import { ensureInitialData } from "./utils/dataCache.js";
import { applyLang, getLang, setLang, t } from "./utils/i18n.js";

const BASE_URL = "https://sundaeice.com/";
const DEFAULT_TITLE = "Sundae Ice Cream";
const DEFAULT_DESC = "Sundae Ice Cream offers delicious ice cream flavors crafted with premium ingredients.";
const OG_IMAGE = "https://res.cloudinary.com/debrtvbnc/image/upload/v1774183595/logo_jchsfg.png";

function buildUrl(route) {
  if (!route || route === "/") return BASE_URL;
  return `${BASE_URL}${route}`;
}

function setMeta({ title, description, route, type = "website" }) {
  const metaTitle = title || DEFAULT_TITLE;
  const metaDesc = description || DEFAULT_DESC;
  const url = buildUrl(route);

  document.title = metaTitle;
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) descTag.setAttribute("content", metaDesc);

  const canonical = document.getElementById("canonical-link");
  if (canonical) canonical.setAttribute("href", url);

  const ogTitle = document.getElementById("og-title");
  const ogDesc = document.getElementById("og-description");
  const ogType = document.getElementById("og-type");
  const ogUrl = document.getElementById("og-url");
  const ogImage = document.getElementById("og-image");
  if (ogTitle) ogTitle.setAttribute("content", metaTitle);
  if (ogDesc) ogDesc.setAttribute("content", metaDesc);
  if (ogType) ogType.setAttribute("content", type);
  if (ogUrl) ogUrl.setAttribute("content", url);
  if (ogImage) ogImage.setAttribute("content", OG_IMAGE);

  const twTitle = document.getElementById("twitter-title");
  const twDesc = document.getElementById("twitter-description");
  const twImage = document.getElementById("twitter-image");
  if (twTitle) twTitle.setAttribute("content", metaTitle);
  if (twDesc) twDesc.setAttribute("content", metaDesc);
  if (twImage) twImage.setAttribute("content", OG_IMAGE);
}

function setJsonLd(data) {
  const existing = document.getElementById("product-jsonld");
  if (existing) {
    existing.remove();
  }
  if (!data) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "product-jsonld";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

function setRouteMeta(route) {
  switch (route) {
    case "/":
      setMeta({ title: "Sundae Ice Cream", description: DEFAULT_DESC, route });
      break;
    case "/products":
      setMeta({ title: "Products | Sundae Ice Cream", description: "Browse our full range of ice cream products and flavors.", route });
      break;
    case "/about":
      setMeta({ title: "About Us | Sundae Ice Cream", description: "Learn about Sundae Ice Cream, our story, and our commitment to quality.", route });
      break;
    case "/location":
      setMeta({ title: "Our Location | Sundae Ice Cream", description: "Get in touch with Sundae Ice Cream and find our location.", route });
      break;
    default:
      setMeta({ title: DEFAULT_TITLE, description: DEFAULT_DESC, route });
      break;
  }
}

// const products = await tablesDb.listRows({
//   databaseId: import.meta.env.VITE_DATABASE_ID,
//   tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
//   queries: [
//     Query.select(["$id", "name", "image"])
//   ]
// })

// Simple router
function getCurrentRoute() {
  return window.location.pathname || "/";
}


export async function renderPage() {
  applyLang();
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
      setRouteMeta(route);
      appDiv.innerHTML = Home();
      HomeFunctions();
      setJsonLd(null);
      break;
    case '/products':
      setRouteMeta(route);
      appDiv.innerHTML = Products.Products();
      Products.ProductsFunctions();
      setJsonLd(null);
      break;
    case '/location':
      setRouteMeta(route);
      appDiv.innerHTML = Location();
      LocationFunctions();
      setJsonLd(null);
      break;
    case '/about':
      setRouteMeta(route);
      appDiv.innerHTML = About();
      setJsonLd(null);
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
          const desc = product.slogan || product.description || DEFAULT_DESC;
          setMeta({
            title: `${product.name} | Sundae Ice Cream`,
            description: desc,
            route,
            type: "product"
          });
          setJsonLd({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name || "Sundae Ice Cream",
            "image": product.image ? [product.image] : [OG_IMAGE],
            "description": desc,
            "brand": {
              "@type": "Brand",
              "name": "Sundae Ice Cream"
            },
            "url": buildUrl(route)
          });
          appDiv.innerHTML = await Product({ product });
        } else {
          setMeta({ title: t('product.not_found'), description: DEFAULT_DESC, route });
          setJsonLd(null);
          appDiv.innerHTML = `<h1>${t('product.not_found')}</h1>`;
        }
      } else {
        setMeta({ title: t('app.page_not_found'), description: DEFAULT_DESC, route });
        setJsonLd(null);
        appDiv.innerHTML = `<h1>${t('app.page_not_found')}</h1>`;
      }
      break;
  }

  // Add event listeners for navigation
  addNavigationListeners();
}

// Handle navigation
function addNavigationListeners() {
  // Handle link clicks for internal navigation
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
      return;
    }
    link.addEventListener('click', (e) => {
      if (href.startsWith('/')) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        renderPage();
      }
    });
  });

  // Handle browser back/forward
  window.addEventListener('popstate', renderPage);
}


// Initialize app
export async function initApp() {
  await ensureInitialData();
  renderPage();
}

window.toggleLang = function() {
  const current = getLang();
  const next = current === 'en' ? 'ar' : 'en';
  setLang(next);
  applyLang();
  renderPage();
};
