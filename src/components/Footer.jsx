import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer>
        <div className="social">
            <div className="info">
                <div className="logo"><img src={logo} alt="s" /></div>
                <p>Lorem ipsum dolor sit amet consectetur. Nascetur a purus rhoncus id enim a etiam.</p>
            </div>
            <div className="social-icons">
                <p>Follow Us</p>
                <div className="icons">
                    <i className="fa-brands fa-facebook"></i>
                    <i className="fa-brands fa-linkedin"></i>
                    <i className="fa-brands fa-instagram"></i>
                </div>
            </div>
        </div>
        <div className="contact">
            <p><i className="fa-solid fa-mobile-screen"></i>0100024242302</p>
            <p><i className="fa-solid fa-envelope"></i>sundae@me.org</p>
        </div>
    </footer>
  );
}