import logo from '../assets/logo.png';

export function Footer() {
  const year = new Date().getFullYear();

  return `
    <footer>
      <div class="social">
        <div class="info">
          <div class="logo">
            <img src="${logo}" alt="Sundae logo" />
          </div>
          <p>
            Premium ice cream crafted with rich ingredients and bold flavors.
            Follow us for updates, seasonal drops, and special offers.
          </p>
        </div>

        <div class="social-icons">
          <p>Follow Us</p>
          <div class="icons">
            <a href="#" aria-label="Sundae on Facebook"><i class="fa-brands fa-facebook"></i></a>
            <a href="#" aria-label="Sundae on LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
            <a href="#" aria-label="Sundae on Instagram"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>

      <div class="contact">
        <p><i class="fa-solid fa-mobile-screen"></i>0100024242302</p>
        <p><i class="fa-solid fa-envelope"></i>sundae@me.org</p>
        <p><i class="fa-regular fa-copyright"></i>${year} Sundae</p>
      </div>
    </footer>
  `;
}
