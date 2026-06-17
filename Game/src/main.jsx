import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "../src/components/ui/provider";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider>
      <StrictMode>
        <App />
      </StrictMode>
    </Provider>
    
  </BrowserRouter>
);
