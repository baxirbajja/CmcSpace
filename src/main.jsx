import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// Importer la configuration axios
import "./utils/axiosConfig.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <h4 className="copyright">
      Copyright © 2025 CMC Spaces. Tous droits réservés.
      <br />
      <a
        href="https://cmc.ac.ma/fr/cmc-rabat-sale-kenitra"
        target="_blank"
        rel="noopener noreferrer"
      >
        CMC Rabat
      </a>
      <span>  | </span>
      <a href="/admin/login">Admin </a>
    </h4>
  </StrictMode>
);
