/**
 =========================================================
 * Material Tailwind Dashboard React - v2.1.0
 =========================================================
 * Product Page: https://www.creative-tim.com/product/material-tailwind-dashboard-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-tailwind-dashboard-react/blob/main/LICENSE.md)
 * Coded by Creative Tim
 =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@material-tailwind/react";
import {MaterialTailwindControllerProvider} from "@/context";
import "../public/css/tailwind.css";
import "../public/css/base.css";

// Import Swiper styles
import 'swiper/css';  // Core Swiper
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {Provider} from "react-redux";
import {appStore} from "./store/store";


// <React.StrictMode>
// </React.StrictMode>

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={appStore}>
        <BrowserRouter>
            <ThemeProvider>
                <MaterialTailwindControllerProvider>
                    <App/>
                </MaterialTailwindControllerProvider>
            </ThemeProvider>
        </BrowserRouter>
    </Provider>

);
