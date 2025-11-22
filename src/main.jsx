import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// styles
import "./styles/index.css";
import "./styles/font-face.css";
import "./styles/all.min.css";
import "./styles/admin.css";
import "./styles/products.css";
import "./styles/location.css";
import "./styles/viewProduct.css";
// app
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
