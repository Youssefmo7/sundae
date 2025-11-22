/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
// components
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import Card from '../components/Card.jsx'
import {products} from '../App.jsx'
// APIs
import { storage, tablesDb } from '../appwrite.js';

export default function Products() {
  // const [products, setProducts] = useState([]);
  // const [categories, setcategories] = useState([]);

  // useEffect(() => {
  //   try {
  //     tablesDb.listRows({
  //       databaseId: import.meta.env.VITE_DATABASE_ID,
  //       tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS
  //     }).then(res => setProducts(res.rows));
      
  //     // tablesDb.listRows({
  //     //   databaseId: import.meta.env.VITE_DATABASE_ID,
  //     //   tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES
  //     // }).then(res => setcategories(res.rows));
  //   } catch(err) {
  //     console.log("ERROR: ", err);
  //   }
  // }, [])

  const showProducts = products.map(product => {
      const imageScr = storage.getFileView({
        bucketId: import.meta.env.VITE_BUCKET_ID,
        fileId: product.flavors[0].image
      });
      return <Card key={product.$id} product={product} name={product.name} imageSrc={imageScr} />
    })

  return (
    <>
      <Header />
      <div className="products-banner"><p>Our Products</p></div>
      <p className="chooseUrFav">Choose Your <span>Favourite</span></p>
      <div className="products">
        <div className="container">
          <div class="products-cards">{showProducts}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}