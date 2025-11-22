
import { Link } from "react-router-dom";
import { storage } from "../appwrite";


export default function Card({product}) {
    const imageSrc = storage.getFileView({
        bucketId: import.meta.env.VITE_BUCKET_ID,
        fileId: product.flavors ? product.flavors[0].image : product.image
    });
    // console.log(product);
    return <div className="card">
        <img src={imageSrc} />
        <Link to={`/product/${product.$id}`}>
            <button>
                {product.name}<i className="fa-regular fa-circle-right"></i>
            </button>
        </Link>
    </div>
}