import logo from '../assets/logo.png';

export function Header() {
  return `
    <header>
      <div class="logo"><img src="${logo}" alt="logo" /></div>
      <ul>
        <li><a href="#/"><i class="fa-solid fa-house"></i>Home</a></li>
        <li><a href="#/about"><i class="fa-solid fa-circle-info"></i>About Us</a></li>
        <li><a href="#/products"><i class="fa-brands fa-product-hunt"></i>Products</a></li>
        <li><a href="#/location"><i class="fa-solid fa-location-dot"></i>Our Location</a></li>
      </ul>
      <div class="burger-menu" onclick="showSidebar()"><i class="fa-solid fa-bars"></i></div>
    </header>
  `;
}

// Function to show/hide sidebar (needs to be global for onclick)
window.showSidebar = function() {
  document.querySelector('header ul').classList.toggle('show');
};