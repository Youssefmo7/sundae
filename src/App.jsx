/* eslint-disable react-refresh/only-export-components */
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { tablesDb } from "./appwrite.js";
import { Query } from "appwrite";
// pages
import Location from "./pages/Location.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import { AuthProvider } from "./utils/AuthContext.jsx";
import Product from "./pages/Product.jsx";

async function getProducts() {
  const response = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS
  })
  return response.rows;
}

async function getCategories() {
  const response = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES
  })
  return response.rows;
}

export default function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product">
            <Route path=":id" element={<Product />} />
          </Route>
          <Route path="/location" element={<Location />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

const categories = await getCategories();
let products = await getProducts();

products = products.map(async (product) => {
  let flavors = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_FLAVORS,
    queries: [
      Query.equal('productId', product.$id)
    ]
  })
  return {...product, flavors: flavors.rows}
})
products = await Promise.all(products);
// console.log(products);
export { products, categories };