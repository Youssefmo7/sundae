import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'

export default function Header() {
  function showSidebar() {
    document.querySelector('header ul').classList.toggle('show');
  }
  return (
    <header>
      <div className="logo"><img src={logo} alt="logo" /></div>
      <ul>
        <li><i className="fa-solid fa-house"></i><Link to="/">Home</Link></li>
        <li><i className="fa-solid fa-circle-info"></i><Link to="/About">About Us</Link></li>
        <li><i className="fa-brands fa-product-hunt"></i><Link to="/Products">Products</Link></li>
        <li><i className="fa-solid fa-location-dot"></i><Link to="/Location">Our Location</Link></li>
      </ul>
      <div className="burger-menu" onClick={showSidebar}><i className="fa-solid fa-bars"></i></div>
    </header>
  );
}