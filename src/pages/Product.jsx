import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card.jsx';
import { storage } from '../appwrite.js';
import { products } from '../App.jsx';

export default function Product() {
    const [imageUrls, setImageUrls] = useState([]);
    const [product, setProduct] = useState({});
    const [Image, setImage] = useState('');
    
    const { id } = useParams();

    useEffect(() => {
        setProduct(products.find(p => p.$id === id));
    }, [id]);

    useEffect(() => {
        if (product.flavors) {
            setImageUrls(product.flavors.map(flavor => {
                const url = storage.getFileView({
                    bucketId: import.meta.env.VITE_BUCKET_ID,
                    fileId: flavor.image
                });
                return url;
            }));
        }
    }, [product]);

    useEffect(() => {
        if (imageUrls.length > 0) {
            setImage(imageUrls[0]);
        }
    }, [imageUrls]);

    let shuffeledProducts = products.sort(() => 0.5 - Math.random());
    shuffeledProducts = shuffeledProducts.slice(0, 4).map(
        p => <Card key={p.$id} product={p} />)
    // console.log(imageUrls);
    // console.log(Image);
    return <>
    <Header />
    <div className="product-banner"><p>{product.name}</p></div>
    <div className="product-page">
        <div className='product-preview'>
            <img src={Image} alt={product.name} />
            <div className='flavors-images'>
                {imageUrls.map((url, i) => {
                    return (
                    <div key={i} className='image-box' onClick={() => setImage(url)}>
                        <img src={url} alt='' />
                    </div>
                )})}
            </div>
        </div>
        <div className='product-details' style={{display: 'inline-block', marginLeft: '20px'}}>
            <h2>Product Details</h2>
            {/* <p><b>Name: </b>{product.name}</p> */}
            <p>{product.description}</p>
            <p><b>Flavors :</b></p>
            <ul style={{listStyle: 'none', marginBottom: '20px'}}>
                {product?.flavors?.map((flavor, index) => {
                    return <li key={index}>{flavor.name}</li>
                })}
            </ul>
            <Link to="/location" >
                <button className='btn-sky'>Make Your Order</button>
            </Link>
        </div>
    </div>
    <p className='chooseUrFav'>Related <span>Products</span></p>
    <div className="related-products">
        {shuffeledProducts}
    </div>
    <Footer />
    </>
}