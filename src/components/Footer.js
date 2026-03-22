// import logo from '../assets/logo.png';

const logo = "https://res.cloudinary.com/debrtvbnc/image/upload/v1774183595/logo_jchsfg.png"

export function Footer() {
  const year = new Date().getFullYear();

  return `
    <footer>
      <div class="social">
        <div class="info">
          <div class="logo">
            <a href="#/"><img src="${logo}" alt="Sundae logo" /></a>
          </div>
          <p>6th Million Industrial Zone, 10th of Ramadan City, Sharqia, Egypt <br> 10th of Ramadan City, under El Talta Bridge</p>
        </div>

        <div class="social-icons">
          <p>Follow Us</p>
          <div class="icons">
            <a href="https://www.facebook.com/sundaeicee" target="blank" aria-label="Sundae on Facebook"><i class="fa-brands fa-facebook"></i></a>
            <a href="https://www.tiktok.com/@sundaeicecream.eg" target="blank" aria-label="Sundae on TikTok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="https://www.instagram.com/ice_cream_sundae" target="blank" aria-label="Sundae on Instagram"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>

      <div class="contact">
        <p class="contact-title">Contact Us</p>
        <div class="contact-item">
          <span class="contact-label">Sales Customer Service</span>
          <a class="contact-value" href="tel:01066245666">01066245666</a>
        </div>
        <div class="contact-item">
          <span class="contact-label">Complaints Customer Service</span>
          <a class="contact-value" href="tel:01211604000">01211604000</a>
        </div>
        <p class="contact-line">
          <i class="fa-solid fa-envelope"></i>
          <a class="contact-value" href="mailto:sundaeice25@gmail.com">sundaeice25@gmail.com</a>
        </p>
        <p class="contact-line"><i class="fa-regular fa-copyright"></i>${year} Sundae</p>
      </div>
    </footer>
  `;
}
