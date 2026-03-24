// import logo from '../assets/logo.png';
import { getLang, t } from '../utils/i18n.js';

const logo = "https://res.cloudinary.com/debrtvbnc/image/upload/v1774183595/logo_jchsfg.png"

export function Header() {
  const currentLang = getLang();
  const switchLabel = currentLang === 'en' ? 'AR' : 'EN';
  return `
    <header>
      <div class="logo"><a href="#/"><img src="${logo}" alt="logo" /></a></div>
      <ul>
        <li><a href="#/"><i class="fa-solid fa-house"></i>${t('nav.home')}</a></li>
        <li><a href="#/about"><i class="fa-solid fa-circle-info"></i>${t('nav.about')}</a></li>
        <li><a href="#/products"><i class="fa-brands fa-product-hunt"></i>${t('nav.products')}</a></li>
        <li><a href="#/location"><i class="fa-solid fa-location-dot"></i>${t('nav.location')}</a></li>
        <li class="lang-item"><button class="lang-switch" type="button" onclick="window.toggleLang()">${switchLabel}</button></li>
      </ul>
      <div class="burger-menu" onclick="showSidebar()"><i class="fa-solid fa-bars"></i></div>
    </header>
  `;
}

// Function to show/hide sidebar (needs to be global for onclick)
window.showSidebar = function() {
  document.querySelector('header ul').classList.toggle('show');
};
