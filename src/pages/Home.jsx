/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// APIs
import {storage, tablesDb} from '../appwrite.js';
// components
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Card from "../components/Card.jsx";
import { products, categories } from "../App.jsx";
// images
import sliderImage from "../assets/slider 1.png";
import storyImage from "../assets/Slider 2.png";
import figure from "../assets/Figure.png";
import followImage1 from "../assets/follow-image1.png";
import followImage2 from "../assets/follow-image2.png";
import followImage3 from "../assets/follow-image3.png";
import followImage4 from "../assets/follow-image4.png";
import followImage5 from "../assets/follow-image5.png";

export default function Home() {
  // const [products, setProducts] = useState([]);
  // const [categories, setcategories] = useState([]);

  // useEffect(() => {
  //   try {
  //     tablesDb.listRows({
  //       databaseId: import.meta.env.VITE_DATABASE_ID,
  //       tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS
  //     }).then(res => setProducts(res.rows));
      
  //     tablesDb.listRows({
  //       databaseId: import.meta.env.VITE_DATABASE_ID,
  //       tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES
  //     }).then(res => setcategories(res.rows));
  //   } catch(err) {
  //     console.log("ERROR: ", err);
  //   }
  // }, [])

  const showProducts = products.map((product) => {
    return <Card key={product.$id} product={product} />
  })
  
  const showCategories = categories.map(category => {
    return <Card key={category.$id} product={category} />
  })

  return (
    <>
      <Header />
      <div id="home"><img src={sliderImage} alt="Sundae ice cream" /></div>
      <div className="story">
        <div className="container">
          <div className="story-info">
            <div className="left">
              <h3>The story of Sundae Ice Cream</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur. Enim nibh gravida morbi
                nisl magnis id aliquet. Et euismod nisi donec egestas fames
                urna. Lectus ut quam massa viverra vel enim. Interdum faucibus
                facilisis turpis fermentum.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur. Enim nibh gravida morbi
                nisl magnis id aliquet. Et euismod nisi donec egestas fames
                urna. Lectus ut quam massa viverra vel enim. Interdum faucibus
                facilisis turpis fermentum.
              </p>
            </div>
            <div className="right"><img src={storyImage} alt="Our story" /></div>
          </div>
        </div>
      </div>
      <div className="ent">
        <div className="container">
          <div className="banner">
            <div className="left">
              <img src={figure} alt="Ice cream figure" />
            </div>
            <div className="right">
              <h2>
                Relive the Sweet
                <br /> Memories of Classic
                <br /> <span>Ice Creams</span>
              </h2>
              <p>
                From rich chocolate fudge to creamy vanilla sundaes, discover
                our menu of classic ice cream creations.
              </p>
              <button className="btn-sky">Explore Our Menu<i className="fa-solid fa-arrow-right"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div className="categories">
        <div className="container">
          <h2>Choose your favorite ice cream category</h2>
          <div className="categ-cards">{showCategories}</div>
        </div>
      </div>
      <div className="products">
        <div className="container">
          <h2>Sundae Products</h2>
          <p>Some Of Our Best Products</p>
          <div className="products-cards">{showProducts}</div>
          <div style={{ textAlign: "center" }}>
            <Link to="/products">
              <button className="btn-sky">View all Products<i className="fa-regular fa-circle-right"></i></button>
            </Link>
          </div>
        </div>
      </div>
      <div className="follow-us">
        <div className="container">
          <div className="follow-images">
            <h2>Follow Us on <span>Instagram</span></h2>
            <p>Join our Instagram community for updates, special deals, and more!</p>
            <div className="imgs">
              <div><img src={followImage1} alt="Instagram post 1" /></div>
              <div><img src={followImage2} alt="Instagram post 2" /></div>
              <div><img src={followImage3} alt="Instagram post 3" /></div>
              <div><img src={followImage4} alt="Instagram post 4" /></div>
              <div><img src={followImage5} alt="Instagram post 5" /></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
