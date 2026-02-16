import logo from '../assets/logo.png';

export function Footer() {
  return `
    <footer>
      <div class="social">
        <div class="info">
          <div class="logo"><img src="${logo}" alt="s" /></div>
        </div>
        <br><br><br><br>
        <div class="social-icons">
          <p>Follow Us</p>
          <div class="icons">
            <i class="fa-brands fa-facebook"></i>
            <i class="fa-brands fa-linkedin"></i>
            <i class="fa-brands fa-instagram"></i>
          </div>
        </div>
        <p>Lorem ipsum dolor sit amet consectetur. Nascetur a purus rhoncus id enim a etiam.</p>
      </div>
      <div class="contact">
        <p><i class="fa-solid fa-mobile-screen"></i>0100024242302</p>
        <p><i class="fa-solid fa-envelope"></i>sundae@me.org</p>
      </div>
    </footer>
  `;
}